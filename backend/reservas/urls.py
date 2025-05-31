from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from . import views
from .views import RegisterView, UserProfileView, ExportReservacionesExcelView

# Router para ViewSets
router = DefaultRouter()
router.register(r'tipos-habitacion', views.TipoHabitacionViewSet)
router.register(r'huespedes', views.HuespedViewSet)
router.register(r'habitaciones', views.HabitacionViewSet)
router.register(r'reservaciones', views.ReservacionViewSet)

urlpatterns = [
    # API REST endpoints
    path('', include(router.urls)),
    
    # Autenticación
    path('auth/login/', obtain_auth_token, name='api_token_auth'),
    path('auth/register/', RegisterView.as_view(), name='api_register'),
    path('auth/profile/', UserProfileView.as_view(), name='api_profile'),
    
    # Endpoints adicionales para reportes
    path('reportes/reservaciones-activas-pdf/', views.ExportReservacionesPDFView.as_view(), name='export_reservaciones_pdf'),
    path('reportes/reservaciones-activas-excel/', ExportReservacionesExcelView.as_view(), name='export_reservaciones_excel'),
    path('reportes/dashboard/', views.DashboardStatsView.as_view(), name='dashboard_stats'),
]
