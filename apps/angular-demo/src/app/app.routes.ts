import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'item/:id',
    loadComponent: () =>
      import('./pages/item/item.component').then((m) => m.ItemComponent),
  },
  {
    path: 'jaemin',
    loadComponent: () =>
      import('./pages/jaemin/jaemin.component').then((m) => m.JaeminComponent),
  },
];
