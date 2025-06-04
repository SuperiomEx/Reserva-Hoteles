import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from '../../components/reservaciones/lista/lista.component';
import { CrearComponent } from '../../components/reservaciones/crear/crear.component';
import { FormComponent } from '../../components/reservaciones/form/form.component';
import { DetalleComponent } from '../../components/reservaciones/detalle/detalle.component';

const routes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'crear', component: CrearComponent },
  { path: 'nueva', component: FormComponent },
  { path: ':id', component: DetalleComponent },
  { path: ':id/editar', component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservacionesRoutingModule { }
