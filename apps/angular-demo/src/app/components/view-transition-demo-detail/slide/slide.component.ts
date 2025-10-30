import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ssgoi, SsgoiConfig, SsgoiTransition } from '@ssgoi/angular';
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
    CommonModule,
    Ssgoi,
    SsgoiTransition,
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
        @switch (currentPath()) {
          @case (ROUTES.CLOTHING) {
            <div [ssgoiTransition]="ROUTES.CLOTHING" class="h-full bg-white">
              <app-slide-demo-clothing />
            </div>
          }
          @case (ROUTES.SHOES) {
            <div [ssgoiTransition]="ROUTES.SHOES" class="h-full bg-white">
              <app-slide-demo-shoes />
            </div>
          }
          @case (ROUTES.ACCESSORIES) {
            <div [ssgoiTransition]="ROUTES.ACCESSORIES" class="h-full bg-white">
              <app-slide-demo-accessories />
            </div>
          }
        }
      </app-slide-layout>
    </app-browser-mockup>
  `,
})
export class SlideDemoComponent {
  protected readonly ROUTES = {
    CLOTHING: '/slide/clothing' as string,
    SHOES: '/slide/shoes' as string,
    ACCESSORIES: '/slide/accessories' as string,
  };

  private readonly routeOrder = [
    this.ROUTES.CLOTHING,
    this.ROUTES.SHOES,
    this.ROUTES.ACCESSORIES,
  ];

  currentPath = signal(this.ROUTES.CLOTHING);

  readonly routes: SlideRoute[] = [
    { path: this.ROUTES.CLOTHING, label: 'Clothing' },
    { path: this.ROUTES.SHOES, label: 'Shoes' },
    { path: this.ROUTES.ACCESSORIES, label: 'Accessories' },
  ];

  readonly ssgoiConfig: SsgoiConfig = {
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
      return this.mapNavigationDirection(from, to);
    },
  };

  onNavigate(path: string) {
    this.currentPath.set(path);
  }

  private mapNavigationDirection(from: string, to: string) {
    const fromIndex = this.routeOrder.indexOf(from);
    const toIndex = this.routeOrder.indexOf(to);

    if (fromIndex !== -1 && toIndex !== -1) {
      return fromIndex < toIndex
        ? { from: '/nav/left', to: '/nav/right' }
        : { from: '/nav/right', to: '/nav/left' };
    }

    return { from, to };
  }
}
