import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'detail',
    loadComponent: () => import('./pages/detail/detail.page').then(m => m.DetailPage)
  },
  {
    path: 'licenses',
    loadComponent: () => import('./pages/licenses/licenses.page').then(m => m.LicensesPage)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then( m => m.PrivacyPolicyPage)
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () => import('./pages/terms-and-conditions/terms-and-conditions.page').then( m => m.TermsAndConditionsPage)
  },
];
