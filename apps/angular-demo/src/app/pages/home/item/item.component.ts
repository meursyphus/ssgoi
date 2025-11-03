import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SsgoiTransition } from '@ssgoi/angular';

interface ColorItem {
  id: number;
  color: string;
  name: string;
}

@Component({
  selector: 'app-item',
  imports: [RouterLink, SsgoiTransition],
  template: `
    @if (item(); as itemData) {
      <div [ssgoiTransition]="'/item/' + id()">
        <div
          class="min-h-screen flex flex-col items-center justify-center relative"
          [style.backgroundColor]="itemData.color"
          [attr.data-hero-key]="'color-' + itemData.id"
        >
          <a
            routerLink="/"
            class="absolute top-8 left-8 flex items-center gap-2 px-7 py-3.5 bg-white/90 backdrop-blur-md border-none rounded-[10px] text-gray-800 no-underline font-medium text-[0.95rem] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.1)] cursor-pointer hover:bg-white hover:-translate-x-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </a>

          <div
            class="text-center text-white flex flex-col items-center justify-center h-full"
          >
            <h1
              class="text-5xl font-bold mb-4 text-shadow-[0_4px_20px_rgba(0,0,0,0.3)] tracking-tight"
            >
              {{ itemData.name }}
            </h1>
            <p
              class="text-2xl opacity-90 font-mono bg-white/20 px-6 py-2 rounded-lg backdrop-blur-md inline-block"
            >
              {{ itemData.color }}
            </p>

            <div class="mt-8 flex gap-8 justify-center flex-wrap">
              <div
                class="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-xl min-w-[150px]"
              >
                <div class="text-sm opacity-80 mb-2">RGB</div>
                <div class="text-xl font-semibold">
                  {{ hexToRgb(itemData.color) }}
                </div>
              </div>
              <div
                class="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-xl min-w-[150px]"
              >
                <div class="text-sm opacity-80 mb-2">HSL</div>
                <div class="text-xl font-semibold">Coming soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div
        class="min-h-screen flex items-center justify-center text-gray-200 text-xl"
      >
        Item not found
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  private route = inject(ActivatedRoute);
  private params = toSignal(this.route.params);

  colors: ColorItem[] = [
    { id: 1, color: '#FF6B6B', name: 'Coral' },
    { id: 2, color: '#4ECDC4', name: 'Turquoise' },
    { id: 3, color: '#45B7D1', name: 'Sky Blue' },
    { id: 4, color: '#96CEB4', name: 'Sage' },
    { id: 5, color: '#FECA57', name: 'Sunflower' },
    { id: 6, color: '#DDA0DD', name: 'Plum' },
  ];

  id = computed(() => {
    const params = this.params();
    return Number(params?.['id']);
  });

  item = computed(() => {
    return this.colors.find((c) => c.id === this.id());
  });

  hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
}
