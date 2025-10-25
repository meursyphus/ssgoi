import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-scroll-demo-intro',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/scroll/intro">
      <div class="bg-gray-900 min-h-full overflow-y-auto">
        <div class="p-4 md:p-8 max-w-3xl mx-auto">
          <div class="mb-3 md:mb-6 text-2xl md:text-4xl">📝</div>

          <h1 class="mb-3 md:mb-4 text-xl md:text-3xl font-bold text-gray-100">
            Scroll Transitions
          </h1>

          <p class="mb-4 md:mb-6 text-sm md:text-lg text-gray-400">
            Experience smooth, natural scrolling transitions between pages.
          </p>

          <div class="space-y-2 md:space-y-3">
            @for (item of features; track item) {
              <div class="flex items-start space-x-2 md:space-x-3">
                <div class="mt-0.5 md:mt-1">
                  <svg
                    class="h-4 w-4 md:h-5 md:w-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p class="text-xs md:text-base text-gray-300">{{ item }}</p>
              </div>
            }
          </div>

          <div
            class="mt-4 md:mt-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 md:p-6 border border-gray-600"
          >
            <div class="flex items-center space-x-2 md:space-x-3">
              <div class="rounded-full bg-blue-600 p-1.5 md:p-2">
                <svg
                  class="h-4 w-4 md:h-5 md:w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm md:text-base font-medium text-gray-100">
                  Get Started
                </p>
                <p class="text-xs md:text-sm text-gray-400">
                  Click the menu items to navigate between sections
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ScrollDemoIntroComponent {
  features = [
    'Smooth scroll animations',
    'Mobile app-like UX',
    'Intuitive page navigation',
  ];
}
