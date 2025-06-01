from django.core.management.base import BaseCommand
from reservas.models import TipoHabitacion

class Command(BaseCommand):
    help = 'Crea los tipos de habitación iniciales'
    
    def handle(self, *args, **options):
        tipos_habitacion = [
            {
                'nombre': 'SENCILLA',
                'descripcion': 'Habitación individual con una cama sencilla',
                'capacidad_personas': 1,
                'precio_base': 50.00
            },
            {
                'nombre': 'DOBLE',
                'descripcion': 'Habitación con dos camas individuales',
                'capacidad_personas': 2,
                'precio_base': 80.00
            },
            {
                'nombre': 'MATRIMONIAL',
                'descripcion': 'Habitación con cama matrimonial',
                'capacidad_personas': 2,
                'precio_base': 90.00
            },
            {
                'nombre': 'SUITE_JUNIOR',
                'descripcion': 'Suite junior con sala de estar',
                'capacidad_personas': 3,
                'precio_base': 150.00
            },
            {
                'nombre': 'PRESIDENCIAL',
                'descripcion': 'Suite presidencial de lujo',
                'capacidad_personas': 4,
                'precio_base': 300.00
            }
        ]
        
        for tipo_data in tipos_habitacion:
            tipo, created = TipoHabitacion.objects.get_or_create(
                nombre=tipo_data['nombre'],
                defaults={
                    'descripcion': tipo_data['descripcion'],
                    'capacidad_personas': tipo_data['capacidad_personas'],
                    'precio_base': tipo_data['precio_base']
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Tipo de habitación "{tipo.get_nombre_display()}" creado exitosamente')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Tipo de habitación "{tipo.get_nombre_display()}" ya existe')
                )
        
        self.stdout.write(
            self.style.SUCCESS('Comando ejecutado exitosamente')
        )
