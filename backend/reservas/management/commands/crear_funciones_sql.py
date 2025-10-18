from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Crear funciones SQL personalizadas en PostgreSQL'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            # Función 1: Calcular días de estancia
            cursor.execute("""
                CREATE OR REPLACE FUNCTION calcular_dias_estancia(
                    fecha_inicio DATE,
                    fecha_fin DATE
                ) RETURNS INTEGER AS $$
                BEGIN
                    IF fecha_fin IS NULL OR fecha_inicio IS NULL THEN
                        RETURN 0;
                    END IF;
                    RETURN fecha_fin - fecha_inicio;
                END;
                $$ LANGUAGE plpgsql;
            """)

            # Función 2: Validar disponibilidad de habitación
            cursor.execute("""
                CREATE OR REPLACE FUNCTION validar_disponibilidad_habitacion(
                    p_habitacion_id INTEGER,
                    p_fecha_llegada DATE,
                    p_fecha_salida DATE
                ) RETURNS BOOLEAN AS $$
                DECLARE
                    conflicto_count INTEGER;
                BEGIN
                    SELECT COUNT(*) INTO conflicto_count
                    FROM reservas_reservacion 
                    WHERE habitacion_id = p_habitacion_id
                    AND estado IN ('PENDIENTE', 'CONFIRMADA', 'EN_CURSO')
                    AND (
                        (p_fecha_llegada >= fecha_llegada AND p_fecha_llegada < fecha_salida) OR
                        (p_fecha_salida > fecha_llegada AND p_fecha_salida <= fecha_salida) OR
                        (p_fecha_llegada <= fecha_llegada AND p_fecha_salida >= fecha_salida)
                    );
                    
                    RETURN conflicto_count = 0;
                END;
                $$ LANGUAGE plpgsql;
            """)

            # Función 3: Calcular precio total con descuentos
            cursor.execute("""
                CREATE OR REPLACE FUNCTION calcular_precio_total(
                    p_tipo_habitacion_id INTEGER,
                    p_fecha_llegada DATE,
                    p_fecha_salida DATE,
                    p_descuento DECIMAL DEFAULT 0
                ) RETURNS DECIMAL AS $$
                DECLARE
                    precio_base DECIMAL;
                    dias_estancia INTEGER;
                    precio_total DECIMAL;
                BEGIN
                    -- Obtener precio base del tipo de habitación
                    SELECT precio_base INTO precio_base
                    FROM reservas_tipohabitacion 
                    WHERE id = p_tipo_habitacion_id;
                    
                    IF precio_base IS NULL THEN
                        RETURN 0;
                    END IF;
                    
                    -- Calcular días de estancia
                    dias_estancia := calcular_dias_estancia(p_fecha_llegada, p_fecha_salida);
                    
                    -- Calcular precio total
                    precio_total := precio_base * dias_estancia;
                    
                    -- Aplicar descuento si existe
                    IF p_descuento > 0 THEN
                        precio_total := precio_total - (precio_total * p_descuento / 100);
                    END IF;
                    
                    RETURN ROUND(precio_total, 2);
                END;
                $$ LANGUAGE plpgsql;
            """)

            # Función 4: Generar número de confirmación único
            cursor.execute("""
                CREATE OR REPLACE FUNCTION generar_numero_confirmacion() 
                RETURNS TEXT AS $$
                DECLARE
                    nuevo_numero TEXT;
                    contador INTEGER;
                BEGIN
                    -- Crear secuencia si no existe
                    CREATE SEQUENCE IF NOT EXISTS seq_confirmacion_hotel 
                    START WITH 1 INCREMENT BY 1;
                    
                    -- Generar número único
                    contador := nextval('seq_confirmacion_hotel');
                    nuevo_numero := 'HTL' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(contador::TEXT, 4, '0');
                    
                    -- Verificar que no exista (por seguridad)
                    WHILE EXISTS (SELECT 1 FROM reservas_reservacion WHERE numero_confirmacion = nuevo_numero) LOOP
                        contador := nextval('seq_confirmacion_hotel');
                        nuevo_numero := 'HTL' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(contador::TEXT, 4, '0');
                    END LOOP;
                    
                    RETURN nuevo_numero;
                END;
                $$ LANGUAGE plpgsql;
            """)

            self.stdout.write(
                self.style.SUCCESS('✅ 4 funciones SQL creadas exitosamente en PostgreSQL')
            )
            
            # Mostrar las funciones creadas
            cursor.execute("""
                SELECT routine_name, routine_definition 
                FROM information_schema.routines 
                WHERE routine_type = 'FUNCTION' 
                AND routine_schema = 'public'
                AND routine_name IN (
                    'calcular_dias_estancia',
                    'validar_disponibilidad_habitacion', 
                    'calcular_precio_total',
                    'generar_numero_confirmacion'
                )
                ORDER BY routine_name;
            """)
            
            funciones = cursor.fetchall()
            self.stdout.write("\n📋 Funciones creadas:")
            for func in funciones:
                self.stdout.write(f"  • {func[0]}")