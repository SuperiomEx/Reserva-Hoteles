from django.contrib import admin
from .models import TipoHabitacion, Huesped, Habitacion, Reservacion, Servicio, Empleado, Departamento, Dependiente, ReservacionServicio

@admin.register(TipoHabitacion)
class TipoHabitacionAdmin(admin.ModelAdmin):
    list_display = ['get_nombre_display', 'descripcion', 'capacidad_personas', 'precio_base', 'created_at']
    list_filter = ['nombre', 'capacidad_personas']
    search_fields = ['nombre', 'descripcion']
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si es nuevo
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Huesped)
class HuespedAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'numero_identidad', 'correo_electronico', 'numero_contacto', 'activo']
    list_filter = ['sexo', 'activo', 'nacionalidad']
    search_fields = ['nombres', 'apellidos', 'numero_identidad', 'correo_electronico']
    list_editable = ['activo']
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombres', 'apellidos', 'numero_identidad', 'sexo', 'fecha_nacimiento', 'nacionalidad')
        }),
        ('Contacto', {
            'fields': ('correo_electronico', 'numero_contacto')
        }),
        ('Estado', {
            'fields': ('activo',)
        }),
        ('Auditoría', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ['numero_habitacion', 'tipo_habitacion', 'estado', 'created_at']
    list_filter = ['tipo_habitacion', 'estado']
    search_fields = ['numero_habitacion', 'descripcion']
    list_editable = ['estado']
    readonly_fields = ['created_at', 'updated_at', 'created_by', 'updated_by']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('numero_habitacion', 'tipo_habitacion', 'estado')
        }),
        ('Detalles', {
            'fields': ('descripcion', 'informacion_adicional')
        }),
        ('Auditoría', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Reservacion)
class ReservacionAdmin(admin.ModelAdmin):
    list_display = ['numero_confirmacion', 'huesped', 'habitacion', 'fecha_llegada', 'fecha_salida', 'precio', 'estado']
    list_filter = ['estado', 'fecha_llegada', 'fecha_salida', 'metodo_pago']
    search_fields = ['numero_confirmacion', 'huesped__nombres', 'huesped__apellidos', 'habitacion__numero_habitacion']
    list_editable = ['estado']
    readonly_fields = ['numero_confirmacion', 'created_at', 'updated_at', 'created_by', 'updated_by']
    date_hierarchy = 'fecha_llegada'
    
    fieldsets = (
        ('Información de Reserva', {
            'fields': ('numero_confirmacion', 'huesped', 'habitacion', 'estado')
        }),
        ('Fechas y Precio', {
            'fields': ('fecha_llegada', 'fecha_salida', 'precio', 'metodo_pago')
        }),
        ('Observaciones', {
            'fields': ('observaciones',)
        }),
        ('Auditoría', {
            'fields': ('created_at', 'updated_at', 'created_by', 'updated_by'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si es un nuevo objeto
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'precio', 'activo']

@admin.register(Empleado)
class EmpleadoAdmin(admin.ModelAdmin):
    list_display = ['nombres', 'apellidos', 'cargo', 'departamento']

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'jefe', 'presupuesto']

@admin.register(Dependiente)
class DependienteAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'empleado', 'parentesco']

@admin.register(ReservacionServicio)
class ReservacionServicioAdmin(admin.ModelAdmin):
    list_display = ['reservacion', 'servicio', 'cantidad', 'precio_unitario']
