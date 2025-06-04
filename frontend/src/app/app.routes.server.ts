import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas específicas con parámetros 
  {
    path: 'reservaciones/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'habitaciones/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'habitaciones/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'huespedes/:id/editar',
    renderMode: RenderMode.Server
  },
  {
    path: 'reservaciones/:id/editar',
    renderMode: RenderMode.Server
  },
  // Rutas estáticas 
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'reservaciones',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'reservaciones/crear',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'habitaciones',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'habitaciones/crear',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'huespedes',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'huespedes/nuevo',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'reportes',
    renderMode: RenderMode.Prerender
  },
  // Catch-all para el resto
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
