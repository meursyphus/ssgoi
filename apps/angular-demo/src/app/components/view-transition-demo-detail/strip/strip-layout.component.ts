import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoRouteConfig } from '../shared/browser-mockup.component';

@Component({
  selector: 'app-strip-layout',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'flex flex-col h-full relative bg-gradient-to-br from-orange-50 to-pink-50',
  },
  template: `
    <!-- Fixed Header -->
    <header
      class="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200/50"
    >
      <div class="mx-auto max-w-7xl px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <!-- Logo -->
            <button
              (click)="onNavigate(routes()[0].path)"
              class="font-black text-2xl text-orange-500 hover:text-orange-600 transition-colors"
            >
              CYD
            </button>

            <!-- Navigation -->
            <nav class="flex items-center gap-6">
              @for (route of routes(); track route.path) {
                @if (route.path) {
                  <button
                    (click)="onNavigate(route.path)"
                    [class.text-orange-500]="currentPath() === route.path"
                    [class.border-b-2]="currentPath() === route.path"
                    [class.border-orange-500]="currentPath() === route.path"
                    [class.pb-1]="currentPath() === route.path"
                    [class.text-gray-600]="currentPath() !== route.path"
                    [class.hover:text-gray-900]="currentPath() !== route.path"
                    class="font-semibold text-sm uppercase tracking-wider transition-all"
                  >
                    {{ route.label }}
                  </button>
                }
              }
            </nav>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-scroll overflow-x-hidden relative z-0">
      <ng-content />
    </main>
  `,
})
export class StripLayoutComponent {
  routes = input.required<DemoRouteConfig[]>();
  currentPath = input.required<string>();
  navigate = output<string>();

  onNavigate(path: string) {
    this.navigate.emit(path);
  }
}
