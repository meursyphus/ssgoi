import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-blind-demo-act1',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/blind/act1" class="h-full">
      <div
        class="h-full bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900"
      >
        <div class="mx-auto max-w-4xl px-4 py-12 h-full overflow-y-auto">
          <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-white mb-4">
              Act I: The Beginning
            </h1>
            <p class="text-gray-300 text-lg">
              When the blind rises, a new story unfolds
            </p>
          </div>

          <div class="space-y-8">
            <div class="bg-gray-800/50 backdrop-blur p-8 rounded-lg">
              <h2 class="text-2xl font-semibold text-white mb-4">
                🎯 Perfect For
              </h2>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-start gap-3">
                  <span class="text-green-400 mt-1">✓</span>
                  <span>
                    Onboarding flows where each step builds anticipation
                  </span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-green-400 mt-1">✓</span>
                  <span>Result reveals that need dramatic presentation</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-green-400 mt-1">✓</span>
                  <span
                    >Gallery or presentation modes with theatrical feel</span
                  >
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-green-400 mt-1">✓</span>
                  <span>Story-driven experiences and narratives</span>
                </li>
              </ul>
            </div>

            <div class="bg-gray-800/50 backdrop-blur p-8 rounded-lg">
              <h2 class="text-2xl font-semibold text-white mb-4">
                ⚙️ Customization Options
              </h2>
              <pre class="bg-gray-900 p-4 rounded overflow-x-auto">
                <code class="text-gray-300 text-sm">{{ configExample }}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BlindDemoAct1Component {
  readonly configExample = `blind({
  blindCount: 12,      // Number of blind strips
  direction: 'horizontal', // or 'vertical'
  staggerDelay: 30,    // Delay between each blind
  transitionDelay: 100 // Pause between out and in
})`;
}
