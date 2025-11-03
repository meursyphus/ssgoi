import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
import { pinterest } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import {
  PinterestGalleryListComponent,
  PINTEREST_ITEMS,
} from './pinterest-gallery-list.component';
import { PinterestGalleryDetailComponent } from './pinterest-gallery-detail.component';

const PINTEREST_ROUTES = {
  GALLERY: '/pinterest/gallery',
} as const;

const PINTEREST_ROUTE_WILDCARD = `${PINTEREST_ROUTES.GALLERY}/*`;
const PINTEREST_DETAIL_PREFIX = `${PINTEREST_ROUTES.GALLERY}/`;

// Main Pinterest Demo Component
@Component({
  selector: 'app-pinterest-demo',
  imports: [
    BrowserMockupComponent,
    Ssgoi,
    SsgoiTransition,
    PinterestGalleryListComponent,
    PinterestGalleryDetailComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <div class="bg-gray-950 min-h-full">
        <div class="max-w-md mx-auto overflow-hidden">
          <div class="relative z-0 w-full" ssgoi [config]="ssgoiConfig">
            @if (currentPath() === ROUTES.GALLERY) {
              <div [ssgoiTransition]="ROUTES.GALLERY" class="min-h-full">
                <app-pinterest-gallery-list (navigate)="onNavigate($event)" />
              </div>
            } @else if (currentItem(); as item) {
              <div [ssgoiTransition]="detailPath(item.id)" class="min-h-full">
                <app-pinterest-gallery-detail
                  [item]="item"
                  (navigate)="onNavigate($event)"
                />
              </div>
            }
          </div>
        </div>
      </div>
    </app-browser-mockup>
  `,
})
export class PinterestDemoComponent {
  protected readonly ROUTES = PINTEREST_ROUTES;
  currentPath = signal<string>(PINTEREST_ROUTES.GALLERY);
  readonly ssgoiConfig = {
    transitions: [
      {
        from: PINTEREST_ROUTES.GALLERY,
        to: PINTEREST_ROUTE_WILDCARD,
        transition: pinterest({ spring: { stiffness: 150, damping: 20 } }),
        symmetric: true,
      },
    ],
  };
  readonly pinterestItems = PINTEREST_ITEMS;

  // Computed signal to get current item based on path
  currentItem = computed(() => {
    const path = this.currentPath();
    if (!path.startsWith(PINTEREST_DETAIL_PREFIX)) {
      return undefined;
    }

    const itemId = path.slice(PINTEREST_DETAIL_PREFIX.length);
    return this.pinterestItems.find((item) => item.id === itemId);
  });

  onNavigate(path: string) {
    this.currentPath.set(path);
  }

  detailPath(id: string) {
    return `${PINTEREST_DETAIL_PREFIX}${id}`;
  }
}
