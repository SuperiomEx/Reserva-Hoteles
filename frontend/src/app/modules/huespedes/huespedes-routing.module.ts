import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from '../../components/huespedes/lista/lista.component';

const routes: Routes = [
  { path: '', component: ListaComponent },
  { path: 'nuevo', redirectTo: 'crear' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HuespedesRoutingModule { }
