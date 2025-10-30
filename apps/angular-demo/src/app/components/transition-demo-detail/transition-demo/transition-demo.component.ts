import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransitionDirective } from '@ssgoi/angular';
import * as transitions from '@ssgoi/angular/transitions';
import { config as springPresets } from '@ssgoi/angular/presets';
import type { TransitionDirectiveConfig } from '@ssgoi/angular';
import {
  TransitionType,
  SpringPreset,
  transitionOptions,
} from './transition-demo.model';

@Component({
  selector: 'app-transition-demo',
  imports: [CommonModule, TransitionDirective],
  template: `
    <div
      class="w-full space-y-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800"
    >
      <!-- Preview Area -->
      <div
        class="relative flex justify-center items-center h-48 bg-gray-950/50 rounded-lg border border-gray-800"
      >
        @if (isVisible()) {
          <div
            [transition]="transitionConfig()"
            class="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-2xl flex items-center justify-center text-gray-900 font-bold text-xl"
          >
            SSGOI
          </div>
        }

        <!-- Toggle Button -->
        <button
          (click)="toggleVisibility()"
          [class]="
            'absolute bottom-4 px-6 py-2 font-medium rounded-lg transition-all transform hover:scale-105 ' +
            (isVisible()
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-orange-500 hover:bg-orange-600 text-white animate-pulse')
          "
        >
          {{ isVisible() ? 'Hide' : 'Show' }}
        </button>
      </div>

      <!-- Transition-specific Options -->
      @if (options().length > 0) {
        <div
          class="space-y-3 p-4 bg-gray-950/50 rounded-lg border border-gray-800"
        >
          <h3 class="text-sm font-semibold text-gray-400 mb-2">Options</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            @for (option of options(); track option.name) {
              <div class="space-y-1">
                <label class="text-xs text-gray-500 capitalize">
                  {{ formatOptionName(option.name) }}
                </label>

                @if (option.type === 'range') {
                  <div class="flex items-center gap-2">
                    <input
                      type="range"
                      [min]="option.min"
                      [max]="option.max"
                      [step]="option.step"
                      [value]="getOptionValue(option.name, option.default)"
                      (input)="updateRangeValue(option.name, $event)"
                      class="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <span class="text-xs text-gray-400 w-12 text-right">
                      {{ getOptionValue(option.name, option.default) }}
                    </span>
                  </div>
                }

                @if (option.type === 'select') {
                  <select
                    [value]="getOptionValue(option.name, option.default)"
                    (change)="updateSelectValue(option.name, $event)"
                    class="w-full px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md border border-gray-700 focus:border-orange-500 focus:outline-none"
                  >
                    @for (opt of option.options; track opt) {
                      <option [value]="opt">{{ opt }}</option>
                    }
                  </select>
                }

                @if (option.type === 'toggle') {
                  <button
                    (click)="toggleOption(option.name, option.default)"
                    [class]="
                      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors ' +
                      (getOptionValue(option.name, option.default)
                        ? 'bg-orange-500'
                        : 'bg-gray-700')
                    "
                  >
                    <span
                      [class]="
                        'inline-block h-3 w-3 transform rounded-full bg-white transition-transform ' +
                        (getOptionValue(option.name, option.default)
                          ? 'translate-x-5'
                          : 'translate-x-1')
                      "
                    ></span>
                  </button>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Spring Preset Controls -->
      <div class="flex gap-2 flex-wrap justify-center">
        @for (preset of presets; track preset) {
          <button
            (click)="setSpringPreset(preset)"
            [class]="
              'px-3 py-1.5 text-xs font-medium rounded-md transition-all ' +
              (springPreset() === preset
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300')
            "
          >
            {{ preset.charAt(0).toUpperCase() + preset.slice(1) }}
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    .bg-gradient-to-br {
      background: linear-gradient(to bottom right, var(--tw-gradient-stops));
    }
    .from-orange-500 {
      --tw-gradient-from: #f97316;
      --tw-gradient-stops:
        var(--tw-gradient-from), var(--tw-gradient-to, rgba(249, 115, 22, 0));
    }
    .to-orange-600 {
      --tw-gradient-to: #ea580c;
    }
    .shadow-2xl {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .shadow-lg {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .shadow-orange-500\\/25 {
      box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.25);
    }
    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionDemoComponent {
  type = input.required<TransitionType>();
  inputOptions = input<Record<string, unknown>>({});

  isVisible = signal(true);
  springPreset = signal<SpringPreset>('default');
  customOptions = signal<Record<string, unknown>>({});

  presets = Object.keys(springPresets) as SpringPreset[];

  options = computed(() => transitionOptions[this.type()] || []);

  constructor() {
    effect(() => {
      // By reading the type signal, we establish a dependency.
      // This effect will re-run whenever the transition type changes.
      this.type();

      // Reset custom options and spring preset to their defaults.
      this.customOptions.set({});
      this.springPreset.set('default');
      this.isVisible.set(true);
    });
  }

  transitionConfig = computed((): TransitionDirectiveConfig => {
    const transitionFn = transitions[this.type()];
    if (!transitionFn) {
      throw new Error(`Unknown transition type: ${this.type()}`);
    }

    const mergedOptions = {
      ...this.inputOptions(),
      ...this.customOptions(),
    };

    const result = transitionFn({
      ...mergedOptions,
      spring: springPresets[this.springPreset()],
    });

    return typeof result === 'function' ? { in: result, out: result } : result;
  });

  toggleVisibility(): void {
    this.isVisible.update((v) => !v);
  }

  setSpringPreset(preset: SpringPreset): void {
    this.springPreset.set(preset);
  }

  updateOption(name: string, value: unknown): void {
    this.customOptions.update((opts) => ({ ...opts, [name]: value }));
  }

  toggleOption(name: string, defaultValue: unknown): void {
    const currentValue = this.getOptionValue(name, defaultValue);
    this.updateOption(name, !currentValue);
  }

  getOptionValue(name: string, defaultValue: unknown): unknown {
    return this.customOptions()[name] ?? defaultValue;
  }

  formatOptionName(name: string): string {
    return name.replace(/([A-Z])/g, ' $1').trim();
  }

  updateRangeValue(name: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateOption(name, +target.value);
  }

  updateSelectValue(name: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.updateOption(name, target.value);
  }
}
