from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
import threading
from threading import local

# Variable local para almacenar el usuario actual
_thread_local = local()

class CurrentUserMiddleware(MiddlewareMixin):
    """
    Middleware para almacenar el usuario actual en el contexto global
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Establecer el usuario actual antes del procesamiento
        user = getattr(request, 'user', AnonymousUser())
        set_current_user(user)
        
        response = self.get_response(request)
        
        # Limpiar el usuario después del procesamiento
        set_current_user(None)
        
        return response

def get_current_user():
    """
    Función para obtener el usuario actual desde cualquier parte del código
    """
    return getattr(_thread_local, 'user', AnonymousUser())

def set_current_user(user):
    """Establecer el usuario actual en el thread local"""
    _thread_local.user = user
