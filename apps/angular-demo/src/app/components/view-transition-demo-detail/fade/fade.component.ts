import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi } from '@ssgoi/angular';
import { fade } from '@ssgoi/angular/view-transitions';
import {
  BrowserMockupComponent,
  type DemoRouteConfig,
} from '../shared/browser-mockup.component';
import { DemoLayoutComponent } from '../shared/demo-layout.component';
import { FadeDemoExamplesComponent } from './fade-demo-examples.component';
import { FadeDemoFeaturesComponent } from './fade-demo-features.component';
import { FadeDemoHomeComponent } from './fade-demo-home.component';
import { FadeDemoStartComponent } from './fade-demo-start.component';

// Main Fade Demo Component
@Component({
  selector: 'app-fade-demo',
  imports: [
    BrowserMockupComponent,
    DemoLayoutComponent,
    Ssgoi,
    FadeDemoHomeComponent,
    FadeDemoFeaturesComponent,
    FadeDemoExamplesComponent,
    FadeDemoStartComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <app-demo-layout
        ssgoi
        [config]="ssgoiConfig"
        [logo]="'⚡'"
        [title]="'Fade Demo'"
        [routes]="routes"
        [currentPath]="currentPath()"
        (navigate)="onNavigate($event)"
      >
        @for (page of [currentPath()]; track page) {
          @switch (page) {
            @case ('/fade') {
              <app-fade-demo-home (navigate)="onNavigate($event)" />
            }
            @case ('/fade/features') {
              <app-fade-demo-features />
            }
            @case ('/fade/examples') {
              <app-fade-demo-examples />
            }
            @case ('/fade/start') {
              <app-fade-demo-start />
            }
          }
        }
      </app-demo-layout>
    </app-browser-mockup>
  `,
})
export class FadeDemoComponent {
  currentPath = signal('/fade');
  readonly routes: DemoRouteConfig[] = [
    { path: '/fade', label: 'Home' },
    { path: '/fade/features', label: 'Features' },
    { path: '/fade/examples', label: 'Examples' },
    { path: '/fade/start', label: 'Start' },
  ];
  readonly ssgoiConfig = {
    defaultTransition: fade(),
  };

  onNavigate(path: string) {
    console.log('path', path);
    this.currentPath.set(path);
  }
}
