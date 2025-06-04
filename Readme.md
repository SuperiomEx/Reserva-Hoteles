# 🏨 Sistema de Gestión Hotelera

Sistema completo para la gestión de reservas hoteleras con Django REST Framework y Angular.

## 🚀 Estructura del Proyecto

- **Backend**: Django REST Framework ([Ver documentación](backend/README.md))
- **Frontend**: Angular 19 ([Ver documentación](frontend/README.md))

## 🛠️ Instalación Rápida

### Backend (Django)
```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: .\env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py init_data
python manage.py runserver
```

### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin

## 📊 Estadísticas de Desarrollo

<!--START_SECTION:waka-->
<!--END_SECTION:waka-->

---

**Desarrollado con ❤️ usando Django + Angular**