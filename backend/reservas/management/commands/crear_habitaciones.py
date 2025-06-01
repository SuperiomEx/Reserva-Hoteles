from django.core.management.base import BaseCommand
from reservas.models import TipoHabitacion, Habitacion

class Command(BaseCommand):
    help = 'Crea habitaciones de ejemplo'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--cantidad',
            type=int,
            default=20,
            help='Cantidad de habitaciones a crear por tipo'
        )
    
    def handle(self, *args, **options):
        cantidad = options['cantidad']
        
        # Verificar que existan tipos de habitación
        tipos = TipoHabitacion.objects.all()
        if not tipos.exists():
            self.stdout.write(
                self.style.ERROR('No existen tipos de habitación. Ejecuta primero: python manage.py crear_tipos_habitacion')
            )
            return
        
        contador_global = 1
        
        for tipo in tipos:
            self.stdout.write(f'Creando habitaciones para tipo: {tipo.get_nombre_display()}')
            
            for i in range(cantidad):
                numero_habitacion = f"{contador_global:03d}"
                
                habitacion, created = Habitacion.objects.get_or_create(
                    numero_habitacion=numero_habitacion,
                    defaults={
                        'tipo_habitacion': tipo,
                        'descripcion': f'Habitación {numero_habitacion} - {tipo.get_nombre_display()}',
                        'informacion_adicional': {
                            'vista': 'Ciudad' if contador_global % 2 == 0 else 'Jardín',
                            'wifi': True,
                            'aire_acondicionado': True,
                            'tv_cable': True,
                            'minibar': tipo.nombre in ['SUITE_JUNIOR', 'PRESIDENCIAL'],
                            'balcon': contador_global % 3 == 0
                        },
                        'estado': 'DISPONIBLE'
                    }
                )
                
                if created:
                    self.stdout.write(f'  ✓ Habitación {numero_habitacion} creada')
                else:
                    self.stdout.write(f'  - Habitación {numero_habitacion} ya existe')
                
                contador_global += 1
        
        total_habitaciones = Habitacion.objects.count()
        self.stdout.write(
            self.style.SUCCESS(f'Proceso completado. Total de habitaciones en el sistema: {total_habitaciones}')
        )
