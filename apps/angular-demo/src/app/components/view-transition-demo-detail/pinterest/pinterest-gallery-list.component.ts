import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';

export interface PinterestItem {
  id: string;
  image: string;
  title: string;
  author: string;
  authorAvatar: string;
  likes: number;
  height: string;
}

export const PINTEREST_ITEMS: PinterestItem[] = [
  {
    id: 'pin-1',
    image: '/demo/pinterest/10-400x400.jpg',
    title: 'Modern Architecture',
    author: 'Alex Chen',
    authorAvatar: '/demo/pinterest/avatar-1.jpg',
    likes: 234,
    height: 'h-48',
  },
  {
    id: 'pin-2',
    image: '/demo/pinterest/11-400x667.jpg',
    title: 'Nature Photography',
    author: 'Sarah Miller',
    authorAvatar: '/demo/pinterest/avatar-2.jpg',
    likes: 512,
    height: 'h-64',
  },
  {
    id: 'pin-3',
    image: '/demo/pinterest/12-400x800.jpg',
    title: 'Urban Exploration',
    author: 'Mike Johnson',
    authorAvatar: '/demo/pinterest/avatar-3.jpg',
    likes: 189,
    height: 'h-72',
  },
  {
    id: 'pin-4',
    image: '/demo/pinterest/13-400x533.jpg',
    title: 'Minimalist Design',
    author: 'Emily Davis',
    authorAvatar: '/demo/pinterest/avatar-4.jpg',
    likes: 892,
    height: 'h-56',
  },
  {
    id: 'pin-5',
    image: '/demo/pinterest/14-400x1000.jpg',
    title: 'Abstract Art',
    author: 'David Lee',
    authorAvatar: '/demo/pinterest/avatar-5.jpg',
    likes: 445,
    height: 'h-80',
  },
  {
    id: 'pin-6',
    image: '/demo/pinterest/15-400x800.jpg',
    title: 'Street Photography',
    author: 'Alex Chen',
    authorAvatar: '/demo/pinterest/avatar-1.jpg',
    likes: 667,
    height: 'h-72',
  },
  {
    id: 'pin-7',
    image: '/demo/pinterest/16-400x600.jpg',
    title: 'Landscape Vista',
    author: 'Sarah Miller',
    authorAvatar: '/demo/pinterest/avatar-2.jpg',
    likes: 334,
    height: 'h-60',
  },
  {
    id: 'pin-8',
    image: '/demo/pinterest/17-400x667.jpg',
    title: 'Creative Spaces',
    author: 'Mike Johnson',
    authorAvatar: '/demo/pinterest/avatar-3.jpg',
    likes: 778,
    height: 'h-64',
  },
  {
    id: 'pin-9',
    image: '/demo/pinterest/18-400x400.jpg',
    title: 'Geometric Patterns',
    author: 'Emily Davis',
    authorAvatar: '/demo/pinterest/avatar-4.jpg',
    likes: 223,
    height: 'h-48',
  },
  {
    id: 'pin-10',
    image: '/demo/pinterest/19-400x667.jpg',
    title: 'Color Theory',
    author: 'David Lee',
    authorAvatar: '/demo/pinterest/avatar-5.jpg',
    likes: 556,
    height: 'h-64',
  },
];

@Component({
  selector: 'app-pinterest-gallery-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen p-4',
  },
  template: `
    <!-- Header -->
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-white mb-2">Discover Ideas</h1>
      <p class="text-gray-400 text-sm">
        Click any pin to see the Pinterest-style expand effect
      </p>
    </div>

    <!-- Pinterest Masonry Grid -->
    <div class="columns-2 gap-3 space-y-3">
      @for (item of pinterestItems; track item.id) {
        <div
          class="break-inside-avoid block cursor-pointer"
          (click)="navigate.emit('/pinterest/gallery/' + item.id)"
        >
          <article class="relative group">
            <!-- Pin container with Pinterest transition -->
            <div
              class="relative bg-gray-800 rounded-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
            >
              <!-- Image -->
              <img
                [src]="item.image"
                [alt]="item.title"
                class="w-full h-auto object-cover"
                [attr.data-pinterest-gallery-key]="item.id"
              />

              <!-- Hover Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <!-- Save button visual -->
                <div
                  class="absolute top-2 right-2 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                >
                  Save
                </div>

                <!-- Bottom info -->
                <div class="absolute bottom-0 left-0 right-0 p-2">
                  <h3
                    class="text-white font-semibold text-xs mb-1 line-clamp-1"
                  >
                    {{ item.title }}
                  </h3>
                  <div class="flex items-center gap-1">
                    <img
                      [src]="item.authorAvatar"
                      [alt]="item.author"
                      class="w-4 h-4 rounded-full"
                    />
                    <span class="text-gray-300 text-[10px]">
                      {{ item.author }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Like count (always visible) -->
              <div
                class="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded"
              >
                <span class="text-white text-[10px] font-medium">
                  ❤️ {{ item.likes }}
                </span>
              </div>
            </div>
          </article>
        </div>
      }
    </div>
  `,
})
export class PinterestGalleryListComponent {
  navigate = output<string>();
  readonly pinterestItems = PINTEREST_ITEMS;
}
