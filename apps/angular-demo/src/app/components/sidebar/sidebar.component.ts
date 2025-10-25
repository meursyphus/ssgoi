import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { transitionDemos } from '../../pages/transitions/transitions.constants';
import { viewTransitionDemos } from '../../pages/view-transitions/view-transitions.constants';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto"
    >
      <div class="p-6">
        <h1 class="text-2xl font-bold text-blue-400 mb-8">SSGOI Angular</h1>

        <nav class="space-y-2">
          <a
            routerLink="/"
            routerLinkActive="bg-gray-700 text-blue-400"
            [routerLinkActiveOptions]="{ exact: true }"
            class="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
          >
            Home
          </a>

          <!-- Transitions with collapsible submenu -->
          <div>
            <button
              (click)="toggleTransitions()"
              class="w-full flex items-center justify-between px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
            >
              <span>Transitions</span>
              <svg
                class="w-4 h-4 transition-transform"
                [class.rotate-180]="transitionsExpanded()"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            @if (transitionsExpanded()) {
              <div class="mt-1 ml-4 space-y-1">
                @for (demo of transitionDemos; track demo.id) {
                  <a
                    [routerLink]="['/transitions', demo.id]"
                    routerLinkActive="bg-gray-700 text-blue-400"
                    class="block px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
                    [title]="demo.description"
                  >
                    {{ demo.name }}
                  </a>
                }
              </div>
            }
          </div>

          <!-- View Transitions with collapsible submenu -->
          <div>
            <button
              (click)="toggleViewTransitions()"
              class="w-full flex items-center justify-between px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
            >
              <span>View Transitions</span>
              <svg
                class="w-4 h-4 transition-transform"
                [class.rotate-180]="viewTransitionsExpanded()"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            @if (viewTransitionsExpanded()) {
              <div class="mt-1 ml-4 space-y-1">
                @for (demo of viewTransitionDemos; track demo.id) {
                  <a
                    [routerLink]="['/view-transitions', demo.id]"
                    routerLinkActive="bg-gray-700 text-blue-400"
                    class="block px-4 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
                    [title]="demo.description"
                  >
                    {{ demo.name }}
                  </a>
                }
              </div>
            }
          </div>

          <a
            routerLink="/nested-demo"
            routerLinkActive="bg-gray-700 text-blue-400"
            class="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
          >
            Nested Context
          </a>

          <a
            routerLink="/jaemin"
            routerLinkActive="bg-gray-700 text-blue-400"
            class="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
          >
            Jaemin
          </a>
        </nav>
      </div>
    </aside>
  `,
  styles: [],
})
export class SidebarComponent {
  transitionsExpanded = signal(false);
  viewTransitionsExpanded = signal(false);
  transitionDemos = transitionDemos;
  viewTransitionDemos = viewTransitionDemos;

  toggleTransitions() {
    this.transitionsExpanded.update((v) => !v);
  }

  toggleViewTransitions() {
    this.viewTransitionsExpanded.update((v) => !v);
  }
}
