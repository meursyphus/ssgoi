import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import type { GalleryItem } from './hero-gallery-list.component';

@Component({
  selector: 'app-hero-gallery-detail',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen bg-black relative',
  },
  template: `
    <!-- Full screen image with hero transition -->
    <div [attr.data-hero-key]="item().id" class="relative h-screen">
      <img
        [src]="item().image"
        [alt]="item().title"
        class="w-full h-full object-cover"
      />

      <!-- Top navigation bar overlaying the image -->
      <div
        class="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4"
      >
        <div class="flex items-center justify-between max-w-6xl mx-auto">
          <button
            (click)="navigate.emit('/hero/gallery')"
            class="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all transform hover:scale-105"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span class="font-medium">Back to Gallery</span>
          </button>

          <!-- Close button with ESC hint -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 hidden md:block">
              Press ESC
            </span>
            <button
              (click)="navigate.emit('/hero/gallery')"
              class="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all transform hover:scale-105"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Image info overlay -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8"
      >
        <div class="max-w-4xl mx-auto">
          <span
            class="text-sm text-teal-400 font-medium uppercase tracking-wider"
          >
            {{ item().category }}
          </span>
          <h1 class="text-4xl font-bold text-white mt-2 mb-4">
            {{ item().title }}
          </h1>
          <p class="text-gray-300 text-lg mb-6 max-w-2xl">
            {{ item().description }}
          </p>

          <!-- Metadata -->
          <div class="flex flex-wrap gap-6 text-sm">
            <div>
              <span class="text-gray-500">Photographer</span>
              <p class="text-white font-medium">
                {{ item().photographer }}
              </p>
            </div>
            <div>
              <span class="text-gray-500">Location</span>
              <p class="text-white font-medium">{{ item().location }}</p>
            </div>
            <div>
              <span class="text-gray-500">Tags</span>
              <div class="flex gap-2 mt-1">
                @for (tag of item().tags; track tag) {
                  <span
                    class="px-2 py-1 bg-white/10 rounded text-xs text-white"
                  >
                    #{{ tag }}
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HeroGalleryDetailComponent implements OnInit, OnDestroy {
  item = input.required<GalleryItem>();
  navigate = output<string>();

  private handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.navigate.emit('/hero/gallery');
    }
  };

  ngOnInit() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }
}
