import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreStowComponent } from './pre-stow.component';


const routes: Routes = [{path:'',component:PreStowComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreStowRoutingModule { }
