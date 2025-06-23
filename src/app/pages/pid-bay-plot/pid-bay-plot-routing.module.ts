import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PidBayPlotComponent } from './pid-bay-plot.component';

const routes: Routes = [{path:'',component:PidBayPlotComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PidBayPlotRoutingModule { }
