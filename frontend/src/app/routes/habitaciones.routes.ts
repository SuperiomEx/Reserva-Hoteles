import { Routes } from '@angular/router';
import { HabitacionesComponent } from '../components/habitaciones/habitaciones.component';
import { FormComponent } from '../components/habitaciones/form/form.component';

export const habitacionesRoutes: Routes = [
  { path: '', component: HabitacionesComponent },
  { path: 'crear', component: FormComponent },
  { path: ':id', component: FormComponent },
  { path: ':id/editar', component: FormComponent },
  { path: 'editar/:id', component: FormComponent }
];