from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, RegexValidator
from decimal import Decimal

class BaseModel(models.Model):
    """Modelo base con campos de auditoría"""
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='%(class)s_created',
        verbose_name="Creado por"
    )
    updated_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='%(class)s_updated',
        verbose_name="Actualizado por"
    )
    
    def save(self, *args, **kwargs):
        # Importar aquí para evitar importación circular
        from .middleware import get_current_user
        
        user = get_current_user()
        if user and user.is_authenticated:
            if not self.pk:  # Si es un nuevo objeto
                self.created_by = user
            self.updated_by = user
        
        super().save(*args, **kwargs)
    
    class Meta:
        abstract = True

class TipoHabitacion(BaseModel):
    """Modelo para tipos de habitación"""
    TIPOS_CHOICES = [
        ('SENCILLA', 'Sencilla'),
        ('DOBLE', 'Doble'),
        ('MATRIMONIAL', 'Matrimonial'),
        ('SUITE_JUNIOR', 'Suite Junior'),
        ('PRESIDENCIAL', 'Presidencial'),
    ]
    
    nombre = models.CharField(
        max_length=20, 
        choices=TIPOS_CHOICES, 
        unique=True,
        verbose_name="Tipo de habitación"
    )
    descripcion = models.TextField(blank=True, verbose_name="Descripción")
    capacidad_personas = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Capacidad de personas"
    )
    precio_base = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Precio base"
    )
    
    class Meta:
        verbose_name = "Tipo de Habitación"
        verbose_name_plural = "Tipos de Habitación"
        ordering = ['nombre']
    
    def __str__(self):
        return self.get_nombre_display()

class Huesped(BaseModel):
    """Modelo para huéspedes"""
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    
    nombres = models.CharField(max_length=100, verbose_name="Nombres")
    apellidos = models.CharField(max_length=100, verbose_name="Apellidos")
    numero_identidad = models.CharField(
        max_length=20, 
        unique=True,
        validators=[RegexValidator(
            regex=r'^[0-9A-Za-z-]+$',
            message='El número de identidad solo puede contener números, letras y guiones.'
        )],
        verbose_name="Número de identidad"
    )
    correo_electronico = models.EmailField(unique=True, verbose_name="Correo electrónico")
    numero_contacto = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message='El número de contacto debe tener entre 9 y 15 dígitos.'
        )],
        verbose_name="Número de contacto"
    )
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, verbose_name="Sexo")
    fecha_nacimiento = models.DateField(null=True, blank=True, verbose_name="Fecha de nacimiento")
    nacionalidad = models.CharField(max_length=50, blank=True, verbose_name="Nacionalidad")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    class Meta:
        verbose_name = "Huésped"
        verbose_name_plural = "Huéspedes"
        ordering = ['apellidos', 'nombres']
    
    def __str__(self):
        return f"{self.apellidos}, {self.nombres}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombres} {self.apellidos}"

class Habitacion(BaseModel):
    """Modelo para habitaciones"""
    ESTADO_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('OCUPADA', 'Ocupada'),
        ('MANTENIMIENTO', 'En mantenimiento'),
        ('LIMPIEZA', 'En limpieza'),
    ]
    
    numero_habitacion = models.CharField(
        max_length=10, 
        unique=True,
        verbose_name="Número de habitación"
    )
    tipo_habitacion = models.ForeignKey(
        TipoHabitacion, 
        on_delete=models.PROTECT,
        verbose_name="Tipo de habitación"
    )
    descripcion = models.TextField(blank=True, verbose_name="Descripción")
    informacion_adicional = models.JSONField(
        default=dict, 
        blank=True,
        help_text="Información adicional en formato JSON (comodidades, características, etc.)",
        verbose_name="Información adicional"
    )
    estado = models.CharField(
        max_length=15, 
        choices=ESTADO_CHOICES, 
        default='DISPONIBLE',
        verbose_name="Estado"
    )
    
    class Meta:
        verbose_name = "Habitación"
        verbose_name_plural = "Habitaciones"
        ordering = ['numero_habitacion']
    
    def __str__(self):
        return f"Habitación {self.numero_habitacion} - {self.tipo_habitacion}"

class Reservacion(BaseModel):
    """Modelo para reservaciones"""
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('CONFIRMADA', 'Confirmada'),
        ('EN_CURSO', 'En curso'),
        ('COMPLETADA', 'Completada'),
        ('CANCELADA', 'Cancelada'),
    ]
    
    METODO_PAGO_CHOICES = [
        ('EFECTIVO', 'Efectivo'),
        ('TARJETA', 'Tarjeta de crédito/débito'),
        ('TRANSFERENCIA', 'Transferencia bancaria'),
        ('PAYPAL', 'PayPal'),
    ]
    
    numero_confirmacion = models.CharField(
        max_length=20, 
        unique=True,
        verbose_name="Número de confirmación"
    )
    huesped = models.ForeignKey(
        Huesped, 
        on_delete=models.PROTECT,
        verbose_name="Huésped"
    )
    habitacion = models.ForeignKey(
        Habitacion, 
        on_delete=models.PROTECT,
        verbose_name="Habitación"
    )
    fecha_llegada = models.DateField(verbose_name="Fecha de llegada")
    fecha_salida = models.DateField(verbose_name="Fecha de salida")
    precio = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Precio total"
    )
    estado = models.CharField(
        max_length=15, 
        choices=ESTADO_CHOICES, 
        default='PENDIENTE',
        verbose_name="Estado"
    )
    metodo_pago = models.CharField(
        max_length=15, 
        choices=METODO_PAGO_CHOICES,
        blank=True,
        verbose_name="Método de pago"
    )
    observaciones = models.TextField(blank=True, verbose_name="Observaciones")
    
    # Campo calculado para compatibilidad
    @property
    def activa(self):
        return self.estado in ['PENDIENTE', 'CONFIRMADA', 'EN_CURSO']
    
    class Meta:
        verbose_name = "Reservación"
        verbose_name_plural = "Reservaciones"
        ordering = ['-fecha_llegada']
    
    def __str__(self):
        return f"Reserva {self.numero_confirmacion} - {self.huesped.nombre_completo}"
    
    def clean(self):
        from django.core.exceptions import ValidationError
        from django.utils import timezone
        
        if self.fecha_llegada and self.fecha_salida:
            if self.fecha_salida <= self.fecha_llegada:
                raise ValidationError("La fecha de salida debe ser posterior a la fecha de llegada.")
            
            if self.fecha_llegada < timezone.now().date():
                raise ValidationError("La fecha de llegada no puede ser anterior a hoy.")
    
    def save(self, *args, **kwargs):
        if not self.numero_confirmacion:
            # Generar número de confirmación automático
            import uuid
            self.numero_confirmacion = str(uuid.uuid4())[:8].upper()
        
        self.clean()
        super().save(*args, **kwargs)
