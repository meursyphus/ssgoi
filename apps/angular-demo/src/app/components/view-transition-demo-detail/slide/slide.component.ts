import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi, SsgoiConfig } from '@ssgoi/angular';
import { slide } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import { SlideDemoClothingComponent } from './slide-demo-clothing.component';
import { SlideDemoShoesComponent } from './slide-demo-shoes.component';
import { SlideDemoAccessoriesComponent } from './slide-demo-accessories.component';
import { SlideLayoutComponent, SlideRoute } from './slide-layout.component';

// Main Slide Demo Component
@Component({
  selector: 'app-slide-demo',
  imports: [
    Ssgoi,
    SlideLayoutComponent,
    BrowserMockupComponent,
    SlideDemoClothingComponent,
    SlideDemoShoesComponent,
    SlideDemoAccessoriesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <app-slide-layout
        ssgoi
        [config]="ssgoiConfig"
        [routes]="routes"
        [currentPath]="currentPath()"
        (navigate)="onNavigate($event)"
      >
        @for (page of [currentPath()]; track page) {
          @switch (page) {
            @case ('/slide/clothing') {
              <app-slide-demo-clothing />
            }
            @case ('/slide/shoes') {
              <app-slide-demo-shoes />
            }
            @case ('/slide/accessories') {
              <app-slide-demo-accessories />
            }
          }
        }
      </app-slide-layout>
    </app-browser-mockup>
  `,
})
export class SlideDemoComponent {
  readonly routes: SlideRoute[] = [
    { path: '/slide/clothing', label: 'Clothing' },
    { path: '/slide/shoes', label: 'Shoes' },
    { path: '/slide/accessories', label: 'Accessories' },
  ];

  ssgoiConfig: SsgoiConfig = {
    transitions: [
      {
        from: '/nav/left',
        to: '/nav/right',
        transition: slide({
          direction: 'left',
        }),
      },
      {
        from: '/nav/right',
        to: '/nav/left',
        transition: slide({
          direction: 'right',
        }),
      },
    ],
    middleware: (from: string, to: string) => {
      const routeOrder = this.routes.map((r) => r.path);
      const fromIndex = routeOrder.indexOf(from);
      const toIndex = routeOrder.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1) {
        if (fromIndex < toIndex) {
          // Going right (forward in tab order)
          return { from: '/nav/left', to: '/nav/right' };
        } else {
          // Going left (backward in tab order)
          return { from: '/nav/right', to: '/nav/left' };
        }
      }

      return { from, to };
    },
  };

  currentPath = signal('/slide/clothing');

  onNavigate(path: string) {
    this.currentPath.set(path);
  }
}
