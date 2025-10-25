import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BlindRoute {
  path: string;
  label: string;
}

@Component({
  selector: 'app-blind-layout',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-full">
      <!-- Theater Header -->
      <header class="bg-gray-900 border-b border-gray-700 flex-shrink-0">
        <div class="max-w-6xl mx-auto px-3 md:px-4">
          <div class="flex items-center justify-between h-14">
            <div class="flex items-center gap-2 md:gap-4">
              <h1
                class="text-base md:text-xl font-bold text-white flex items-center gap-2"
              >
                <span class="text-xl md:text-2xl">{{ logo() }}</span>
                <span class="hidden sm:inline">{{ title() }}</span>
              </h1>
              <nav class="flex items-center gap-1">
                @for (route of routes(); track route.path) {
                  <button
                    (click)="onNavigate(route.path)"
                    [class]="getButtonClass(route.path)"
                  >
                    {{ route.label }}
                  </button>
                }
              </nav>
            </div>
            <div class="hidden md:flex items-center gap-4">
              <span class="text-gray-400 text-sm">{{ headerText() }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content with Theater Theme -->
      <main class="flex-1 overflow-auto relative z-0 bg-gray-900">
        <ng-content />
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class BlindLayoutComponent {
  logo = input<string>('🎭');
  title = input<string>('Theater');
  headerText = input<string>('blind Transition');
  routes = input.required<BlindRoute[]>();
  currentPath = input.required<string>();
  navigate = output<string>();

  onNavigate(path: string) {
    this.navigate.emit(path);
  }

  getButtonClass(path: string): string {
    const isActive = this.currentPath() === path;
    const baseClass =
      'px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded-md font-medium transition-all';

    if (isActive) {
      return `${baseClass} bg-red-900/50 text-white border border-red-700`;
    }

    return `${baseClass} text-gray-300 hover:bg-gray-800 hover:text-white`;
  }
}
