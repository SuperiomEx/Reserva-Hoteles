#!/bin/bash
# Script de inicio rápido para el backend del hotel

echo "🏨 SISTEMA DE GESTIÓN HOTELERA - BACKEND"
echo "========================================"

# Activar entorno virtual
echo "📦 Activando entorno virtual..."
source env/Scripts/activate

# Instalar dependencias
echo "📋 Instalando dependencias..."
pip install -r requirements.txt

# Crear migraciones
echo "🗄️  Creando migraciones..."
python manage.py makemigrations

# Aplicar migraciones (cuando PostgreSQL esté disponible)
echo "⚠️  Para aplicar migraciones, asegúrate de que PostgreSQL esté corriendo:"
echo "   python manage.py migrate"

# Inicializar datos
echo "📊 Para inicializar datos de ejemplo:"
echo "   python manage.py init_data"

# Crear superusuario
echo "👤 Para crear un superusuario:"
echo "   python manage.py createsuperuser"

# Ejecutar servidor
echo "🚀 Para ejecutar el servidor:"
echo "   python manage.py runserver"

echo ""
echo "✅ Configuración completada!"
echo "📖 Endpoints disponibles en: http://localhost:8000/api/"
echo "🔧 Panel de admin en: http://localhost:8000/admin/"
