import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/PIDMessage' },
  {path:'PIDMessage',loadChildren:()=>import('./pages/pid-message/pid-message-routing.module').then(m=>m.PidMessageRoutingModule)},
  {path:'pidBayPlot',loadChildren:()=>import('./pages/pid-bay-plot/pid-bay-plot-routing.module').then(m=>m.PidBayPlotRoutingModule)}
];

