import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strip-demo-speaking',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'mx-auto flex flex-col justify-center min-h-full max-w-6xl px-8 py-20',
  },
  template: `
    <div class="space-y-8">
      <h1
        class="font-black leading-none text-[10rem] text-orange-500 tracking-tight"
      >
        SPEAKING
      </h1>
      <p class="font-medium text-gray-700 text-2xl max-w-2xl">
        Transform your ideas into powerful narratives that captivate and
        inspire.
      </p>
      <div class="flex gap-4 pt-4">
        <button
          class="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
        >
          Start Now
        </button>
        <button
          class="px-6 py-3 bg-white text-orange-500 border-2 border-orange-500 rounded-full font-semibold hover:bg-orange-50 transition-colors"
        >
          Learn More
        </button>
      </div>
    </div>
  `,
})
export class StripDemoSpeakingComponent {}
