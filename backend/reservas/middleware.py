from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
import threading

# Variable local para almacenar el usuario actual
_user = threading.local()

class CurrentUserMiddleware(MiddlewareMixin):
    """
    Middleware para almacenar el usuario actual en el contexto global
    """
    def process_request(self, request):
        _user.value = getattr(request, 'user', None)

def get_current_user():
    """
    Función para obtener el usuario actual desde cualquier parte del código
    """
    return getattr(_user, 'value', AnonymousUser())
