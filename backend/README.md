# 🏨 Sistema de Gestión Hotelera - Backend

Backend desarrollado con Django REST Framework para la gestión de reservas de un hotel.

## 🚀 Características

- **API REST completa** con Django REST Framework
- **Autenticación por tokens** para usuarios
- **Gestión de huéspedes** (CRUD completo)
- **Gestión de habitaciones** por tipos
- **Sistema de reservaciones** con validaciones
- **Exportación de reportes** en PDF y Excel
- **Dashboard con estadísticas** en tiempo real
- **Auditoría automática** de cambios con usuario y fecha

## 📋 Modelos de Datos

### TipoHabitacion
- Tipos: Sencilla, Doble, Matrimonial, Suite Junior, Presidencial
- Capacidad de personas y precio base

### Huesped
- Información personal completa
- Validaciones de identidad y contacto
- Estado activo/inactivo

### Habitacion
- Número único de habitación
- Tipo asociado y estado (disponible, ocupada, mantenimiento)
- Información adicional en JSON (comodidades)

### Reservacion
- Validaciones de fechas y disponibilidad
- Estados: Pendiente, Confirmada, En curso, Completada, Cancelada
- Métodos de pago múltiples
- Número de confirmación automático

## 🛠️ Instalación

### Prerrequisitos
- Python 3.8+
- PostgreSQL 12+
- Git

### Configuración

1. **Clonar y configurar entorno:**
```bash
git clone <tu-repositorio>
cd backend
python -m venv env
```

2. **Activar entorno virtual:**
```bash
# Linux/Mac
source env/bin/activate

# Windows
.\env\Scripts\activate
```

3. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

4. **Configurar base de datos:**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
DB_NAME=hotel_db
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=tu-clave-secreta
```

5. **Ejecutar migraciones:**
```bash
python manage.py migrate
```

6. **Inicializar datos de ejemplo:**
```bash
python manage.py init_data
```

7. **Ejecutar servidor:**
```bash
python manage.py runserver
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register/` - Registro de usuarios
- `POST /api/auth/login/` - Login (obtener token)
- `GET /api/auth/profile/` - Perfil del usuario

### Gestión de Datos
- `GET/POST /api/tipos-habitacion/` - Tipos de habitación
- `GET/POST /api/huespedes/` - Gestión de huéspedes
- `GET/POST /api/habitaciones/` - Gestión de habitaciones
- `GET/POST /api/reservaciones/` - Gestión de reservaciones

### Funciones Especiales
- `GET /api/reservaciones/activas/` - Reservaciones activas
- `POST /api/reservaciones/buscar/` - Búsqueda avanzada
- `GET /api/habitaciones/disponibles/` - Habitaciones disponibles

### Reportes
- `GET /api/reportes/dashboard/` - Estadísticas del dashboard
- `GET /api/reportes/reservaciones-activas-pdf/` - Exportar PDF
- `GET /api/reportes/reservaciones-activas-excel/` - Exportar Excel
- `GET /api/reservaciones/export_activas_csv/` - Exportar CSV

## 🔍 Funcionalidades de Búsqueda

### Filtros Disponibles
- Por huésped (ID o nombre)
- Por habitación (número)
- Por estado de reservación
- Por fechas de llegada
- Solo reservaciones activas

### Ejemplo de búsqueda:
```bash
# Buscar reservaciones activas
GET /api/reservaciones/?activa=true

# Buscar por huésped
GET /api/reservaciones/?huesped_id=1

# Buscar por habitación
GET /api/reservaciones/?numero_habitacion=001
```

## 🛡️ Autenticación

El sistema usa autenticación por tokens. Para acceder a los endpoints protegidos:

```bash
# 1. Obtener token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# 2. Usar token en requests
curl -H "Authorization: Token tu-token-aqui" \
  http://localhost:8000/api/reservaciones/
```

## 📊 Panel de Administración

Accede al panel de Django Admin en:
- URL: `http://localhost:8000/admin/`
- Usuario: `admin`
- Contraseña: `admin123` (después de ejecutar `init_data`)

## 🧪 Comandos de Gestión

```bash
# Crear tipos de habitación iniciales
python manage.py crear_tipos_habitacion

# Crear habitaciones de ejemplo
python manage.py crear_habitaciones --cantidad 20

# Inicializar todos los datos
python manage.py init_data

# Verificar configuración
python manage.py check
```

## 📁 Estructura del Proyecto

```
backend/
├── hotel_backend/          # Configuración principal
├── reservas/              # App principal
│   ├── models.py          # Modelos de datos
│   ├── views.py           # Vistas de la API
│   ├── serializers.py     # Serializers DRF
│   ├── urls.py           # URLs de la app
│   ├── admin.py          # Configuración admin
│   └── management/       # Comandos personalizados
├── requirements.txt      # Dependencias
├── .env.example         # Ejemplo de configuración
└── manage.py           # Comando principal Django
```

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Crear base de datos
createdb hotel_db
```

### Error de migraciones
```bash
# Limpiar migraciones
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
python manage.py makemigrations
python manage.py migrate
```

### Problemas de permisos
```bash
# Verificar usuario actual en DB
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.all()
```

## 🔧 Desarrollo

### Variables de Entorno Requeridas
- `SECRET_KEY`: Clave secreta de Django
- `DEBUG`: Modo debug (True/False)
- `DB_NAME`: Nombre de la base de datos
- `DB_USER`: Usuario de PostgreSQL
- `DB_PASSWORD`: Contraseña de PostgreSQL
- `DB_HOST`: Host de la base de datos
- `DB_PORT`: Puerto de PostgreSQL

### Dependencias Principales
- Django 5.2.1
- Django REST Framework 3.16.0
- PostgreSQL (psycopg2-binary)
- django-cors-headers (para Angular)
- django-filter (filtros avanzados)
- reportlab (PDFs)
- openpyxl (Excel)

## 📞 Soporte

Para problemas o consultas sobre el backend:
1. Revisa los logs de Django
2. Verifica la configuración de la base de datos
3. Consulta la documentación de Django REST Framework

---

**Desarrollado con ❤️ usando Django REST Framework**
