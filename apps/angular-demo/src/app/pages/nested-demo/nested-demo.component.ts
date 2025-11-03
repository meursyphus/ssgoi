import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
import { slide } from '@ssgoi/angular/view-transitions';
import type { SsgoiConfig } from '@ssgoi/angular';

@Component({
  selector: 'app-nested-demo',
  standalone: true,
  imports: [Ssgoi, SsgoiTransition, RouterLink],
  template: `
    <div ssgoiTransition="/nested-demo">
      <div class="min-h-screen bg-gray-950 text-gray-100 p-8">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="mb-8">
            <a
              routerLink="/"
              class="inline-flex items-center text-gray-400 hover:text-orange-500 transition-colors mb-6"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </a>
            <h1 class="text-4xl font-bold text-white mb-4">
              Nested Context Test
            </h1>
            <p class="text-lg text-gray-400">
              This page tests whether nested &lt;ssgoi&gt; contexts work
              independently
            </p>
          </div>

          <!-- Outer Context Info -->
          <div class="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 class="text-2xl font-semibold text-white mb-3">
              Outer Context
            </h2>
            <p class="text-gray-300">
              This page uses app-level transitions defined in
              <code class="bg-gray-800 px-2 py-1 rounded font-mono text-sm"
                >app.component.ts</code
              >
            </p>
            <p class="text-gray-400 text-sm mt-2">
              Check console for "🔍 Transition:" logs from outer context
            </p>
          </div>

          <!-- Inner Context Demo -->
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 class="text-2xl font-semibold text-white mb-4">
              Inner Context (Independent Mini-App)
            </h2>
            <p class="text-gray-300 mb-6">
              The component below has its own &lt;ssgoi&gt; with independent
              transition config. It should slide left/right without affecting
              the outer page.
            </p>

            <!-- Nested ssgoi directive -->
            <div ssgoi [config]="innerConfig">
              <div
                class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
              >
                <!-- Mini Browser Controls -->
                <div
                  class="bg-gray-900 px-4 py-3 border-b border-gray-700 flex gap-2"
                >
                  <button
                    (click)="navigate('page1')"
                    [class.bg-orange-500]="currentPage() === 'page1'"
                    [class.text-white]="currentPage() === 'page1'"
                    [class.bg-gray-700]="currentPage() !== 'page1'"
                    [class.text-gray-300]="currentPage() !== 'page1'"
                    class="px-4 py-2 rounded-md transition-colors hover:bg-orange-600"
                  >
                    Inner Page 1
                  </button>
                  <button
                    (click)="navigate('page2')"
                    [class.bg-orange-500]="currentPage() === 'page2'"
                    [class.text-white]="currentPage() === 'page2'"
                    [class.bg-gray-700]="currentPage() !== 'page2'"
                    [class.text-gray-300]="currentPage() !== 'page2'"
                    class="px-4 py-2 rounded-md transition-colors hover:bg-orange-600"
                  >
                    Inner Page 2
                  </button>
                </div>

                <!-- Mini Browser Content -->
                <div
                  class="relative bg-gray-800"
                  style="min-height: 300px; position: relative"
                >
                  @for (page of [currentPage()]; track page) {
                    @if (page === 'page1') {
                      <div ssgoiTransition="/inner/page1">
                        <div
                          class="p-8 bg-gradient-to-br from-blue-900 to-blue-800"
                          style="min-height: 300px"
                        >
                          <h3 class="text-3xl font-bold text-white mb-4">
                            Inner Page 1
                          </h3>
                          <p class="text-blue-100 text-lg">
                            This should <strong>slide left</strong> when
                            navigating to Page 2
                          </p>
                          <div class="mt-6 bg-blue-950 rounded-lg p-4">
                            <p class="text-blue-200 text-sm">
                              Check console for "🔵 Inner Context:" logs
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                    @if (page === 'page2') {
                      <div ssgoiTransition="/inner/page2">
                        <div
                          class="p-8 bg-gradient-to-br from-purple-900 to-purple-800"
                          style="min-height: 300px"
                        >
                          <h3 class="text-3xl font-bold text-white mb-4">
                            Inner Page 2
                          </h3>
                          <p class="text-purple-100 text-lg">
                            This should <strong>slide right</strong> when
                            navigating to Page 1
                          </p>
                          <div class="mt-6 bg-purple-950 rounded-lg p-4">
                            <p class="text-purple-200 text-sm">
                              Independent context means this doesn't affect
                              outer page transitions
                            </p>
                          </div>
                        </div>
                      </div>
                    }
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Expected Behavior -->
          <div class="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 class="text-2xl font-semibold text-white mb-4">
              Expected Behavior:
            </h2>
            <ul class="space-y-2 text-gray-300">
              <li class="flex items-start">
                <svg
                  class="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Inner pages should slide left/right when switching
              </li>
              <li class="flex items-start">
                <svg
                  class="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Console should show "🔵 Inner Context:" logs for inner
                transitions
              </li>
              <li class="flex items-start">
                <svg
                  class="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Outer page transitions should not affect inner pages
              </li>
              <li class="flex items-start">
                <svg
                  class="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Each context should be independent (separate pendingTransition
                states)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NestedDemoComponent {
  innerConfig: SsgoiConfig = {
    transitions: [
      {
        from: '/inner/page1',
        to: '/inner/page2',
        transition: slide({ direction: 'left' }),
        symmetric: true,
      },
    ],
    middleware(from, to) {
      console.log('🔵 Inner Context:', { from, to });
      return { from, to };
    },
  };

  currentPage = signal<'page1' | 'page2'>('page1');

  navigate(page: 'page1' | 'page2') {
    console.log('Navigating to:', page);
    this.currentPage.set(page);
  }
}
