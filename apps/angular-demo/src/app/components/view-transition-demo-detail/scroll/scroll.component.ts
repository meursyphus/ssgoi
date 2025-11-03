import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssgoi, SsgoiConfig, SsgoiTransition } from '@ssgoi/angular';
import { scroll } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import { ScrollDemoExamplesComponent } from './scroll-demo-examples.component';
import { ScrollDemoFeaturesComponent } from './scroll-demo-features.component';
import { ScrollDemoIntroComponent } from './scroll-demo-intro.component';
import { ScrollDemoUsageComponent } from './scroll-demo-usage.component';
import { ScrollLayoutComponent, ScrollRoute } from './scroll-layout.component';

const SCROLL_ROUTES = {
  INTRO: '/scroll/intro',
  FEATURES: '/scroll/features',
  USAGE: '/scroll/usage',
  EXAMPLES: '/scroll/examples',
} as const;

type ScrollRoutePath = (typeof SCROLL_ROUTES)[keyof typeof SCROLL_ROUTES];

// Main Scroll Demo Component
@Component({
  selector: 'app-scroll-demo',
  imports: [
    CommonModule,
    Ssgoi,
    SsgoiTransition,
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
        @switch (currentPath()) {
          @case (ROUTES.INTRO) {
            <div [ssgoiTransition]="ROUTES.INTRO" class="h-full">
              <app-scroll-demo-intro />
            </div>
          }
          @case (ROUTES.FEATURES) {
            <div [ssgoiTransition]="ROUTES.FEATURES" class="h-full">
              <app-scroll-demo-features />
            </div>
          }
          @case (ROUTES.USAGE) {
            <div [ssgoiTransition]="ROUTES.USAGE" class="h-full">
              <app-scroll-demo-usage />
            </div>
          }
          @case (ROUTES.EXAMPLES) {
            <div [ssgoiTransition]="ROUTES.EXAMPLES" class="h-full">
              <app-scroll-demo-examples />
            </div>
          }
        }
      </app-scroll-layout>
    </app-browser-mockup>
  `,
})
export class ScrollDemoComponent {
  protected readonly ROUTES = SCROLL_ROUTES;

  private readonly routeOrder: ScrollRoutePath[] = [
    this.ROUTES.INTRO,
    this.ROUTES.FEATURES,
    this.ROUTES.USAGE,
    this.ROUTES.EXAMPLES,
  ];

  currentPath = signal<ScrollRoutePath>(this.ROUTES.INTRO);

  readonly routes: ScrollRoute[] = [
    { path: this.ROUTES.INTRO, label: 'Introduction' },
    { path: this.ROUTES.FEATURES, label: 'Features' },
    { path: this.ROUTES.USAGE, label: 'Usage' },
    { path: this.ROUTES.EXAMPLES, label: 'Examples' },
  ];

  readonly ssgoiConfig: SsgoiConfig = {
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
      return this.mapNavigationDirection(from, to);
    },
  };

  onNavigate(path: string) {
    if (this.isScrollRoutePath(path)) {
      this.currentPath.set(path);
    }
  }

  private mapNavigationDirection(from: string, to: string) {
    if (this.isScrollRoutePath(from) && this.isScrollRoutePath(to)) {
      const fromIndex = this.routeOrder.indexOf(from);
      const toIndex = this.routeOrder.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1) {
        return fromIndex < toIndex
          ? { from: '/nav/previous', to: '/nav/next' }
          : { from: '/nav/next', to: '/nav/previous' };
      }
    }

    return { from, to };
  }

  private isScrollRoutePath(path: string): path is ScrollRoutePath {
    return this.routeOrder.includes(path as ScrollRoutePath);
  }
}
