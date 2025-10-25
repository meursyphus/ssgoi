import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoRouteConfig } from './browser-mockup.component';

export interface DemoRoute {
  path: string;
  label: string;
}

@Component({
  selector: 'app-demo-layout',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-full">
      <!-- Header -->
      <header class="bg-gray-800 border-b border-gray-700 flex-shrink-0">
        <div class="max-w-6xl mx-auto px-4">
          <div class="flex items-center justify-between h-14">
            <div class="flex items-center gap-4">
              <h1 class="text-xl font-bold text-white flex items-center gap-2">
                <span>{{ logo() }}</span>
                <span>{{ title() }}</span>
              </h1>
              <nav class="flex items-center gap-1">
                @for (route of routes(); track route.path) {
                  <button
                    (click)="onNavigate(route.path)"
                    [class.bg-gray-700]="currentPath() === route.path"
                    [class.text-white]="currentPath() === route.path"
                    [class.text-gray-300]="currentPath() !== route.path"
                    class="px-4 py-2 text-sm rounded-md font-medium hover:bg-gray-700 hover:text-white transition-all"
                  >
                    {{ route.label }}
                  </button>
                }
              </nav>
            </div>
            @if (showHeaderActions()) {
              <div class="flex items-center gap-4">
                <a
                  href="https://github.com/meursyphus/ssgoi"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-300 hover:text-white transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.npmjs.com/package/@ssgoi/angular"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-300 hover:text-white transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"
                    />
                  </svg>
                </a>
              </div>
            }
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto relative z-0">
        <ng-content />
      </main>
    </div>
  `,
})
export class DemoLayoutComponent {
  logo = input<string>('⚡');
  title = input<string>('SSGOI Demo');
  routes = input.required<DemoRouteConfig[]>();
  currentPath = input.required<string>();
  showHeaderActions = input<boolean>(true);
  navigate = output<string>();
  onNavigate(path: string) {
    this.navigate.emit(path);
  }
}
