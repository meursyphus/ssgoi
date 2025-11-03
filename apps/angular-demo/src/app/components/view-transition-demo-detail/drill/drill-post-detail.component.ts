import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import type { BlogPost } from './drill-posts-list.component';

@Component({
  selector: 'app-drill-post-detail',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block min-h-screen bg-gray-950',
  },
  template: `
    <!-- Header with Back Button -->
    <div
      class="sticky top-0 z-10 bg-gray-950/80 backdrop-blur-md border-b border-gray-800"
    >
      <div class="max-w-4xl mx-auto p-4">
        <button
          (click)="navigate.emit('/posts')"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
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
          <span>Back to Posts</span>
        </button>
      </div>
    </div>

    <!-- Article Content -->
    <article class="max-w-4xl mx-auto p-6">
      <!-- Cover Image -->
      <div class="relative aspect-[21/9] mb-8 rounded-xl overflow-hidden">
        <img
          [src]="post().coverImage"
          [alt]="post().title"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"
        ></div>
      </div>

      <!-- Article Header -->
      <header class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <span
            class="text-sm text-teal-400 font-medium uppercase tracking-wider"
          >
            {{ post().category }}
          </span>
          <span class="text-sm text-gray-500">•</span>
          <span class="text-sm text-gray-500">{{ post().date }}</span>
          <span class="text-sm text-gray-500">•</span>
          <span class="text-sm text-gray-500">
            {{ post().readTime }} min read
          </span>
        </div>

        <h1 class="text-4xl font-bold text-white mb-6">{{ post().title }}</h1>

        <p class="text-xl text-gray-400 mb-6">{{ post().excerpt }}</p>

        <!-- Author Info -->
        <div class="flex items-center gap-4 pb-6 border-b border-gray-800">
          <img
            [src]="post().author.avatar"
            [alt]="post().author.name"
            class="w-12 h-12 rounded-full"
          />
          <div>
            <p class="text-white font-medium">{{ post().author.name }}</p>
            <p class="text-sm text-gray-500">Author</p>
          </div>
        </div>
      </header>

      <!-- Article Content -->
      <div class="prose prose-invert max-w-none">
        <div class="text-gray-300 leading-relaxed whitespace-pre-line">
          {{ post().content }}
        </div>
      </div>

      <!-- Footer -->
      <footer class="mt-12 pt-8 border-t border-gray-800">
        <button
          (click)="navigate.emit('/posts')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
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
          <span>Back to All Posts</span>
        </button>
      </footer>
    </article>
  `,
})
export class DrillPostDetailComponent implements OnInit, OnDestroy {
  post = input.required<BlogPost>();
  navigate = output<string>();

  private handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.navigate.emit('/posts');
    }
  };

  ngOnInit() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }
}
