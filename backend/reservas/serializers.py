from rest_framework import serializers
from .models import TipoHabitacion, Huesped, Habitacion, Reservacion

class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = ['id', 'nombre', 'descripcion', 'capacidad_personas', 'precio_base', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class HuespedSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = Huesped
        fields = ['id', 'nombres', 'apellidos', 'nombre_completo', 'numero_identidad', 
                 'correo_electronico', 'numero_contacto', 'sexo', 'fecha_nacimiento', 
                 'nacionalidad', 'activo', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class HabitacionSerializer(serializers.ModelSerializer):
    tipo_habitacion_nombre = serializers.CharField(source='tipo_habitacion.get_nombre_display', read_only=True)
    
    class Meta:
        model = Habitacion
        fields = ['id', 'numero_habitacion', 'tipo_habitacion', 'tipo_habitacion_nombre',
                 'descripcion', 'informacion_adicional', 'estado', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ReservacionSerializer(serializers.ModelSerializer):
    huesped_nombre = serializers.CharField(source='huesped.nombre_completo', read_only=True)
    habitacion_numero = serializers.CharField(source='habitacion.numero_habitacion', read_only=True)
    activa = serializers.ReadOnlyField()
    
    class Meta:
        model = Reservacion
        fields = ['id', 'numero_confirmacion', 'huesped', 'huesped_nombre', 
                 'habitacion', 'habitacion_numero', 'fecha_llegada', 'fecha_salida', 
                 'precio', 'estado', 'metodo_pago', 'observaciones', 'activa',
                 'created_at', 'updated_at']
        read_only_fields = ['numero_confirmacion', 'created_at', 'updated_at']

class ReservacionCreateSerializer(serializers.ModelSerializer):
    """Serializer específico para crear reservaciones"""
    
    class Meta:
        model = Reservacion
        fields = ['huesped', 'habitacion', 'fecha_llegada', 'fecha_salida', 
                 'precio', 'metodo_pago', 'observaciones']
    
    def validate(self, data):
        """Validaciones personalizadas"""
        if data['fecha_salida'] <= data['fecha_llegada']:
            raise serializers.ValidationError(
                "La fecha de salida debe ser posterior a la fecha de llegada."
            )
        
        # Verificar disponibilidad de la habitación
        habitacion = data['habitacion']
        fecha_llegada = data['fecha_llegada']
        fecha_salida = data['fecha_salida']
        
        # Buscar reservaciones conflictivas
        reservaciones_conflictivas = Reservacion.objects.filter(
            habitacion=habitacion,
            estado__in=['PENDIENTE', 'CONFIRMADA', 'EN_CURSO']
        ).filter(
            fecha_llegada__lt=fecha_salida,
            fecha_salida__gt=fecha_llegada
        )
        
        # Excluir la reservación actual si estamos editando
        if self.instance:
            reservaciones_conflictivas = reservaciones_conflictivas.exclude(
                id=self.instance.id
            )
        
        if reservaciones_conflictivas.exists():
            raise serializers.ValidationError(
                f"La habitación {habitacion.numero_habitacion} no está disponible "
                f"para las fechas seleccionadas."
            )
        
        return data

# Serializers para filtros y búsquedas
class ReservacionFilterSerializer(serializers.Serializer):
    huesped_id = serializers.IntegerField(required=False)
    habitacion_id = serializers.IntegerField(required=False)
    numero_habitacion = serializers.CharField(required=False)
    activa = serializers.BooleanField(required=False)
    estado = serializers.ChoiceField(choices=Reservacion.ESTADO_CHOICES, required=False)
    fecha_llegada_desde = serializers.DateField(required=False)
    fecha_llegada_hasta = serializers.DateField(required=False)
