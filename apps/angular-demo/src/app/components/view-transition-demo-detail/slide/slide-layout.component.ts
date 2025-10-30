import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SlideRoute {
  path: string;
  label: string;
}

@Component({
  selector: 'app-slide-layout',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full bg-gray-100 p-4 md:p-6',
  },
  template: `
    <!-- App Container -->
    <div
      class="h-full max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden"
    >
      <!-- App Header -->
      <div class="bg-white px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-gray-900 text-lg md:text-xl font-bold">
              Shop Collection
            </h1>
            <p class="text-gray-500 text-xs md:text-sm mt-0.5">
              2024 Summer Collection
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <button class="p-2 text-gray-600 hover:text-gray-900">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button class="p-2 text-gray-600 hover:text-gray-900 relative">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Navigation inside the app -->
      <div class="bg-gray-50 border-b border-gray-200">
        <nav class="flex">
          <div class="flex w-full">
            @for (route of routes(); track route.path; let index = $index) {
              <div class="relative flex-1">
                <button
                  (click)="handleNavigation(route.path)"
                  [class]="
                    (currentPath() === route.path
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900') +
                    ' w-full py-3 md:py-3.5 text-sm md:text-base font-medium transition-colors duration-200'
                  "
                >
                  <span class="relative z-10">{{ route.label }}</span>
                </button>
                @if (currentPath() === route.path) {
                  <div
                    class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  ></div>
                }
              </div>
            }
          </div>
        </nav>
      </div>

      <!-- Content Area with relative positioning for transitions -->
      <div
        class="flex-1 overflow-hidden bg-gray-50"
        style="height: calc(100% - 140px)"
      >
        <div class="relative h-full z-0">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class SlideLayoutComponent {
  routes = input.required<SlideRoute[]>();
  navigate = output<string>();
  currentPath = input.required<string>();

  handleNavigation(path: string) {
    this.navigate.emit(path);
  }
}
