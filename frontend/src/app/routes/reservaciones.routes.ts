import { Routes } from '@angular/router';
import { ListaComponent } from '../components/reservaciones/lista/lista.component';
import { CrearComponent } from '../components/reservaciones/crear/crear.component';
import { DetalleComponent } from '../components/reservaciones/detalle/detalle.component';
import { FormComponent } from '../components/reservaciones/form/form.component';

export const reservacionesRoutes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'crear', component: CrearComponent },
  { path: 'nueva', component: FormComponent },
  { path: ':id', component: DetalleComponent },
  { path: ':id/editar', component: FormComponent }
];