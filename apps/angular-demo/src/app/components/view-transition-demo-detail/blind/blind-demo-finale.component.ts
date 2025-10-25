import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-blind-demo-finale',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/blind/finale" class="h-full">
      <div
        class="h-full bg-gradient-to-br from-gray-900 via-yellow-950 to-gray-900"
      >
        <div class="mx-auto flex flex-col items-center justify-center h-full max-w-4xl px-4">
          <div class="text-center space-y-6">
            <h1 class="text-5xl sm:text-6xl font-bold text-white mb-6">
              <span class="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                The Grand Finale
              </span>
            </h1>

            <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Every great show deserves an unforgettable ending
            </p>

            <div class="space-y-4 max-w-xl mx-auto">
              <div class="bg-gray-800/50 backdrop-blur p-4 rounded-lg text-left">
                <code class="text-sm text-gray-300">
                  <span class="text-blue-400">import</span>
                  <span class="text-yellow-400"> {{ '{' }} blind {{ '}' }} </span>
                  <span class="text-blue-400">from</span>
                  <span class="text-green-400">
                    '@ssgoi/angular/view-transitions'
                  </span>;
                </code>
              </div>

              <div class="bg-gray-800/50 backdrop-blur p-4 rounded-lg text-left">
                <code class="text-sm text-gray-300 whitespace-pre">{{ configExample }}</code>
              </div>
            </div>

            <div class="pt-8">
              <div class="flex justify-center gap-8 mb-8">
                @for (emoji of emojis; track $index) {
                  <div
                    class="text-4xl animate-bounce"
                    [style.animation-delay]="$index * 0.1 + 's'"
                  >
                    {{ emoji }}
                  </div>
                }
              </div>

              <p class="text-gray-400 text-sm">
                Thank you for watching the blind Transition Demo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BlindDemoFinaleComponent {
  readonly emojis = ['🎭', '🎪', '🎨', '✨', '🎬'];
  readonly configExample = `const config = {
  defaultTransition: blind()
};`;
}
