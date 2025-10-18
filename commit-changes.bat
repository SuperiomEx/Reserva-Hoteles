@echo off
echo Realizando commits de cambios...

REM Commit 1: Eliminar campos innecesarios del formulario
git add frontend/src/app/components/habitaciones/form/form.component.ts
git add frontend/src/app/components/habitaciones/form/form.component.html
git commit -m "Eliminar campos estado y disponible del formulario de habitaciones" -m "- Se eliminaron los campos estado y disponible del formulario" -m "- El backend maneja estos campos automaticamente" -m "- Ahora solo se envian: numero_habitacion, tipo_habitacion y descripcion"

REM Commit 2: Mejorar validación y envío de datos
git add frontend/src/app/components/habitaciones/form/form.component.ts
git commit -m "Mejorar validacion y envio de datos del formulario" -m "- Convertir tipo_habitacion a numero entero antes de enviar" -m "- Agregar validacion de descripcion para evitar valores null" -m "- Mejorar manejo de errores con mensajes especificos del backend"

REM Commit 3: Conectar lista de habitaciones con API
git add frontend/src/app/components/habitaciones/habitaciones.component.ts
git commit -m "Conectar lista de habitaciones con el servicio real" -m "- Reemplazar datos de ejemplo por llamadas al servicio" -m "- Implementar carga de habitaciones desde la API" -m "- Agregar manejo de errores en la carga de datos"

REM Commit 4: Agregar ruta de edición
git add frontend/src/app/routes/habitaciones.routes.ts
git commit -m "Agregar ruta para editar habitaciones" -m "- Anadir ruta editar/:id en habitaciones.routes.ts" -m "- Permitir navegacion a formulario de edicion" -m "- Corregir problema de redireccion al dashboard"

REM Commit 5: Mejorar eliminación de habitaciones
git add frontend/src/app/components/habitaciones/habitaciones.component.ts
git commit -m "Mejorar mensajes de error al eliminar habitaciones" -m "- Detectar error de ProtectedError cuando hay reservaciones asociadas" -m "- Mostrar mensaje amigable al usuario" -m "- Agregar confirmacion antes de eliminar"

REM Commit 6: Agregar botón de volver atrás
git add frontend/src/app/components/habitaciones/habitaciones.component.ts
git commit -m "Agregar boton de navegacion hacia atras" -m "- Implementar boton con flecha para volver a la pagina anterior" -m "- Usar Location.back() para navegacion" -m "- Agregar estilos y animacion hover al boton"

REM Commit 7: Formatear montos en dashboard
git add frontend/src/app/components/dashboard/dashboard.component.ts
git commit -m "Agregar metodo formatCurrency para mostrar montos correctamente" -m "- Crear metodo formatCurrency con formato de moneda USD" -m "- Evitar mostrar [object Object] en el dashboard" -m "- Agregar formato de fechas y badges de estado"

REM Commit 8: Actualizar modelo de dashboard
git add frontend/src/app/models/reservacion.ts
git commit -m "Actualizar interface DashboardData con estructura correcta" -m "- Ajustar modelo para coincidir con respuesta del backend" -m "- Cambiar campos de reservaciones a estructura anidada" -m "- Agregar tipos correctos para reservaciones_recientes"

REM Commit 9: Actualizar template del dashboard
git add frontend/src/app/components/dashboard/dashboard.component.html
git commit -m "Corregir acceso a datos en template del dashboard" -m "- Usar operador de navegacion segura (?) para evitar errores" -m "- Actualizar campos de reservaciones_activas y ocupacion" -m "- Corregir nombres de campos en tabla de reservaciones"

REM Commit 10: Mejorar estilos del dashboard
git add frontend/src/app/components/dashboard/dashboard.component.css
git commit -m "Agregar estilos para badges de estado en dashboard" -m "- Crear estilos para diferentes estados de reservaciones" -m "- Agregar colores distintivos para cada estado" -m "- Mejorar visualizacion de la tabla de reservaciones"

REM Commit 11: Valores por defecto en dashboard
git add frontend/src/app/components/dashboard/dashboard.component.ts
git commit -m "Agregar valores por defecto para datos del dashboard" -m "- Inicializar estructura completa en caso de error" -m "- Agregar valores por defecto para evitar errores de undefined" -m "- Garantizar que reservaciones_recientes siempre sea un array"

echo.
echo ✅ Todos los commits realizados exitosamente
echo.
pause
