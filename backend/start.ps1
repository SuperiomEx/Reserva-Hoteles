# Script de inicio rápido para el backend del hotel (Windows PowerShell)

Write-Host "🏨 SISTEMA DE GESTIÓN HOTELERA - BACKEND" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Activar entorno virtual
Write-Host "📦 Activando entorno virtual..." -ForegroundColor Yellow
& ".\env\Scripts\Activate.ps1"

# Instalar dependencias
Write-Host "📋 Instalando dependencias..." -ForegroundColor Yellow
pip install -r requirements.txt

# Crear migraciones
Write-Host "🗄️  Creando migraciones..." -ForegroundColor Yellow
python manage.py makemigrations

Write-Host ""
Write-Host "⚠️  SIGUIENTES PASOS:" -ForegroundColor Red
Write-Host "1. Asegúrate de que PostgreSQL esté corriendo" -ForegroundColor White
Write-Host "2. Configura tu archivo .env con los datos de la BD" -ForegroundColor White
Write-Host "3. Ejecuta: python manage.py migrate" -ForegroundColor Green
Write-Host "4. Ejecuta: python manage.py init_data" -ForegroundColor Green
Write-Host "5. Ejecuta: python manage.py runserver" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Configuración inicial completada!" -ForegroundColor Green
Write-Host "📖 Endpoints estarán en: http://localhost:8000/api/" -ForegroundColor Cyan
Write-Host "🔧 Panel de admin en: http://localhost:8000/admin/" -ForegroundColor Cyan
