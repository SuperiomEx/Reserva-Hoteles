import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'reservaciones',
    canActivate: [authGuard],
    loadChildren: () => import('./routes/reservaciones.routes').then(r => r.reservacionesRoutes)
  },
  {
    path: 'habitaciones',
    canActivate: [authGuard],
    loadChildren: () => import('./routes/habitaciones.routes').then(r => r.habitacionesRoutes)
  },
  {
    path: 'huespedes',
    canActivate: [authGuard],
    loadChildren: () => import('./routes/huespedes.routes').then(r => r.huespedesRoutes)
  },
  {
    path: 'reportes',
    canActivate: [authGuard],
    loadChildren: () => import('./routes/reportes.routes').then(r => r.reportesRoutes)
  },
  { path: '**', redirectTo: '/dashboard' }
];
