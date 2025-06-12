import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/preStowMessage' },
  { path: 'preStowMessage', loadChildren: () => import('./pages/pre-stow/pre-stow-routing.module').then(m => m.PreStowRoutingModule) }
];
