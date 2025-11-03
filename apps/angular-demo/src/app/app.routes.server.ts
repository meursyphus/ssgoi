import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'jaemin',
    renderMode: RenderMode.Server,
  },
  {
    path: 'item/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'view-transitions',
    renderMode: RenderMode.Server,
  },
  {
    path: 'transitions',
    renderMode: RenderMode.Server,
  },
  {
    path: 'transitions/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
