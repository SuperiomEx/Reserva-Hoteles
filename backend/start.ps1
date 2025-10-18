# ====================================
# Sistema de Gestion Hotelera - BACKEND
# Script de inicio para Windows PowerShell
# ====================================

param(
    [switch]$SkipInstall,
    [switch]$InitData,
    [switch]$CreateSuperuser
)

# Colores para output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-Host "`n"
Write-ColorOutput Cyan "===================================================="
Write-ColorOutput Cyan "  SISTEMA DE GESTION HOTELERA - BACKEND"
Write-ColorOutput Cyan "===================================================="
Write-Host ""

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "manage.py")) {
    Write-ColorOutput Red "[ERROR] No se encontro manage.py"
    Write-ColorOutput Yellow "Por favor, ejecuta este script desde el directorio backend"
    exit 1
}

# Verificar si existe el entorno virtual
$venvPath = ".\env"
if (-not (Test-Path $venvPath)) {
    Write-ColorOutput Yellow "[AVISO] No se encontro el entorno virtual"
    Write-ColorOutput White "Creando entorno virtual..."
    python -m venv env
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "[ERROR] No se pudo crear el entorno virtual"
        exit 1
    }
    Write-ColorOutput Green "[OK] Entorno virtual creado"
}

# Activar entorno virtual
Write-ColorOutput White "`n[1/6] Activando entorno virtual..."
$activateScript = Join-Path $venvPath "Scripts\Activate.ps1"

if (Test-Path $activateScript) {
    & $activateScript
    Write-ColorOutput Green "[OK] Entorno virtual activado"
} else {
    Write-ColorOutput Red "[ERROR] No se pudo activar el entorno virtual"
    exit 1
}

# Verificar Python
Write-ColorOutput White "`n[2/6] Verificando Python..."
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-ColorOutput Red "[ERROR] Python no encontrado"
    Write-ColorOutput Yellow "Instala Python desde: https://www.python.org/downloads/"
    exit 1
}
$pythonVersion = & python --version
Write-ColorOutput Green "[OK] $pythonVersion"

# Instalar dependencias
if (-not $SkipInstall) {
    Write-ColorOutput White "`n[3/6] Instalando dependencias..."
    python -m pip install --upgrade pip --quiet
    python -m pip install -r requirements.txt --quiet
    Write-ColorOutput Green "[OK] Dependencias instaladas"
} else {
    Write-ColorOutput Yellow "`n[3/6] Instalacion de dependencias omitida (--SkipInstall)"
}

# Verificar PostgreSQL
Write-ColorOutput White "`n[4/6] Verificando conexion a PostgreSQL..."
$env:PGPASSWORD = "postgres"

# Intentar conexión y capturar resultado
$connectionTest = $false
try {
    $result = psql -h localhost -p 8080 -U postgres -d hotel_db -t -c "SELECT 1;" 2>&1
    if ($result -match "1") {
        $connectionTest = $true
    }
} catch {
    $connectionTest = $false
}

if ($connectionTest) {
    Write-ColorOutput Green "[OK] PostgreSQL conectado correctamente"
} else {
    Write-ColorOutput Yellow "[AVISO] No se pudo conectar a PostgreSQL"
    Write-ColorOutput White "Asegurate de que PostgreSQL este corriendo en localhost:8080"
    Write-ColorOutput White "Base de datos esperada: hotel_db"
    Write-ColorOutput White "Usuario: postgres"
    Write-ColorOutput White "`nContinuar de todos modos? (S/N)"
    $response = Read-Host
    if ($response -ne "S" -and $response -ne "s") {
        Write-ColorOutput Red "[CANCELADO] Configuracion incompleta"
        exit 1
    }
}



# Aplicar migraciones
Write-ColorOutput White "`n[5/6] Aplicando migraciones..."
python manage.py makemigrations
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "[ERROR] Fallo al crear migraciones"
    exit 1
}

python manage.py migrate
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput Red "[ERROR] Fallo al aplicar migraciones"
    exit 1
}
Write-ColorOutput Green "[OK] Migraciones aplicadas correctamente"

# Inicializar datos (opcional)
if ($InitData) {
    Write-ColorOutput White "`n[OPCIONAL] Inicializando datos de ejemplo..."
    python manage.py init_data
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput Green "[OK] Datos de ejemplo cargados"
    } else {
        Write-ColorOutput Yellow "[AVISO] No se pudieron cargar los datos de ejemplo"
    }
}

# Crear superusuario (opcional)
if ($CreateSuperuser) {
    Write-ColorOutput White "`n[OPCIONAL] Creando superusuario..."
    python manage.py createsuperuser
}

# Ejecutar servidor
Write-ColorOutput White "`n[6/6] Iniciando servidor de desarrollo..."
Write-Host ""
Write-ColorOutput Green "===================================================="
Write-ColorOutput Green "  SERVIDOR INICIADO CORRECTAMENTE"
Write-ColorOutput Green "===================================================="
Write-Host ""
Write-ColorOutput Cyan "  API REST:      http://localhost:8000/api/"
Write-ColorOutput Cyan "  Admin Django:  http://localhost:8000/admin/"
Write-ColorOutput Cyan "  Documentacion: http://localhost:8000/api/docs/"
Write-Host ""
Write-ColorOutput Yellow "  Presiona Ctrl+C para detener el servidor"
Write-Host ""
Write-ColorOutput Green "===================================================="
Write-Host "`n"

# Iniciar servidor
python manage.py runserver