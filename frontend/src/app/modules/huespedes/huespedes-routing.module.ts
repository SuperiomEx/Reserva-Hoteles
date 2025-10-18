import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from '../../components/huespedes/lista/lista.component';
import { CrearComponent } from '../../components/huespedes/crear/crear.component';

const routes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'nuevo', component: CrearComponent },
  { path: 'crear', component: CrearComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HuespedesRoutingModule { }
