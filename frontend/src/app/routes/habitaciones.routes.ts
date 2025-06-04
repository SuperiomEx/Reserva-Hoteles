import { Routes } from '@angular/router';
import { ListaComponent } from '../components/habitaciones/lista/lista.component';
import { FormComponent } from '../components/habitaciones/form/form.component';

export const habitacionesRoutes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'crear', component: FormComponent },
  { path: ':id', component: FormComponent },
  { path: ':id/editar', component: FormComponent }
];