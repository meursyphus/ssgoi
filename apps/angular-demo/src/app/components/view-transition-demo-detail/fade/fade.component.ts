import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
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

const FADE_PATHS = {
  home: '/fade' as string,
  features: '/fade/features' as string,
  examples: '/fade/examples' as string,
  start: '/fade/start' as string,
} as const;

// Main Fade Demo Component
@Component({
  selector: 'app-fade-demo',
  imports: [
    BrowserMockupComponent,
    DemoLayoutComponent,
    Ssgoi,
    SsgoiTransition,
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
        @switch (currentPath()) {
          @case (paths.home) {
            <div
              [ssgoiTransition]="paths.home"
              class="min-h-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8"
            >
              <app-fade-demo-home (navigate)="onNavigate($event)" />
            </div>
          }
          @case (paths.features) {
            <div
              [ssgoiTransition]="paths.features"
              class="min-h-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8"
            >
              <app-fade-demo-features />
            </div>
          }
          @case (paths.examples) {
            <div
              [ssgoiTransition]="paths.examples"
              class="min-h-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8"
            >
              <app-fade-demo-examples />
            </div>
          }
          @case (paths.start) {
            <div
              [ssgoiTransition]="paths.start"
              class="min-h-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8"
            >
              <app-fade-demo-start />
            </div>
          }
        }
      </app-demo-layout>
    </app-browser-mockup>
  `,
})
export class FadeDemoComponent {
  readonly paths = FADE_PATHS;
  currentPath = signal(FADE_PATHS.home);
  readonly routes: DemoRouteConfig[] = [
    { path: FADE_PATHS.home, label: 'Home' },
    { path: FADE_PATHS.features, label: 'Features' },
    { path: FADE_PATHS.examples, label: 'Examples' },
    { path: FADE_PATHS.start, label: 'Start' },
  ];
  readonly ssgoiConfig = {
    defaultTransition: fade(),
  };

  onNavigate(path: string) {
    console.log('path', path);
    this.currentPath.set(path);
  }
}
