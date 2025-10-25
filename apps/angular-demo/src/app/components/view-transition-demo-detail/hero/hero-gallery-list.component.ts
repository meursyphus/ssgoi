import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  photographer: string;
  location: string;
  tags: string[];
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'hero-1',
    title: 'Mountain Vista',
    category: 'Nature',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    description:
      'Breathtaking mountain peaks covered in snow, reaching towards the clear blue sky.',
    photographer: 'Samuel Ferrara',
    location: 'Swiss Alps',
    tags: ['mountain', 'snow', 'landscape'],
  },
  {
    id: 'hero-2',
    title: 'Urban Nights',
    category: 'City',
    image:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
    description:
      'City lights reflecting on wet streets after an evening rain, creating a vibrant urban tapestry.',
    photographer: 'Alex Knight',
    location: 'Tokyo, Japan',
    tags: ['city', 'night', 'lights'],
  },
  {
    id: 'hero-3',
    title: 'Ocean Waves',
    category: 'Seascape',
    image:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    description:
      'Powerful ocean waves crashing against rocky cliffs during golden hour.',
    photographer: 'Maria Chen',
    location: 'Big Sur, California',
    tags: ['ocean', 'waves', 'sunset'],
  },
  {
    id: 'hero-4',
    title: 'Desert Dunes',
    category: 'Landscape',
    image:
      'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800&h=600&fit=crop',
    description:
      'Endless sand dunes creating mesmerizing patterns under the desert sun.',
    photographer: 'Robert Lee',
    location: 'Sahara Desert',
    tags: ['desert', 'sand', 'dunes'],
  },
  {
    id: 'hero-5',
    title: 'Forest Path',
    category: 'Nature',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    description:
      'A mysterious path winding through an ancient forest filled with towering trees.',
    photographer: 'Elena Woods',
    location: 'Black Forest, Germany',
    tags: ['forest', 'trees', 'path'],
  },
  {
    id: 'hero-6',
    title: 'Aurora Sky',
    category: 'Sky',
    image:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
    description:
      'Northern lights dancing across the Arctic sky in brilliant greens and blues.',
    photographer: 'Nordic Vision',
    location: 'Iceland',
    tags: ['aurora', 'northern lights', 'sky'],
  },
];

@Component({
  selector: 'app-hero-gallery-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-6',
  },
  template: `
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white mb-2">Photo Gallery</h1>
      <p class="text-gray-400">
        Click any image to see the hero transition effect
      </p>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
      @for (item of galleryItems; track item.id) {
        <article
          class="group cursor-pointer block"
          (click)="navigate.emit('/hero/gallery/' + item.id)"
        >
          <div
            class="relative bg-gray-800 rounded-lg transition-transform duration-300 hover:scale-105"
          >
            <!-- Hero transition element -->
            <div [attr.data-hero-key]="item.id" class="relative aspect-[4/3]">
              <img
                [src]="item.image"
                [alt]="item.title"
                class="w-full h-full object-cover rounded-lg"
              />
              <!-- Overlay on hover -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              >
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <span
                    class="text-xs text-teal-400 font-medium uppercase tracking-wider"
                  >
                    {{ item.category }}
                  </span>
                  <h3 class="text-white font-semibold text-lg mt-1">
                    {{ item.title }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </article>
      }
    </div>
  `,
})
export class HeroGalleryListComponent {
  navigate = output<string>();
  readonly galleryItems = GALLERY_ITEMS;
}
