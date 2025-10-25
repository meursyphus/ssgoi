import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi } from '@ssgoi/angular';
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

// Main Blind Demo Component
@Component({
  selector: 'app-blind-demo',
  imports: [
    BrowserMockupComponent,
    BlindLayoutComponent,
    Ssgoi,
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
        @for (page of [currentPath()]; track page) {
          @switch (page) {
            @case ('/blind') {
              <app-blind-demo-theater />
            }
            @case ('/blind/act1') {
              <app-blind-demo-act1 />
            }
            @case ('/blind/act2') {
              <app-blind-demo-act2 />
            }
            @case ('/blind/finale') {
              <app-blind-demo-finale />
            }
          }
        }
      </app-blind-layout>
    </app-browser-mockup>
  `,
})
export class BlindDemoComponent {
  currentPath = signal('/blind');
  readonly routes: BlindRoute[] = [
    { path: '/blind', label: 'Opening' },
    { path: '/blind/act1', label: 'Act I' },
    { path: '/blind/act2', label: 'Act II' },
    { path: '/blind/finale', label: 'Finale' },
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
