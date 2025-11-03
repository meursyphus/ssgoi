import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import type { PinterestItem } from './pinterest-gallery-list.component';

@Component({
  selector: 'app-pinterest-gallery-detail',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen',
  },
  template: `
    <!-- Content -->
    <!-- Image with overlays -->
    <div class="relative bg-gray-800">
      <img
        [src]="item().image"
        [alt]="item().title"
        class="w-full h-auto"
        [attr.data-pinterest-detail-key]="item().id"
      />

      <!-- Back button overlay -->
      <button
        (click)="navigate.emit('/pinterest/gallery')"
        class="absolute top-3 left-3 p-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-white"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Save button overlay -->
      <button
        class="absolute top-3 right-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-full transition-colors"
      >
        Save
      </button>

      <!-- Like count overlay -->
      <div
        class="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md"
      >
        <span class="text-white text-sm font-medium">
          ❤️ {{ item().likes }}
        </span>
      </div>
    </div>

    <!-- Details below image -->
    <div class="p-4">
      <h1 class="text-xl font-bold text-white mb-3">{{ item().title }}</h1>

      <!-- Author section -->
      <div class="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
        <img
          [src]="item().authorAvatar"
          [alt]="item().author"
          class="w-10 h-10 rounded-full"
        />
        <div class="flex-1">
          <p class="text-white font-medium">{{ item().author }}</p>
          <p class="text-gray-400 text-sm">2.3k followers</p>
        </div>
        <button
          class="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
        >
          Follow
        </button>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-6 mb-6 text-sm text-gray-400">
        <span>💬 42 comments</span>
        <span>🔗 15 shares</span>
        <span>👁 1.2k views</span>
      </div>

      <!-- Comments section -->
      <div class="space-y-4 mb-6">
        <h3 class="text-white font-semibold">Comments</h3>
        <div class="space-y-3">
          <div class="flex gap-3">
            <img
              src="/demo/pinterest/avatar-2.jpg"
              alt="Commenter"
              class="w-8 h-8 rounded-full"
            />
            <div class="flex-1">
              <p class="text-white text-sm">
                <span class="font-semibold">Sarah M.</span> Beautiful
                composition! Love the colors 🎨
              </p>
              <p class="text-gray-500 text-xs mt-1">2h ago</p>
            </div>
          </div>
          <div class="flex gap-3">
            <img
              src="/demo/pinterest/avatar-3.jpg"
              alt="Commenter"
              class="w-8 h-8 rounded-full"
            />
            <div class="flex-1">
              <p class="text-white text-sm">
                <span class="font-semibold">Mike J.</span> Where was this taken?
                Stunning view!
              </p>
              <p class="text-gray-500 text-xs mt-1">5h ago</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Related pins -->
      <div>
        <h3 class="text-white font-semibold mb-4">More like this</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-800 rounded-lg aspect-[4/5]"></div>
          <div class="bg-gray-800 rounded-lg aspect-[4/5]"></div>
          <div class="bg-gray-800 rounded-lg aspect-[4/5]"></div>
          <div class="bg-gray-800 rounded-lg aspect-[4/5]"></div>
        </div>
      </div>
    </div>
  `,
})
export class PinterestGalleryDetailComponent implements OnInit, OnDestroy {
  item = input.required<PinterestItem>();
  navigate = output<string>();

  private handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.navigate.emit('/pinterest/gallery');
    }
  };

  ngOnInit() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }
}
