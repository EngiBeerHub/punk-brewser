import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'detail',
    loadComponent: () => import('./pages/detail/detail.page').then( m => m.DetailPage)
  },
];
