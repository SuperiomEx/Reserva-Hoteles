from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from reservas.models import TipoHabitacion, Habitacion, Huesped, Reservacion
from decimal import Decimal
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Inicializa la base de datos con datos de ejemplo'
    
    def handle(self, *args, **options):
        self.stdout.write("🏨 Inicializando datos del hotel...")
        
        # 1. Crear superusuario si no existe
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@hotel.com',
                password='admin123',
                first_name='Administrador',
                last_name='Hotel'
            )
            self.stdout.write("✅ Superusuario 'admin' creado (password: admin123)")
        
        # 2. Crear tipos de habitación
        tipos_habitacion = [
            {
                'nombre': 'SENCILLA',
                'descripcion': 'Habitación individual con una cama sencilla',
                'capacidad_personas': 1,
                'precio_base': Decimal('50.00')
            },
            {
                'nombre': 'DOBLE',
                'descripcion': 'Habitación con dos camas individuales',
                'capacidad_personas': 2,
                'precio_base': Decimal('80.00')
            },
            {
                'nombre': 'MATRIMONIAL',
                'descripcion': 'Habitación con cama matrimonial',
                'capacidad_personas': 2,
                'precio_base': Decimal('90.00')
            },
            {
                'nombre': 'SUITE_JUNIOR',
                'descripcion': 'Suite junior con sala de estar',
                'capacidad_personas': 3,
                'precio_base': Decimal('150.00')
            },
            {
                'nombre': 'PRESIDENCIAL',
                'descripcion': 'Suite presidencial de lujo',
                'capacidad_personas': 4,
                'precio_base': Decimal('300.00')
            }
        ]
        
        for tipo_data in tipos_habitacion:
            tipo, created = TipoHabitacion.objects.get_or_create(
                nombre=tipo_data['nombre'],
                defaults=tipo_data
            )
            if created:
                self.stdout.write(f"✅ Tipo de habitación '{tipo.get_nombre_display()}' creado")
        
        # 3. Crear habitaciones (10 por tipo)
        contador = 1
        for tipo in TipoHabitacion.objects.all():
            for i in range(10):
                numero = f"{contador:03d}"
                habitacion, created = Habitacion.objects.get_or_create(
                    numero_habitacion=numero,
                    defaults={
                        'tipo_habitacion': tipo,
                        'descripcion': f'Habitación {numero} - {tipo.get_nombre_display()}',
                        'informacion_adicional': {
                            'vista': 'Ciudad' if contador % 2 == 0 else 'Jardín',
                            'wifi': True,
                            'aire_acondicionado': True,
                            'tv_cable': True,
                            'minibar': tipo.nombre in ['SUITE_JUNIOR', 'PRESIDENCIAL'],
                            'balcon': contador % 3 == 0
                        },
                        'estado': 'DISPONIBLE'
                    }
                )
                if created and i < 3:
                    self.stdout.write(f"  📍 Habitación {numero} creada")
                contador += 1
        
        total_habitaciones = Habitacion.objects.count()
        self.stdout.write(f"✅ {total_habitaciones} habitaciones en total")
        
        # 4. Crear huéspedes de ejemplo
        huespedes_ejemplo = [
            {
                'nombres': 'María',
                'apellidos': 'García López',
                'numero_identidad': '12345678',
                'correo_electronico': 'maria.garcia@email.com',
                'numero_contacto': '+51987654321',
                'sexo': 'F',
                'fecha_nacimiento': date(1985, 3, 15),
                'nacionalidad': 'Peruana'
            },
            {
                'nombres': 'Carlos',
                'apellidos': 'Rodríguez Silva',
                'numero_identidad': '87654321',
                'correo_electronico': 'carlos.rodriguez@email.com',
                'numero_contacto': '+51876543210',
                'sexo': 'M',
                'fecha_nacimiento': date(1990, 7, 22),
                'nacionalidad': 'Peruana'
            },
            {
                'nombres': 'Ana',
                'apellidos': 'Martínez Vega',
                'numero_identidad': '11223344',
                'correo_electronico': 'ana.martinez@email.com',
                'numero_contacto': '+51765432109',
                'sexo': 'F',
                'fecha_nacimiento': date(1988, 12, 5),
                'nacionalidad': 'Colombiana'
            },
            {
                'nombres': 'José',
                'apellidos': 'Fernández Cruz',
                'numero_identidad': '44332211',
                'correo_electronico': 'jose.fernandez@email.com',
                'numero_contacto': '+51654321098',
                'sexo': 'M',
                'fecha_nacimiento': date(1982, 9, 18),
                'nacionalidad': 'Mexicana'
            }
        ]
        
        for huesped_data in huespedes_ejemplo:
            huesped, created = Huesped.objects.get_or_create(
                numero_identidad=huesped_data['numero_identidad'],
                defaults=huesped_data
            )
            if created:
                self.stdout.write(f"✅ Huésped '{huesped.nombre_completo}' creado")
        
        # 5. Crear algunas reservaciones de ejemplo - CORREGIDO
        hoy = date.today()
        huespedes = list(Huesped.objects.all())
        habitaciones = list(Habitacion.objects.all()[:8])
        
        reservaciones_ejemplo = [
            {
                'huesped': huespedes[0],
                'habitacion': habitaciones[0],
                'fecha_llegada': hoy + timedelta(days=1),
                'fecha_salida': hoy + timedelta(days=4),
                'precio': Decimal('240.00'),
                'estado': 'CONFIRMADA',
                'metodo_pago': 'TARJETA'
            },
            {
                'huesped': huespedes[1],
                'habitacion': habitaciones[1],
                'fecha_llegada': hoy + timedelta(days=3),
                'fecha_salida': hoy + timedelta(days=7),
                'precio': Decimal('320.00'),
                'estado': 'PENDIENTE',
                'metodo_pago': 'EFECTIVO'
            },
            {
                'huesped': huespedes[2],
                'habitacion': habitaciones[2],
                'fecha_llegada': hoy + timedelta(days=5),
                'fecha_salida': hoy + timedelta(days=8),
                'precio': Decimal('270.00'),
                'estado': 'CONFIRMADA',
                'metodo_pago': 'TRANSFERENCIA'
            },
            {
                'huesped': huespedes[3],
                'habitacion': habitaciones[3],
                'fecha_llegada': hoy + timedelta(days=10),
                'fecha_salida': hoy + timedelta(days=13),
                'precio': Decimal('150.00'),
                'estado': 'PENDIENTE',
                'metodo_pago': 'TARJETA'
            }
        ]
        
        for reserva_data in reservaciones_ejemplo:
            try:
                if not Reservacion.objects.filter(
                    huesped=reserva_data['huesped'],
                    habitacion=reserva_data['habitacion']
                ).exists():
                    reserva = Reservacion.objects.create(**reserva_data)
                    self.stdout.write(f"✅ Reservación {reserva.numero_confirmacion} creada")
            except Exception as e:
                self.stdout.write(f"⚠️ Error creando reservación: {e}")
        
        # Resumen final
        self.stdout.write("\n" + "="*50)
        self.stdout.write("🎉 INICIALIZACIÓN COMPLETADA")
        self.stdout.write("="*50)
        self.stdout.write(f"📊 Estadísticas:")
        self.stdout.write(f"   • Tipos de habitación: {TipoHabitacion.objects.count()}")
        self.stdout.write(f"   • Habitaciones: {Habitacion.objects.count()}")
        self.stdout.write(f"   • Huéspedes: {Huesped.objects.count()}")
        self.stdout.write(f"   • Reservaciones: {Reservacion.objects.count()}")
        self.stdout.write(f"\n🔑 Credenciales de administrador:")
        self.stdout.write(f"   • Usuario: admin")
        self.stdout.write(f"   • Contraseña: admin123")
        self.stdout.write(f"   • Panel admin: http://localhost:8000/admin/")
        self.stdout.write("="*50)
