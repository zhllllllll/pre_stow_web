import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PIDMessageComponent } from './pid-message.component';

const routes: Routes = [{path:'',component:PIDMessageComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PidMessageRoutingModule { }
