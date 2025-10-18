# ====================================
# 🔧 CONFIGURACIÓN PARA SOLUCIONAR ERROR 403
# ====================================

# En tu archivo settings.py, asegúrate de tener:

# 1. CORS Headers - Permitir peticiones desde Angular
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

# 2. REST Framework - Configuración de autenticación
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',  # Token simple de Django
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',  # Permitir lectura sin auth
    ],
}

# 3. Apps instaladas
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework.authtoken',  # IMPORTANTE: Token authentication
    'corsheaders',
    # ...
]

# 4. Middleware - CORS debe estar antes de CommonMiddleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ANTES de CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# 5. En tus ViewSets de huespedes/views.py
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class HuespedViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    # ...resto del código

# 6. Después de cambiar settings.py, ejecuta:
# python manage.py migrate
# python manage.py collectstatic --noinput