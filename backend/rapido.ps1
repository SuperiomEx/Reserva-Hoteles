# Script rapido para desarrollo
# Uso: .\dev.ps1

Write-Host "`nIniciando servidor de desarrollo..." -ForegroundColor Cyan

# Activar entorno virtual
if (Test-Path ".\env\Scripts\Activate.ps1") {
    & .\env\Scripts\Activate.ps1
} else {
    Write-Host "Error: No se encontro el entorno virtual" -ForegroundColor Red
    Write-Host "Ejecuta .\start.ps1 primero para configurar el proyecto" -ForegroundColor Yellow
    exit 1
}

# Aplicar migraciones pendientes
python manage.py migrate --no-input

# Iniciar servidor
Write-Host "`nServidor disponible en: http://localhost:8000/api/`n" -ForegroundColor Green
python manage.py runserver