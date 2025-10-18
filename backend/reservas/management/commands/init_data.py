from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from reservas.models import (
    TipoHabitacion, Huesped, Habitacion, Reservacion, 
    Servicio, Empleado, Departamento, Dependiente, 
    ReservacionServicio, TelefonoHuesped, EmpleadoAdministrativo, 
    EmpleadoMantenimiento, AsignacionTurno
)
from decimal import Decimal
from datetime import date, timedelta

class Command(BaseCommand):
    help = 'Inicializa la base de datos con datos de ejemplo'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando carga de datos de ejemplo...')

        # Crear usuario administrador si no existe
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@hotel.com',
                'first_name': 'Admin',
                'last_name': 'Hotel',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Usuario admin creado'))

        # 1. Tipos de Habitación
        tipos_habitacion = [
            {'nombre': 'SENCILLA', 'descripcion': 'Habitación individual con cama sencilla', 'capacidad_personas': 1, 'precio_base': Decimal('50.00')},
            {'nombre': 'DOBLE', 'descripcion': 'Habitación con dos camas individuales', 'capacidad_personas': 2, 'precio_base': Decimal('80.00')},
            {'nombre': 'MATRIMONIAL', 'descripcion': 'Habitación con cama matrimonial', 'capacidad_personas': 2, 'precio_base': Decimal('90.00')},
            {'nombre': 'SUITE_JUNIOR', 'descripcion': 'Suite junior con sala de estar', 'capacidad_personas': 3, 'precio_base': Decimal('150.00')},
            {'nombre': 'PRESIDENCIAL', 'descripcion': 'Suite presidencial de lujo', 'capacidad_personas': 4, 'precio_base': Decimal('300.00')},
        ]

        for tipo_data in tipos_habitacion:
            tipo, created = TipoHabitacion.objects.get_or_create(
                nombre=tipo_data['nombre'],
                defaults={
                    'descripcion': tipo_data['descripcion'],
                    'capacidad_personas': tipo_data['capacidad_personas'],
                    'precio_base': tipo_data['precio_base'],
                    'created_by': admin_user,
                    'updated_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Tipo de habitación creado: {tipo.get_nombre_display()}')

        # 2. Departamentos
        departamentos_data = [
            {'nombre': 'Administración', 'presupuesto': Decimal('50000.00')},
            {'nombre': 'Mantenimiento', 'presupuesto': Decimal('30000.00')},
            {'nombre': 'Limpieza', 'presupuesto': Decimal('25000.00')},
            {'nombre': 'Recepción', 'presupuesto': Decimal('35000.00')},
            {'nombre': 'Seguridad', 'presupuesto': Decimal('20000.00')},
        ]

        for dept_data in departamentos_data:
            departamento, created = Departamento.objects.get_or_create(
                nombre=dept_data['nombre'],
                defaults={
                    'presupuesto': dept_data['presupuesto'],
                    'created_by': admin_user,
                    'updated_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Departamento creado: {departamento.nombre}')

        # 3. Empleados
        empleados_data = [
            {'nombres': 'Carlos', 'apellidos': 'González', 'cargo': 'Gerente General', 'salario': Decimal('3500.00'), 'departamento': 'Administración', 'direccion_calle': 'Av. Principal 123', 'direccion_ciudad': 'Ciudad Capital', 'direccion_codigo_postal': '12345'},
            {'nombres': 'Ana', 'apellidos': 'Martínez', 'cargo': 'Jefe de Mantenimiento', 'salario': Decimal('2800.00'), 'departamento': 'Mantenimiento', 'direccion_calle': 'Calle Secundaria 456', 'direccion_ciudad': 'Ciudad Capital', 'direccion_codigo_postal': '12346'},
            {'nombres': 'Luis', 'apellidos': 'Rodríguez', 'cargo': 'Recepcionista', 'salario': Decimal('1800.00'), 'departamento': 'Recepción', 'direccion_calle': 'Av. Central 789', 'direccion_ciudad': 'Ciudad Capital', 'direccion_codigo_postal': '12347'},
            {'nombres': 'María', 'apellidos': 'López', 'cargo': 'Supervisora de Limpieza', 'salario': Decimal('2200.00'), 'departamento': 'Limpieza', 'direccion_calle': 'Calle Norte 321', 'direccion_ciudad': 'Ciudad Capital', 'direccion_codigo_postal': '12348'},
            {'nombres': 'Pedro', 'apellidos': 'Sánchez', 'cargo': 'Guardia de Seguridad', 'salario': Decimal('1600.00'), 'departamento': 'Seguridad', 'direccion_calle': 'Av. Sur 654', 'direccion_ciudad': 'Ciudad Capital', 'direccion_codigo_postal': '12349'},
        ]

        departamentos = {d.nombre: d for d in Departamento.objects.all()}
        
        for emp_data in empleados_data:
            empleado, created = Empleado.objects.get_or_create(
                numero_identidad=f"EMP{empleados_data.index(emp_data)+1:03d}",
                defaults={
                    'nombres': emp_data['nombres'],
                    'apellidos': emp_data['apellidos'],
                    'cargo': emp_data['cargo'],
                    'salario': emp_data['salario'],
                    'fecha_contratacion': date.today() - timedelta(days=365),
                    'direccion_calle': emp_data['direccion_calle'],
                    'direccion_ciudad': emp_data['direccion_ciudad'],
                    'direccion_codigo_postal': emp_data['direccion_codigo_postal'],
                    'departamento': departamentos[emp_data['departamento']],
                    'created_by': admin_user,
                    'updated_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Empleado creado: {empleado.nombre_completo}')

        # Asignar jefes a departamentos (relación 1:1)
        empleados = list(Empleado.objects.all())
        if empleados:
            # Asignar el primer empleado como jefe del primer departamento
            dept_admin = Departamento.objects.get(nombre='Administración')
            if not dept_admin.jefe and empleados:
                dept_admin.jefe = empleados[0]
                dept_admin.save()
                self.stdout.write(f'Jefe asignado: {empleados[0].nombre_completo} -> {dept_admin.nombre}')

        # Asignar supervisores (relación recursiva)
        if len(empleados) >= 2:
            empleados[1].supervisor = empleados[0]  # Ana reporta a Carlos
            empleados[1].save()
            empleados[2].supervisor = empleados[0]  # Luis reporta a Carlos
            empleados[2].save()
            self.stdout.write('Relaciones de supervisión establecidas')

        # 4. Empleados Especializados
        if empleados:
            # Crear empleado administrativo
            emp_admin, created = EmpleadoAdministrativo.objects.get_or_create(
                numero_identidad='EMP_ADMIN_001',
                defaults={
                    'nombres': 'Sofia',
                    'apellidos': 'Hernández',
                    'cargo': 'Asistente Administrativo',
                    'salario': Decimal('2000.00'),
                    'fecha_contratacion': date.today() - timedelta(days=180),
                    'direccion_calle': 'Calle Admin 111',
                    'direccion_ciudad': 'Ciudad Capital',
                    'direccion_codigo_postal': '12350',
                    'departamento': departamentos['Administración'],
                    'nivel_acceso': 'Medio',
                    'certificaciones': 'Administración Hotelera, Gestión de Recursos Humanos',
                    'created_by': admin_user,
                    'updated_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Empleado Administrativo creado: {emp_admin.nombre_completo}')

            # Crear empleado de mantenimiento
            emp_mant, created = EmpleadoMantenimiento.objects.get_or_create(
                numero_identidad='EMP_MAINT_001',
                defaults={
                    'nombres': 'Roberto',
                    'apellidos': 'Torres',
                    'cargo': 'Técnico de Mantenimiento',
                    'salario': Decimal('2100.00'),
                    'fecha_contratacion': date.today() - timedelta(days=200),
                    'direccion_calle': 'Calle Técnica 222',
                    'direccion_ciudad': 'Ciudad Capital',
                    'direccion_codigo_postal': '12351',
                    'departamento': departamentos['Mantenimiento'],
                    'especialidad': 'Electricidad y Plomería',
                    'herramientas_asignadas': 'Taladro, Multímetro, Llaves inglesas, Kit de plomería',
                    'created_by': admin_user,
                    'updated_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Empleado de Mantenimiento creado: {emp_mant.nombre_completo}')

        # 5. Dependientes (entidad débil)
        dependientes_data = [
            {'empleado_idx': 0, 'nombre': 'Carlos Jr.', 'parentesco': 'Hijo', 'fecha_nacimiento': date(2010, 5, 15)},
            {'empleado_idx': 0, 'nombre': 'María Elena', 'parentesco': 'Esposa', 'fecha_nacimiento': date(1985, 8, 22)},
            {'empleado_idx': 1, 'nombre': 'Miguel', 'parentesco': 'Hijo', 'fecha_nacimiento': date(2015, 3, 10)},
        ]

        empleados_list = list(Empleado.objects.all()[:5])  # Primeros 5 empleados
        for dep_data in dependientes_data:
            if dep_data['empleado_idx'] < len(empleados_list):
                dependiente, created = Dependiente.objects.get_or_create(
                    empleado=empleados_list[dep_data['empleado_idx']],
                    nombre=dep_data['nombre'],
                    defaults={
                        'parentesco': dep_data['parentesco'],
                        'fecha_nacimiento': dep_data['fecha_nacimiento'],
                        'created_by': admin_user,
                        'updated_by': admin_user
                    }
                )
                if created:
                    self.stdout.write(f'Dependiente creado: {dependiente.nombre}')

        # 6. Servicios
        servicios_data = [
            {'nombre': 'WiFi Premium', 'descripcion': 'Internet de alta velocidad', 'precio': Decimal('10.00'), 'activo': True},
            {'nombre': 'Desayuno Continental', 'descripcion': 'Desayuno buffet completo', 'precio': Decimal('25.00'), 'activo': True},
            {'nombre': 'Spa y Masajes', 'descripcion': 'Servicios de relajación y bienestar', 'precio': Decimal('80.00'), 'activo': True},
            {'nombre': 'Lavandería', 'descripcion': 'Servicio de lavado y planchado', 'precio': Decimal('15.00'), 'activo': True},
            {'nombre': 'Gimnasio 24h', 'descripcion': 'Acceso completo al gimnasio', 'precio': Decimal('20.00'), 'activo': True},
        ]

        for serv_data in servicios_data:
            servicio, created = Servicio.objects.get_or_create(
                nombre=serv_data['nombre'],
                defaults={
                    'descripcion': serv_data['descripcion'],
                    'precio': serv_data['precio'],
                    'activo': serv_data['activo'],
                    'created_by': admin_user,
                    'updated_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Servicio creado: {servicio.nombre}')

        # 7. Huéspedes
        huespedes_data = [
            {'nombres': 'Juan Carlos', 'apellidos': 'Pérez', 'numero_identidad': '12345678', 'correo': 'juan.perez@email.com', 'telefono': '+1234567890', 'sexo': 'M', 'nacionalidad': 'Mexicana'},
            {'nombres': 'María Isabel', 'apellidos': 'García', 'numero_identidad': '87654321', 'correo': 'maria.garcia@email.com', 'telefono': '+1987654321', 'sexo': 'F', 'nacionalidad': 'Española'},
            {'nombres': 'Roberto', 'apellidos': 'Silva', 'numero_identidad': '11223344', 'correo': 'roberto.silva@email.com', 'telefono': '+1122334455', 'sexo': 'M', 'nacionalidad': 'Brasileña'},
            {'nombres': 'Carmen', 'apellidos': 'Morales', 'numero_identidad': '55667788', 'correo': 'carmen.morales@email.com', 'telefono': '+1556677889', 'sexo': 'F', 'nacionalidad': 'Argentina'},
        ]

        for huesped_data in huespedes_data:
            huesped, created = Huesped.objects.get_or_create(
                numero_identidad=huesped_data['numero_identidad'],
                defaults={
                    'nombres': huesped_data['nombres'],
                    'apellidos': huesped_data['apellidos'],
                    'correo_electronico': huesped_data['correo'],
                    'numero_contacto': huesped_data['telefono'],
                    'sexo': huesped_data['sexo'],
                    'fecha_nacimiento': date(1980, 1, 1),
                    'nacionalidad': huesped_data['nacionalidad'],
                    'activo': True,
                    'created_by': admin_user,
                    'updated_by': admin_user
                }
            )
            if created:
                self.stdout.write(f'Huésped creado: {huesped.nombre_completo}')

        # 8. Teléfonos adicionales para huéspedes (atributo multivaluado)
        huespedes_list = list(Huesped.objects.all())
        telefonos_adicionales = [
            {'huesped_idx': 0, 'numero': '+1234567891', 'tipo': 'trabajo'},
            {'huesped_idx': 0, 'numero': '+1234567892', 'tipo': 'casa'},
            {'huesped_idx': 1, 'numero': '+1987654322', 'tipo': 'casa'},
        ]

        for tel_data in telefonos_adicionales:
            if tel_data['huesped_idx'] < len(huespedes_list):
                telefono, created = TelefonoHuesped.objects.get_or_create(
                    huesped=huespedes_list[tel_data['huesped_idx']],
                    numero=tel_data['numero'],
                    defaults={'tipo': tel_data['tipo']}
                )
                if created:
                    self.stdout.write(f'Teléfono adicional creado: {telefono.numero}')

        # 9. Habitaciones
        tipos = list(TipoHabitacion.objects.all())
        habitaciones_data = [
            {'numero': '101', 'tipo_idx': 0, 'estado': 'DISPONIBLE'},
            {'numero': '102', 'tipo_idx': 0, 'estado': 'DISPONIBLE'},
            {'numero': '201', 'tipo_idx': 1, 'estado': 'DISPONIBLE'},
            {'numero': '202', 'tipo_idx': 1, 'estado': 'OCUPADA'},
            {'numero': '301', 'tipo_idx': 2, 'estado': 'DISPONIBLE'},
            {'numero': '302', 'tipo_idx': 2, 'estado': 'LIMPIEZA'},
            {'numero': '401', 'tipo_idx': 3, 'estado': 'DISPONIBLE'},
            {'numero': '501', 'tipo_idx': 4, 'estado': 'DISPONIBLE'},
        ]

        for hab_data in habitaciones_data:
            if hab_data['tipo_idx'] < len(tipos):
                habitacion, created = Habitacion.objects.get_or_create(
                    numero_habitacion=hab_data['numero'],
                    defaults={
                        'tipo_habitacion': tipos[hab_data['tipo_idx']],
                        'descripcion': f'Habitación {hab_data["numero"]} - {tipos[hab_data["tipo_idx"]].get_nombre_display()}',
                        'estado': hab_data['estado'],
                        'informacion_adicional': {'wifi': True, 'minibar': True, 'tv': True},
                        'created_by': admin_user,
                        'updated_by': admin_user
                    }
                )
                if created:
                    self.stdout.write(f'Habitación creada: {habitacion.numero_habitacion}')

        # 10. Reservaciones
        habitaciones_list = list(Habitacion.objects.all())
        if huespedes_list and habitaciones_list:
            reservaciones_data = [
                {'huesped_idx': 0, 'habitacion_idx': 0, 'dias_adelante': 7, 'dias_estancia': 3, 'estado': 'CONFIRMADA'},
                {'huesped_idx': 1, 'habitacion_idx': 1, 'dias_adelante': 14, 'dias_estancia': 5, 'estado': 'PENDIENTE'},
                {'huesped_idx': 2, 'habitacion_idx': 2, 'dias_adelante': 1, 'dias_estancia': 2, 'estado': 'CONFIRMADA'},
            ]

            for res_data in reservaciones_data:
                if (res_data['huesped_idx'] < len(huespedes_list) and 
                    res_data['habitacion_idx'] < len(habitaciones_list)):
                    
                    fecha_llegada = date.today() + timedelta(days=res_data['dias_adelante'])
                    fecha_salida = fecha_llegada + timedelta(days=res_data['dias_estancia'])
                    precio = habitaciones_list[res_data['habitacion_idx']].tipo_habitacion.precio_base * res_data['dias_estancia']
                    
                    # Generate unique confirmation number
                    import uuid
                    numero_confirmacion = str(uuid.uuid4())[:8].upper()
                    
                    reservacion, created = Reservacion.objects.get_or_create(
                        numero_confirmacion=numero_confirmacion,
                        defaults={
                            'huesped': huespedes_list[res_data['huesped_idx']],
                            'habitacion': habitaciones_list[res_data['habitacion_idx']],
                            'fecha_llegada': fecha_llegada,
                            'fecha_salida': fecha_salida,
                            'precio': precio,
                            'estado': res_data['estado'],
                            'metodo_pago': 'TARJETA',
                            'observaciones': 'Reservación de ejemplo',
                            'created_by': admin_user,
                            'updated_by': admin_user
                        }
                    )
                    if created:
                        self.stdout.write(f'Reservación creada: {reservacion.numero_confirmacion}')

        # 11. Relación N:M - Reservaciones con Servicios
        reservaciones_list = list(Reservacion.objects.all())
        servicios_list = list(Servicio.objects.all())
        
        if reservaciones_list and servicios_list:
            for i, reservacion in enumerate(reservaciones_list[:2]):  # Primeras 2 reservaciones
                for j, servicio in enumerate(servicios_list[:3]):  # Primeros 3 servicios
                    rs, created = ReservacionServicio.objects.get_or_create(
                        reservacion=reservacion,
                        servicio=servicio,
                        defaults={
                            'cantidad': j + 1,
                            'precio_unitario': servicio.precio
                        }
                    )
                    if created:
                        self.stdout.write(f'Servicio agregado a reservación: {servicio.nombre}')

        # 12. Asignaciones de Turno (relación ternaria)
        if empleados_list and habitaciones_list:
            asignaciones_data = [
                {'empleado_idx': 1, 'habitacion_idx': 0, 'turno': 'mañana', 'dias_atras': 1},
                {'empleado_idx': 1, 'habitacion_idx': 1, 'turno': 'tarde', 'dias_atras': 1},
                {'empleado_idx': 2, 'habitacion_idx': 0, 'turno': 'noche', 'dias_atras': 0},
            ]

            for asig_data in asignaciones_data:
                if (asig_data['empleado_idx'] < len(empleados_list) and 
                    asig_data['habitacion_idx'] < len(habitaciones_list)):
                    
                    fecha_asignacion = date.today() - timedelta(days=asig_data['dias_atras'])
                    
                    asignacion, created = AsignacionTurno.objects.get_or_create(
                        empleado=empleados_list[asig_data['empleado_idx']],
                        habitacion=habitaciones_list[asig_data['habitacion_idx']],
                        fecha=fecha_asignacion,
                        turno=asig_data['turno'],
                        defaults={
                            'tareas_realizadas': f'Limpieza y mantenimiento general - {asig_data["turno"]}'
                        }
                    )
                    if created:
                        self.stdout.write(f'Asignación de turno creada: {asignacion}')

        self.stdout.write(
            self.style.SUCCESS('¡Datos de ejemplo cargados exitosamente!')
        )
        
        # Resumen de datos creados
        self.stdout.write(self.style.WARNING('\n=== RESUMEN DE DATOS CREADOS ==='))
        self.stdout.write(f'Tipos de Habitación: {TipoHabitacion.objects.count()}')
        self.stdout.write(f'Departamentos: {Departamento.objects.count()}')
        self.stdout.write(f'Empleados: {Empleado.objects.count()}')
        self.stdout.write(f'Empleados Administrativos: {EmpleadoAdministrativo.objects.count()}')
        self.stdout.write(f'Empleados de Mantenimiento: {EmpleadoMantenimiento.objects.count()}')
        self.stdout.write(f'Dependientes: {Dependiente.objects.count()}')
        self.stdout.write(f'Servicios: {Servicio.objects.count()}')
        self.stdout.write(f'Huéspedes: {Huesped.objects.count()}')
        self.stdout.write(f'Teléfonos adicionales: {TelefonoHuesped.objects.count()}')
        self.stdout.write(f'Habitaciones: {Habitacion.objects.count()}')
        self.stdout.write(f'Reservaciones: {Reservacion.objects.count()}')
        self.stdout.write(f'Servicios en Reservaciones: {ReservacionServicio.objects.count()}')
        self.stdout.write(f'Asignaciones de Turno: {AsignacionTurno.objects.count()}')
