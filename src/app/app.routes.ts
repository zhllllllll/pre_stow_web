import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/preStowMessage' },
  { path: 'preStowMessage', loadChildren: () => import('./pages/pre-stow/pre-stow-routing.module').then(m => m.PreStowRoutingModule) },
  {path:'PIDMessage',loadChildren:()=>import('./pages/pid-message/pid-message-routing.module').then(m=>m.PidMessageRoutingModule)},
  {path:'pidBayPlot',loadChildren:()=>import('./pages/pid-bay-plot/pid-bay-plot-routing.module').then(m=>m.PidBayPlotRoutingModule)}
];
