import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-fade-demo-features',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/fade/features">
      <div
        class="min-h-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 p-8"
      >
        <div class="max-w-4xl mx-auto px-4 py-12">
          <h1 class="text-4xl font-bold text-white mb-8">Features</h1>

          <div class="space-y-6">
            <div class="bg-gray-800 p-6 rounded-lg">
              <h2 class="text-xl font-semibold text-white mb-4">
                🎨 Built-in Transitions
              </h2>
              <p class="text-gray-300 mb-4">
                Choose from a variety of pre-built transitions or create your
                own.
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                @for (transition of transitions; track transition) {
                  <div
                    class="bg-gray-700 px-3 py-2 rounded text-center text-sm text-gray-300"
                  >
                    {{ transition }}()
                  </div>
                }
              </div>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <h2 class="text-xl font-semibold text-white mb-4">
                ⚙️ Route-based Config
              </h2>
              <p class="text-gray-300 mb-4">
                Define different transitions for different routes with wildcards
                support.
              </p>
              <pre
                class="bg-gray-900 p-4 rounded text-xs overflow-x-auto"
              ><code class="text-gray-300">{{ configExample }}</code></pre>
            </div>

            <div class="bg-gray-800 p-6 rounded-lg">
              <h2 class="text-xl font-semibold text-white mb-4">
                💾 State Persistence
              </h2>
              <p class="text-gray-300">
                Animation state persists during navigation, even with browser
                back/forward buttons. No jarring jumps or broken animations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FadeDemoFeaturesComponent {
  transitions = ['fade', 'slide', 'scale', 'hero', 'pinterest', 'ripple'];
  configExample = `{
  from: '/products',
  to: '/products/*',
  transition: scale()
}`;
}
