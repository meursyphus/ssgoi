import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-layout.component').then(
        (m) => m.HomeLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'item/:id',
        loadComponent: () =>
          import('./pages/home/item/item.component').then(
            (m) => m.ItemComponent
          ),
      },
      {
        path: 'jaemin',
        loadComponent: () =>
          import('./pages/home/jaemin/jaemin.component').then(
            (m) => m.JaeminComponent
          ),
      },
    ],
  },

  {
    path: 'view-transitions',
    loadComponent: () =>
      import('./pages/view-transitions/view-transitions.component').then(
        (m) => m.ViewTransitionsComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'fade',
        pathMatch: 'full',
      },
      {
        path: 'fade',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/fade/fade.component'
          ).then((m) => m.FadeDemoComponent),
      },
      {
        path: 'scroll',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/scroll/scroll.component'
          ).then((m) => m.ScrollDemoComponent),
      },
      {
        path: 'hero',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/hero/hero.component'
          ).then((m) => m.HeroDemoComponent),
      },
      {
        path: 'pinterest',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/pinterest/pinterest.component'
          ).then((m) => m.PinterestDemoComponent),
      },
      {
        path: 'drill',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/drill/drill.component'
          ).then((m) => m.DrillDemoComponent),
      },
      {
        path: 'blind',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/blind/blind.component'
          ).then((m) => m.BlindDemoComponent),
      },
      {
        path: 'slide',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/slide/slide.component'
          ).then((m) => m.SlideDemoComponent),
      },
      {
        path: 'jaemin',
        loadComponent: () =>
          import(
            './components/view-transition-demo-detail/jaemin/jaemin.component'
          ).then((m) => m.JaeminDemoComponent),
      },
    ],
  },

  {
    path: 'nested-demo',
    loadComponent: () =>
      import('./pages/nested-demo/nested-demo.component').then(
        (m) => m.NestedDemoComponent
      ),
  },
  {
    path: 'transitions',
    loadComponent: () =>
      import('./pages/transitions/transitions.component').then(
        (m) => m.TransitionsComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'fade',
        pathMatch: 'full',
      },
      {
        path: ':id',
        loadComponent: () =>
          import(
            './components/transition-demo-detail/transition-demo-detail.component'
          ).then((m) => m.TransitionDemoDetailComponent),
      },
    ],
  },
];
