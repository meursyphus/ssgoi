import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-blind-demo-theater',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ssgoiTransition="/blind" class="h-full">
      <div
        class="h-full bg-gradient-to-br from-gray-900 via-red-950 to-gray-900"
      >
        <div
          class="mx-auto flex flex-col items-center justify-center h-full max-w-6xl px-4 py-12"
        >
          <div class="text-center space-y-6">
            <div class="inline-block p-3 bg-red-500/10 rounded-full mb-4">
              <span class="text-red-400 text-sm font-semibold">
                NOW SHOWING
              </span>
            </div>
            <h1 class="text-5xl sm:text-7xl font-bold text-white">
              <span
                class="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent"
              >
                blind
              </span>
            </h1>
            <p class="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
              Experience dramatic transitions that create anticipation and focus
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                class="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Watch Demo
              </button>
              <button
                class="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>

          <div class="mt-20 grid grid-cols-3 gap-8 text-center">
            <div>
              <div class="text-4xl mb-2">🎭</div>
              <p class="text-gray-400 text-sm">Theater Mode</p>
            </div>
            <div>
              <div class="text-4xl mb-2">🎬</div>
              <p class="text-gray-400 text-sm">Cinematic Feel</p>
            </div>
            <div>
              <div class="text-4xl mb-2">✨</div>
              <p class="text-gray-400 text-sm">Dramatic Effect</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BlindDemoTheaterComponent {}
