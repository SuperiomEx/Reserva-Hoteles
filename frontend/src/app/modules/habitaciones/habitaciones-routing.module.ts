import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from '../../components/habitaciones/lista/lista.component';
import { FormComponent } from '../../components/habitaciones/form/form.component';

const routes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'crear', component: FormComponent },
  { path: ':id', component: FormComponent },
  { path: ':id/editar', component: FormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HabitacionesRoutingModule { }
