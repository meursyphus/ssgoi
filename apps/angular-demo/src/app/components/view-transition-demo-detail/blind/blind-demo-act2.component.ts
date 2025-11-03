import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-blind-demo-act2',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900',
  },
  template: `
    <div class="mx-auto max-w-4xl px-4 py-12 h-full overflow-y-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4">Act II: The Reveal</h1>
        <p class="text-gray-300 text-lg">
          Building tension before the grand reveal
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
          <div class="text-4xl mb-4">🎪</div>
          <h3 class="text-xl font-semibold text-white mb-3">
            Stage Performance
          </h3>
          <p class="text-gray-400">
            Like a theater blind, the transition creates a clear separation
            between scenes, perfect for storytelling experiences.
          </p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
          <div class="text-4xl mb-4">🎯</div>
          <h3 class="text-xl font-semibold text-white mb-3">Focus Attention</h3>
          <p class="text-gray-400">
            The sequential blind animation naturally draws the user's eye,
            creating anticipation for what's coming next.
          </p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
          <div class="text-4xl mb-4">⏱️</div>
          <h3 class="text-xl font-semibold text-white mb-3">Timing Control</h3>
          <p class="text-gray-400">
            Fine-tune the speed and stagger of each blind to create the perfect
            dramatic timing for your content.
          </p>
        </div>

        <div class="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
          <div class="text-4xl mb-4">🎨</div>
          <h3 class="text-xl font-semibold text-white mb-3">Visual Impact</h3>
          <p class="text-gray-400">
            The blind effect adds a premium, polished feel to transitions,
            elevating the perceived quality of your application.
          </p>
        </div>
      </div>

      <div
        class="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-center"
      >
        <h3 class="text-2xl font-bold text-white mb-3">
          Create Your Own Drama
        </h3>
        <p class="text-gray-100 mb-6">
          Transform ordinary page transitions into memorable experiences
        </p>
        <button
          class="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Get Started with blind
        </button>
      </div>
    </div>
  `,
})
export class BlindDemoAct2Component {}
