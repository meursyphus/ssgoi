import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ScrollRoute {
  path: string;
  label: string;
}

@Component({
  selector: 'app-scroll-layout',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative bg-gray-900 h-full overflow-hidden',
  },
  template: `
    <!-- Toggle Button - Mobile only -->
    <button
      (click)="isSidebarOpen.set(!isSidebarOpen())"
      class="md:hidden absolute top-2 left-2 z-50 p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        @if (isSidebarOpen()) {
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        } @else {
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        }
      </svg>
    </button>

    <!-- Overlay for mobile when sidebar is open -->
    @if (isSidebarOpen()) {
      <div
        class="md:hidden absolute inset-0 bg-black bg-opacity-30 z-30"
        (click)="isSidebarOpen.set(false)"
      ></div>
    }

    <div class="flex h-full">
      <!-- Sidebar Navigation -->
      <nav
        [class]="
          (isSidebarOpen() ? 'translate-x-0' : '-translate-x-full') +
          ' md:translate-x-0 absolute md:relative top-0 left-0 h-full z-40 w-48 bg-gray-800 border-r border-gray-700 p-2 md:p-4 transform transition-transform duration-300 ease-in-out md:h-screen overflow-y-auto flex-shrink-0'
        "
      >
        <h3
          class="mb-3 text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider px-2"
        >
          Contents
        </h3>
        <ul class="space-y-0.5 md:space-y-1">
          @for (route of routes(); track route.path) {
            <li>
              <button
                (click)="handleNavigation(route.path)"
                [class]="
                  (currentPath() === route.path
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white') +
                  ' w-full rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-left text-xs md:text-sm transition-all'
                "
              >
                {{ route.label }}
              </button>
            </li>
          }
        </ul>
      </nav>

      <!-- Content Area -->
      <div class="flex-1 bg-gray-900 overflow-x-hidden overflow-y-hidden">
        <div class="md:ml-0 pt-10 md:pt-0 relative z-0 h-full overflow-hidden">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class ScrollLayoutComponent {
  routes = input.required<ScrollRoute[]>();
  navigate = output<string>();
  currentPath = input.required<string>();

  isSidebarOpen = signal<boolean>(false);

  handleNavigation(path: string) {
    this.navigate.emit(path);
    // Close sidebar on mobile after navigation
    this.isSidebarOpen.set(false);
  }
}
