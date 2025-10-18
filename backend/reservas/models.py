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
        from .middleware import get_current_user
        
        user = get_current_user()
        if user and user.is_authenticated:
            if not self.pk:
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

# NUEVAS ENTIDADES PARA CUMPLIR REQUERIMIENTOS

class Servicio(BaseModel):
    """Entidad para servicios del hotel"""
    nombre = models.CharField(max_length=100, verbose_name="Nombre")
    descripcion = models.TextField(verbose_name="Descripción")
    precio = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Precio")
    activo = models.BooleanField(default=True, verbose_name="Activo")
    
    class Meta:
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"
    
    def __str__(self):
        return self.nombre

class Departamento(BaseModel):
    """Entidad para departamentos del hotel"""
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre")
    presupuesto = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Presupuesto")
    
    class Meta:
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"
    
    def __str__(self):
        return self.nombre

class Empleado(BaseModel):
    """Entidad para empleados"""
    numero_identidad = models.CharField(
        max_length=20, 
        unique=True,
        validators=[RegexValidator(
            regex=r'^[0-9A-Za-z-]+$',
            message='El número de identidad solo puede contener números, letras y guiones.'
        )],
        verbose_name="Número de identidad"
    )
    nombres = models.CharField(max_length=100, verbose_name="Nombres")
    apellidos = models.CharField(max_length=100, verbose_name="Apellidos")
    cargo = models.CharField(max_length=50, verbose_name="Cargo")
    salario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Salario")
    fecha_contratacion = models.DateField(verbose_name="Fecha de contratación")
    
    # Atributo compuesto (dirección)
    direccion_calle = models.CharField(max_length=100, verbose_name="Calle")
    direccion_ciudad = models.CharField(max_length=50, verbose_name="Ciudad")
    direccion_codigo_postal = models.CharField(max_length=10, verbose_name="Código Postal")
    
    # Relaciones
    departamento = models.ForeignKey(Departamento, on_delete=models.PROTECT, related_name='empleados', verbose_name="Departamento")
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinados', verbose_name="Supervisor")
    
    @property
    def direccion_completa(self):  # Atributo derivado
        return f"{self.direccion_calle}, {self.direccion_ciudad} {self.direccion_codigo_postal}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombres} {self.apellidos}"
    
    class Meta:
        verbose_name = "Empleado"
        verbose_name_plural = "Empleados"
    
    def __str__(self):
        return self.nombre_completo

# Agregar jefe al departamento (relación 1:1)
Departamento.add_to_class('jefe', models.OneToOneField(
    Empleado, 
    on_delete=models.SET_NULL, 
    null=True, 
    blank=True,
    related_name='departamento_dirigido',
    verbose_name="Jefe de Departamento"
))

class Dependiente(BaseModel):
    """Entidad débil - Dependientes de empleados"""
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, verbose_name="Empleado")
    nombre = models.CharField(max_length=100, verbose_name="Nombre")  # Clave parcial
    parentesco = models.CharField(max_length=50, verbose_name="Parentesco")
    fecha_nacimiento = models.DateField(verbose_name="Fecha de nacimiento")
    
    class Meta:
        unique_together = ('empleado', 'nombre')  # Clave compuesta
        verbose_name = "Dependiente"
        verbose_name_plural = "Dependientes"
    
    def __str__(self):
        return f"{self.nombre} ({self.empleado.nombre_completo})"

class TelefonoHuesped(models.Model):
    """Atributo multivaluado - Múltiples teléfonos por huésped"""
    huesped = models.ForeignKey(Huesped, on_delete=models.CASCADE, related_name='telefonos', verbose_name="Huésped")
    numero = models.CharField(max_length=20, verbose_name="Número")
    tipo = models.CharField(max_length=20, choices=[
        ('movil', 'Móvil'), 
        ('casa', 'Casa'), 
        ('trabajo', 'Trabajo')
    ], verbose_name="Tipo")
    
    class Meta:
        verbose_name = "Teléfono de Huésped"
        verbose_name_plural = "Teléfonos de Huéspedes"
    
    def __str__(self):
        return f"{self.numero} ({self.tipo})"

# Especialización de Empleado (Generalización/Especialización)
class EmpleadoAdministrativo(Empleado):
    """Especialización de Empleado"""
    nivel_acceso = models.CharField(max_length=20, verbose_name="Nivel de Acceso")
    certificaciones = models.TextField(blank=True, verbose_name="Certificaciones")
    
    class Meta:
        verbose_name = "Empleado Administrativo"
        verbose_name_plural = "Empleados Administrativos"

class EmpleadoMantenimiento(Empleado):
    """Especialización de Empleado"""
    especialidad = models.CharField(max_length=50, verbose_name="Especialidad")
    herramientas_asignadas = models.TextField(blank=True, verbose_name="Herramientas Asignadas")
    
    class Meta:
        verbose_name = "Empleado de Mantenimiento"
        verbose_name_plural = "Empleados de Mantenimiento"

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
    
    @property
    def activa(self):
        return self.estado in ['PENDIENTE', 'CONFIRMADA', 'EN_CURSO']
    
    @property
    def dias_estancia(self):  # Atributo derivado
        return (self.fecha_salida - self.fecha_llegada).days
    
    @property
    def precio_por_noche(self):  # Atributo derivado
        if self.dias_estancia > 0:
            return self.precio / self.dias_estancia
        return self.precio
    
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
            
            # Only validate future dates for new reservations in production
            # Allow past dates during data initialization
            import sys
            if 'init_data' not in sys.argv and self.fecha_llegada < timezone.now().date():
                raise ValidationError("La fecha de llegada no puede ser anterior a hoy.")
    
    def save(self, *args, **kwargs):
        if not self.numero_confirmacion:
            import uuid
            self.numero_confirmacion = str(uuid.uuid4())[:8].upper()
        
        self.clean()
        super().save(*args, **kwargs)

class ReservacionServicio(models.Model):
    """Relación N:M entre Reservacion y Servicio con atributos"""
    reservacion = models.ForeignKey(Reservacion, on_delete=models.CASCADE, verbose_name="Reservación")
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, verbose_name="Servicio")
    cantidad = models.PositiveIntegerField(default=1, verbose_name="Cantidad")  # Atributo en la interrelación
    fecha_solicitud = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Solicitud")  # Atributo en la interrelación
    precio_unitario = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Precio Unitario")
    
    class Meta:
        verbose_name = "Reservación-Servicio"
        verbose_name_plural = "Reservaciones-Servicios"
    
    def __str__(self):
        return f"{self.reservacion.numero_confirmacion} - {self.servicio.nombre}"

class AsignacionTurno(models.Model):
    """Relación ternaria: Empleado-Habitacion-Turno"""
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, verbose_name="Empleado")
    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE, verbose_name="Habitación")
    fecha = models.DateField(verbose_name="Fecha")
    turno = models.CharField(max_length=20, choices=[
        ('mañana', 'Mañana'), 
        ('tarde', 'Tarde'), 
        ('noche', 'Noche')
    ], verbose_name="Turno")
    tareas_realizadas = models.TextField(blank=True, verbose_name="Tareas Realizadas")
    
    class Meta:
        verbose_name = "Asignación de Turno"
        verbose_name_plural = "Asignaciones de Turno"
        unique_together = ('empleado', 'habitacion', 'fecha', 'turno')
    
    def __str__(self):
        return f"{self.empleado.nombre_completo} - {self.habitacion.numero_habitacion} ({self.turno})"
