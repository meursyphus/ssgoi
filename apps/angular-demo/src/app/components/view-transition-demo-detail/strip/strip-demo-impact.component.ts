import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strip-demo-impact',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'mx-auto flex flex-col justify-center min-h-full relative px-8 py-20',
  },
  template: `
    <div class="space-y-16">
      <div>
        <p
          class="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-4"
        >
          Make a Difference
        </p>
        <h1
          class="font-black text-[7rem] text-gray-900 leading-none tracking-tight"
        >
          IMPACT
        </h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="border-l-4 border-orange-500 pl-6">
          <h3 class="text-gray-900 font-bold text-2xl mb-2">100M+</h3>
          <p class="text-gray-600">Lives Changed</p>
        </div>
        <div class="border-l-4 border-orange-500 pl-6">
          <h3 class="text-gray-900 font-bold text-2xl mb-2">50+</h3>
          <p class="text-gray-600">Countries Reached</p>
        </div>
        <div class="border-l-4 border-orange-500 pl-6">
          <h3 class="text-gray-900 font-bold text-2xl mb-2">∞</h3>
          <p class="text-gray-600">Possibilities</p>
        </div>
      </div>

      <div class="absolute bottom-8 right-8 block">
        <div
          class="w-32 h-32 rounded-full bg-orange-400 opacity-20 blur-3xl"
        ></div>
      </div>
    </div>
  `,
})
export class StripDemoImpactComponent {}
