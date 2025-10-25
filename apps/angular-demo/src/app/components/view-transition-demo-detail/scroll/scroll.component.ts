import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi, SsgoiConfig } from '@ssgoi/angular';
import { scroll } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import { ScrollDemoExamplesComponent } from './scroll-demo-examples.component';
import { ScrollDemoFeaturesComponent } from './scroll-demo-features.component';
import { ScrollDemoIntroComponent } from './scroll-demo-intro.component';
import { ScrollDemoUsageComponent } from './scroll-demo-usage.component';
import { ScrollLayoutComponent, ScrollRoute } from './scroll-layout.component';

// Main Scroll Demo Component
@Component({
  selector: 'app-scroll-demo',
  imports: [
    Ssgoi,
    ScrollLayoutComponent,
    BrowserMockupComponent,
    ScrollDemoIntroComponent,
    ScrollDemoFeaturesComponent,
    ScrollDemoUsageComponent,
    ScrollDemoExamplesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <app-scroll-layout
        ssgoi
        [config]="ssgoiConfig"
        [routes]="routes"
        [currentPath]="currentPath()"
        (navigate)="onNavigate($event)"
      >
        @for (page of [currentPath()]; track page) {
          @switch (page) {
            @case ('/scroll/intro') {
              <app-scroll-demo-intro />
            }
            @case ('/scroll/features') {
              <app-scroll-demo-features />
            }
            @case ('/scroll/usage') {
              <app-scroll-demo-usage />
            }
            @case ('/scroll/examples') {
              <app-scroll-demo-examples />
            }
          }
        }
      </app-scroll-layout>
    </app-browser-mockup>
  `,
})
export class ScrollDemoComponent {
  readonly routes: ScrollRoute[] = [
    { path: '/scroll/intro', label: 'Introduction' },
    { path: '/scroll/features', label: 'Features' },
    { path: '/scroll/usage', label: 'Usage' },
    { path: '/scroll/examples', label: 'Examples' },
  ];

  ssgoiConfig: SsgoiConfig = {
    transitions: [
      {
        from: '/nav/previous',
        to: '/nav/next',
        transition: scroll({
          direction: 'up',
        }),
      },
      {
        from: '/nav/next',
        to: '/nav/previous',
        transition: scroll({
          direction: 'down',
        }),
      },
    ],
    middleware: (from: string, to: string) => {
      const routeOrder = this.routes.map((r) => r.path);
      const fromIndex = routeOrder.indexOf(from);
      const toIndex = routeOrder.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1) {
        if (fromIndex < toIndex) {
          // Going forward (down the list)
          return { from: '/nav/previous', to: '/nav/next' };
        } else {
          // Going backward (up the list)
          return { from: '/nav/next', to: '/nav/previous' };
        }
      }

      return { from, to };
    },
  };

  currentPath = signal('/scroll/intro');

  // Arrow function to avoid .bind(this)
  navigateTo = (path: string) => {
    this.currentPath.set(path);
  };

  onNavigate(path: string) {
    this.currentPath.set(path);
  }
}
