import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strip-demo-creating',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'mx-auto flex items-center justify-center min-h-full px-8 py-20 text-center',
  },
  template: `
    <div class="space-y-12">
      <div class="relative">
        <h1
          class="font-black text-[8rem] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 tracking-tight leading-none"
        >
          CREATING
        </h1>
        <div
          class="font-black absolute inset-0 blur-3xl opacity-30 text-[8rem] text-purple-600 tracking-tight leading-none"
        >
          CREATING
        </div>
      </div>

      <div class="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
        <div class="text-center">
          <div class="text-4xl mb-2">✨</div>
          <p class="text-gray-700 font-medium">Innovate</p>
        </div>
        <div class="text-center">
          <div class="text-4xl mb-2">🎯</div>
          <p class="text-gray-700 font-medium">Execute</p>
        </div>
        <div class="text-center">
          <div class="text-4xl mb-2">🚀</div>
          <p class="text-gray-700 font-medium">Launch</p>
        </div>
      </div>

      <p class="font-medium text-gray-700 max-w-xl mx-auto text-xl">
        Where imagination meets execution. Build something extraordinary today.
      </p>
    </div>
  `,
})
export class StripDemoCreatingComponent {}
