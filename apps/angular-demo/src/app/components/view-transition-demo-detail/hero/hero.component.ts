import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
import { hero } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import {
  HeroGalleryListComponent,
  GALLERY_ITEMS,
} from './hero-gallery-list.component';
import { HeroGalleryDetailComponent } from './hero-gallery-detail.component';

const HERO_ROUTES = {
  GALLERY: '/hero/gallery',
} as const;

const HERO_DETAIL_PREFIX = `${HERO_ROUTES.GALLERY}/`;

// Main Hero Demo Component
@Component({
  selector: 'app-hero-demo',
  imports: [
    BrowserMockupComponent,
    Ssgoi,
    SsgoiTransition,
    HeroGalleryListComponent,
    HeroGalleryDetailComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <div ssgoi [config]="ssgoiConfig">
        @if (currentPath() === ROUTES.GALLERY) {
          <div [ssgoiTransition]="ROUTES.GALLERY" class="min-h-full">
            <app-hero-gallery-list (navigate)="onNavigate($event)" />
          </div>
        } @else if (currentItem(); as item) {
          <div [ssgoiTransition]="detailPath(item.id)" class="min-h-full">
            <app-hero-gallery-detail
              [item]="item"
              (navigate)="onNavigate($event)"
            />
          </div>
        }
      </div>
    </app-browser-mockup>
  `,
})
export class HeroDemoComponent {
  protected readonly ROUTES = HERO_ROUTES;
  currentPath = signal<string>(HERO_ROUTES.GALLERY);
  readonly ssgoiConfig = {
    defaultTransition: hero(),
  };
  readonly galleryItems = GALLERY_ITEMS;

  // Computed signal to get current item based on path
  currentItem = computed(() => {
    const path = this.currentPath();
    if (!path.startsWith(HERO_DETAIL_PREFIX)) {
      return undefined;
    }

    const itemId = path.slice(HERO_DETAIL_PREFIX.length);
    return this.galleryItems.find((item) => item.id === itemId);
  });

  onNavigate(path: string) {
    this.currentPath.set(path);
  }

  detailPath(id: string) {
    return `${HERO_DETAIL_PREFIX}${id}`;
  }
}
