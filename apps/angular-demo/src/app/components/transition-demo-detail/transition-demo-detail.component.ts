import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SsgoiTransition } from '@ssgoi/angular';
import { CommonModule } from '@angular/common';
import { TransitionDemoComponent } from './transition-demo/transition-demo.component';
import {
  DemoInfo,
  demoInfoMap,
  TransitionType,
} from './transition-demo-detail.constants';

@Component({
  selector: 'app-transition-demo-detail',
  imports: [SsgoiTransition, CommonModule, TransitionDemoComponent],
  template: `
    <div
      [ssgoiTransition]="'/transitions/' + demoId()"
      class="min-h-screen bg-gray-950 text-gray-100 p-8"
    >
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-12">
          @if (demoInfo()) {
            <h1 class="text-5xl font-bold text-white mb-4">
              {{ demoInfo()!.name }}
            </h1>
            <p class="text-xl text-gray-400">
              {{ demoInfo()!.description }}
            </p>
          }
        </div>

        @if (demoInfo()) {
          <!-- Interactive Demo -->
          <div class="mb-12">
            <h2 class="text-2xl font-semibold text-white mb-4">
              Interactive Demo
            </h2>
            <app-transition-demo [type]="demoId()" />
          </div>

          <!-- Code Section -->
          <div class="mb-12">
            <h2 class="text-2xl font-semibold text-white mb-4">Basic Usage</h2>

            <!-- TypeScript Code -->
            <div class="mb-4">
              <div
                class="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
              >
                <div
                  class="bg-gray-800/50 px-4 py-2 border-b border-gray-700 flex items-center justify-between"
                >
                  <span class="text-gray-400 text-sm font-mono"
                    >example.component.ts</span
                  >
                  <button
                    (click)="copyTypeScript()"
                    class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors"
                  >
                    {{ copiedTypeScript() ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
                <pre
                  class="p-4 text-sm text-gray-300 overflow-x-auto"
                ><code>{{ demoInfo()!.typescript }}</code></pre>
              </div>
            </div>

            <!-- HTML Code -->
            <div>
              <div
                class="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
              >
                <div
                  class="bg-gray-800/50 px-4 py-2 border-b border-gray-700 flex items-center justify-between"
                >
                  <span class="text-gray-400 text-sm font-mono"
                    >example.component.html</span
                  >
                  <button
                    (click)="copyHtml()"
                    class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors"
                  >
                    {{ copiedHtml() ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
                <pre
                  class="p-4 text-sm text-gray-300 overflow-x-auto"
                ><code>{{ demoInfo()!.html }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Usage Section -->
          <div class="mb-12">
            <h2 class="text-2xl font-semibold text-white mb-4">When to Use</h2>
            <div class="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <p class="text-gray-300">{{ demoInfo()!.usage }}</p>
            </div>
          </div>
        }

        @if (!demoInfo()) {
          <div class="text-center text-gray-500 py-12">
            Demo not found: {{ demoId() }}
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionDemoDetailComponent {
  private params = toSignal(this.route.params);

  demoId = computed(() => {
    const params = this.params();
    return (params?.['id'] as TransitionType) || 'fade';
  });

  demoInfo = computed(() => {
    const id = this.demoId();
    return demoInfoMap[id] || null;
  });

  copiedTypeScript = signal(false);
  copiedHtml = signal(false);

  constructor(private route: ActivatedRoute) {}

  copyTypeScript() {
    const code = this.demoInfo()?.typescript;
    if (code) {
      navigator.clipboard.writeText(code);
      this.copiedTypeScript.set(true);
      setTimeout(() => this.copiedTypeScript.set(false), 2000);
    }
  }

  copyHtml() {
    const code = this.demoInfo()?.html;
    if (code) {
      navigator.clipboard.writeText(code);
      this.copiedHtml.set(true);
      setTimeout(() => this.copiedHtml.set(false), 2000);
    }
  }
}
