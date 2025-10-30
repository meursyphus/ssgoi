import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
import { strip } from '@ssgoi/angular/view-transitions';
import {
  BrowserMockupComponent,
  type DemoRouteConfig,
} from '../shared/browser-mockup.component';
import { StripLayoutComponent } from './strip-layout.component';
import { StripDemoSpeakingComponent } from './strip-demo-speaking.component';
import { StripDemoCreatingComponent } from './strip-demo-creating.component';
import { StripDemoImpactComponent } from './strip-demo-impact.component';

@Component({
  selector: 'app-strip-demo',
  imports: [
    CommonModule,
    BrowserMockupComponent,
    StripLayoutComponent,
    Ssgoi,
    SsgoiTransition,
    StripDemoSpeakingComponent,
    StripDemoCreatingComponent,
    StripDemoImpactComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <app-strip-layout
        ssgoi
        [config]="ssgoiConfig"
        [routes]="routes"
        [currentPath]="currentPath()"
        (navigate)="onNavigate($event)"
      >
        @switch (currentPath()) {
          @case (ROUTES.SPEAKING) {
            <div [ssgoiTransition]="ROUTES.SPEAKING" class="min-h-full">
              <app-strip-demo-speaking />
            </div>
          }
          @case (ROUTES.CREATING) {
            <div [ssgoiTransition]="ROUTES.CREATING" class="min-h-full">
              <app-strip-demo-creating />
            </div>
          }
          @case (ROUTES.IMPACT) {
            <div [ssgoiTransition]="ROUTES.IMPACT" class="min-h-full">
              <app-strip-demo-impact />
            </div>
          }
        }
      </app-strip-layout>
    </app-browser-mockup>
  `,
})
export class StripDemoComponent {
  protected readonly ROUTES = {
    SPEAKING: '/strip' as string,
    CREATING: '/strip/creating' as string,
    IMPACT: '/strip/impact' as string,
  };

  currentPath = signal(this.ROUTES.SPEAKING);
  readonly routes: DemoRouteConfig[] = [
    { path: this.ROUTES.SPEAKING, label: 'Speaking' },
    { path: this.ROUTES.CREATING, label: 'Creating' },
    { path: this.ROUTES.IMPACT, label: 'Impact' },
  ];
  readonly ssgoiConfig = {
    defaultTransition: strip(),
  };

  onNavigate(path: string) {
    console.log('strip path', path);
    this.currentPath.set(path);
  }
}
