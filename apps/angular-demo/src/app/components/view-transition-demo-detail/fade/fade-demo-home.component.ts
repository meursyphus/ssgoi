import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-fade-demo-home',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/fade">
      <div
        class="min-h-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8"
      >
        <div class="max-w-6xl mx-auto px-4 py-12 sm:py-20">
          <div class="text-center space-y-6">
            <div class="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
              <span class="text-blue-400 text-sm font-semibold">
                SMOOTH TRANSITIONS
              </span>
            </div>
            <h1 class="text-4xl sm:text-6xl font-bold text-white">
              Welcome to
              <span
                class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                SSGOI
              </span>
            </h1>
            <p class="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
              Native app-like page transitions for the web. Transform your
              static pages into smooth, delightful experiences.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                (click)="navigate.emit('/fade/features')"
                class="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Get Started
              </button>
              <button
                (click)="navigate.emit('/fade/examples')"
                class="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                View Examples
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
            <div class="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
              <div class="text-3xl mb-3">🌍</div>
              <h3 class="text-lg font-semibold text-white mb-2">
                Works Everywhere
              </h3>
              <p class="text-gray-400 text-sm">
                Unlike View Transition API, works in all modern browsers
              </p>
            </div>
            <div class="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
              <div class="text-3xl mb-3">🚀</div>
              <h3 class="text-lg font-semibold text-white mb-2">SSR Ready</h3>
              <p class="text-gray-400 text-sm">
                Perfect with Next.js, Nuxt, SvelteKit. SEO-friendly
              </p>
            </div>
            <div class="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
              <div class="text-3xl mb-3">🎯</div>
              <h3 class="text-lg font-semibold text-white mb-2">Any Router</h3>
              <p class="text-gray-400 text-sm">
                Keep your existing routing solution
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FadeDemoHomeComponent {
  navigate = output<string>();
}
