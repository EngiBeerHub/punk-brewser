import {Routes} from '@angular/router';
import {TabsPage} from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'search',
        loadComponent: () =>
          import('./search/search.page').then((m) => m.SearchPage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites/favorites.page').then(m => m.FavoritesPage),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('./tab3/tab3.page').then((m) => m.Tab3Page),
      },
    ],
  },
];
