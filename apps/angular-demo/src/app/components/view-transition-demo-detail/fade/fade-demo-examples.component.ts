import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-fade-demo-examples',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'max-w-6xl mx-auto px-4 py-12',
  },
  template: `
    <h1 class="text-4xl font-bold text-white mb-8">Examples</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      @for (example of examples; track example.title) {
        <div
          class="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
        >
          <div
            class="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-5xl"
          >
            {{ example.icon }}
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-white mb-2">
              {{ example.title }}
            </h3>
            <p class="text-gray-400 mb-4">{{ example.description }}</p>
            <div class="flex flex-wrap gap-2">
              @for (transition of example.transitions; track transition) {
                <span
                  class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                >
                  {{ transition }}()
                </span>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class FadeDemoExamplesComponent {
  examples = [
    {
      title: 'E-Commerce',
      description: 'Product gallery with smooth transitions',
      icon: '🛍️',
      transitions: ['scale', 'hero', 'fade'],
    },
    {
      title: 'Dashboard',
      description: 'Analytics with slide transitions',
      icon: '📊',
      transitions: ['slide', 'fade'],
    },
    {
      title: 'Blog',
      description: 'Article navigation with fade effects',
      icon: '📝',
      transitions: ['fade', 'slide'],
    },
    {
      title: 'Portfolio',
      description: 'Image gallery with pinterest effect',
      icon: '🎨',
      transitions: ['pinterest', 'hero', 'scale'],
    },
  ];
}
