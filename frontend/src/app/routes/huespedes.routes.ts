import { Routes } from '@angular/router';
import { ListaComponent } from '../components/huespedes/lista/lista.component';
import { CrearComponent } from '../components/huespedes/crear/crear.component';

export const huespedesRoutes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'nuevo', component: CrearComponent },
  { path: ':id/editar', component: CrearComponent }
];