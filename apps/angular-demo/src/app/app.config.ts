import { ApplicationConfig } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(withEventReplay())],
};
