import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
import { blind } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import {
  BlindLayoutComponent,
  type BlindRoute,
} from './blind-layout.component';
import { BlindDemoTheaterComponent } from './blind-demo-theater.component';
import { BlindDemoAct1Component } from './blind-demo-act1.component';
import { BlindDemoAct2Component } from './blind-demo-act2.component';
import { BlindDemoFinaleComponent } from './blind-demo-finale.component';

const BLIND_PATHS = {
  theater: '/blind' as string,
  act1: '/blind/act1' as string,
  act2: '/blind/act2' as string,
  finale: '/blind/finale' as string,
} as const;

// Main Blind Demo Component
@Component({
  selector: 'app-blind-demo',
  imports: [
    BrowserMockupComponent,
    BlindLayoutComponent,
    Ssgoi,
    SsgoiTransition,
    BlindDemoTheaterComponent,
    BlindDemoAct1Component,
    BlindDemoAct2Component,
    BlindDemoFinaleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <app-blind-layout
        ssgoi
        [config]="ssgoiConfig"
        [logo]="'🎭'"
        [title]="'Theater'"
        [headerText]="'blind Transition'"
        [routes]="routes"
        [currentPath]="currentPath()"
        (navigate)="onNavigate($event)"
      >
        @switch (currentPath()) {
          @case (paths.theater) {
            <div [ssgoiTransition]="paths.theater" class="h-full">
              <app-blind-demo-theater />
            </div>
          }
          @case (paths.act1) {
            <div [ssgoiTransition]="paths.act1" class="h-full">
              <app-blind-demo-act1 />
            </div>
          }
          @case (paths.act2) {
            <div [ssgoiTransition]="paths.act2" class="h-full">
              <app-blind-demo-act2 />
            </div>
          }
          @case (paths.finale) {
            <div [ssgoiTransition]="paths.finale" class="h-full">
              <app-blind-demo-finale />
            </div>
          }
        }
      </app-blind-layout>
    </app-browser-mockup>
  `,
})
export class BlindDemoComponent {
  readonly paths = BLIND_PATHS;
  currentPath = signal(BLIND_PATHS.theater);
  readonly routes: BlindRoute[] = [
    { path: BLIND_PATHS.theater, label: 'Opening' },
    { path: BLIND_PATHS.act1, label: 'Act I' },
    { path: BLIND_PATHS.act2, label: 'Act II' },
    { path: BLIND_PATHS.finale, label: 'Finale' },
  ];
  readonly ssgoiConfig = {
    defaultTransition: blind({
      blindCount: 7,
      direction: 'horizontal' as const,
      blindColor: 'lab(8.11897% .811279 -12.254)',
    }),
  };

  onNavigate(path: string) {
    console.log('path', path);
    this.currentPath.set(path);
  }
}
