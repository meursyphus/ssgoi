import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SsgoiTransition, TransitionDirective } from '@ssgoi/angular';
import { fade } from '@ssgoi/angular/transitions';
import { slow } from '@ssgoi/angular/presets';

interface ColorItem {
  id: number;
  color: string;
  name: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, SsgoiTransition, TransitionDirective],
  host: {
    class: 'black relative min-h-screen w-full',
  },
  template: `
    <div ssgoiTransition="/">
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold mb-2 tracking-tight text-gray-900">
            SSGOI Angular Demo
          </h1>
          <p class="text-lg text-gray-600 mb-0">
            Native app-like transitions for Angular applications
          </p>
        </div>

        <!-- Hero Transition Section -->
        <div class="bg-white rounded-2xl p-12 shadow-sm mb-12">
          <h2 class="text-2xl font-semibold mb-8 text-center text-gray-900">
            Hero Transition Example
          </h2>
          <div
            class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 mt-8"
          >
            @for (item of colors; track item.id) {
              <a
                [routerLink]="['/item', item.id]"
                class="aspect-square flex items-center justify-center rounded-xl cursor-pointer no-underline relative overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                [style.backgroundColor]="item.color"
                [attr.data-hero-key]="'color-' + item.id"
              >
                <span
                  class="text-white text-lg font-semibold [text-shadow:0_2px_4px_rgba(0,0,0,0.2)]"
                >
                  {{ item.name }}
                </span>
              </a>
            }
          </div>

          <!-- Jaemin Transition Demo -->
          <div class="mt-8">
            <h3 class="text-2xl mb-4 text-gray-900">Jaemin Transition</h3>
            <a
              routerLink="/jaemin"
              class="inline-block bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg no-underline font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              🔥 Demo Tunnel Emergence Animation
            </a>
          </div>
        </div>

        <!-- Controls Section -->
        <div class="bg-white rounded-2xl p-8 shadow-sm mb-12">
          <div class="flex gap-12 items-center justify-center flex-wrap">
            <div class="flex gap-3">
              <button
                class="px-5 py-2.5 border-2 border-gray-200 rounded-lg bg-white cursor-pointer text-sm font-medium transition-all duration-200 text-gray-900 hover:border-indigo-500 hover:text-indigo-500 hover:-translate-y-px"
                [class.!bg-indigo-500]="stiffness() === 100"
                [class.!border-indigo-500]="stiffness() === 100"
                [class.!text-white]="stiffness() === 100"
                (click)="setSpeed(100, 20)"
              >
                Smooth
              </button>
              <button
                class="px-5 py-2.5 border-2 border-gray-200 rounded-lg bg-white cursor-pointer text-sm font-medium transition-all duration-200 text-gray-900 hover:border-indigo-500 hover:text-indigo-500 hover:-translate-y-px"
                [class.!bg-indigo-500]="stiffness() === 300"
                [class.!border-indigo-500]="stiffness() === 300"
                [class.!text-white]="stiffness() === 300"
                (click)="setSpeed(300, 30)"
              >
                Normal
              </button>
              <button
                class="px-5 py-2.5 border-2 border-gray-200 rounded-lg bg-white cursor-pointer text-sm font-medium transition-all duration-200 text-gray-900 hover:border-indigo-500 hover:text-indigo-500 hover:-translate-y-px"
                [class.!bg-indigo-500]="stiffness() === 500"
                [class.!border-indigo-500]="stiffness() === 500"
                [class.!text-white]="stiffness() === 500"
                (click)="setSpeed(500, 40)"
              >
                Fast
              </button>
            </div>

            <div class="flex flex-col gap-2 items-center">
              <label class="text-sm text-gray-600 font-medium">Stiffness</label>
              <input
                type="number"
                class="w-20 px-3 py-1.5 border-2 border-gray-200 rounded-md text-center text-sm transition-colors focus:outline-none focus:border-indigo-500"
                [value]="stiffness()"
                (input)="stiffness.set(+$any($event.target).value)"
                min="1"
                max="1000"
              />
              <span class="text-xs text-gray-400">(1-1000)</span>
            </div>

            <div class="flex flex-col gap-2 items-center">
              <label class="text-sm text-gray-600 font-medium">Damping</label>
              <input
                type="number"
                class="w-20 px-3 py-1.5 border-2 border-gray-200 rounded-md text-center text-sm transition-colors focus:outline-none focus:border-indigo-500"
                [value]="damping()"
                (input)="damping.set(+$any($event.target).value)"
                min="0"
                max="100"
              />
              <span class="text-xs text-gray-400">(0-100)</span>
            </div>
          </div>
        </div>

        <div class="text-center mb-16">
          <button
            (click)="toggleShapes()"
            class="px-10 py-3.5 text-base bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 rounded-xl cursor-pointer font-medium transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)]"
          >
            {{ showShapes() ? 'Hide Elements' : 'Show Elements' }}
          </button>
        </div>

        <div class="mb-20">
          <h2 class="text-2xl font-semibold mb-8 text-center text-gray-900">
            DOM Transition
          </h2>
          <div
            class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12 p-8"
          >
            <!-- Fade -->
            <div
              class="flex flex-col items-center gap-4 bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                class="w-[120px] h-[120px] flex items-center justify-center relative"
              >
                @if (showShapes()) {
                  <div
                    [transition]="{
                      in: fadeTransition,
                      out: fadeTransition,
                    }"
                    class="w-20 h-20 relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"
                  ></div>
                }
              </div>
              <p class="text-base font-medium text-gray-600 m-0">Fade</p>
            </div>

            <!-- Slow Fade -->
            <div
              class="flex flex-col items-center gap-4 bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                class="w-[120px] h-[120px] flex items-center justify-center relative"
              >
                @if (showShapes()) {
                  <div
                    id="my-element"
                    [transition]="fade"
                    class="w-20 h-20 relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"
                  ></div>
                }
              </div>
              <p class="text-base font-medium text-gray-600 m-0">Fade(Slow)</p>
            </div>

            <!-- Scale + Rotate -->
            <div
              class="flex flex-col items-center gap-4 bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                class="w-[120px] h-[120px] flex items-center justify-center relative"
              >
                @if (showShapes()) {
                  <div
                    [transition]="{
                      key: 'scale-rotate',
                      in: scaleRotateTransition,
                      out: scaleRotateTransition,
                    }"
                    class="w-0 h-0 relative border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-teal-400"
                  ></div>
                }
              </div>
              <p class="text-base font-medium text-gray-600 m-0">
                Scale + Rotate
              </p>
            </div>

            <!-- Slide In -->
            <div
              class="flex flex-col items-center gap-4 bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                class="w-[120px] h-[120px] flex items-center justify-center relative"
              >
                @if (showShapes()) {
                  <div
                    [transition]="{
                      key: 'slide',
                      in: slideTransition,
                      out: slideTransition,
                    }"
                    class="w-20 h-20 relative bg-gradient-to-br from-pink-400 to-yellow-300 rounded-lg"
                  ></div>
                }
              </div>
              <p class="text-base font-medium text-gray-600 m-0">Slide In</p>
            </div>

            <!-- Bounce Scale -->
            <div
              class="flex flex-col items-center gap-4 bg-white rounded-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                class="w-[120px] h-[120px] flex items-center justify-center relative"
              >
                @if (showShapes()) {
                  <div
                    [transition]="{
                      key: 'bounce-scale',
                      in: bounceScaleTransitionIn,
                      out: bounceScaleTransitionOut,
                    }"
                    class="relative w-20 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-t-[30px] border-t-pink-300 before:content-[''] before:absolute before:top-[-70px] before:left-[-40px] before:w-0 before:h-0 before:border-l-[40px] before:border-l-transparent before:border-r-[40px] before:border-r-transparent before:border-b-[40px] before:border-b-pink-300"
                  ></div>
                }
              </div>
              <p class="text-base font-medium text-gray-600 m-0">
                Bounce Scale
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  colors: ColorItem[] = [
    { id: 1, color: '#FF6B6B', name: 'Coral' },
    { id: 2, color: '#4ECDC4', name: 'Turquoise' },
    { id: 3, color: '#45B7D1', name: 'Sky Blue' },
    { id: 4, color: '#96CEB4', name: 'Sage' },
    { id: 5, color: '#FECA57', name: 'Sunflower' },
    { id: 6, color: '#DDA0DD', name: 'Plum' },
  ];

  showShapes = signal(true);
  stiffness = signal(300);
  damping = signal(30);

  setSpeed(newStiffness: number, newDamping: number) {
    this.stiffness.set(newStiffness);
    this.damping.set(newDamping);
  }

  toggleShapes() {
    this.showShapes.update((v) => !v);
  }

  // Transition for fade effect
  fadeTransition = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      element.style.opacity = progress.toString();
    },
  });

  fade = {
    key: 'my-element',
    ...fade({
      spring: slow,
    }),
  };

  // Transition for scale + rotate
  scaleRotateTransition = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
      element.style.opacity = progress.toString();
    },
  });

  // Transition for slide
  slideTransition = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      element.style.transform = `translateX(${(1 - progress) * -100}px)`;
      element.style.opacity = progress.toString();
    },
  });

  // Transition for bounce scale (in)
  bounceScaleTransitionIn = (element: HTMLElement) => ({
    spring: {
      stiffness: this.stiffness() * 0.8,
      damping: this.damping() * 0.7,
    },
    tick: (progress: number) => {
      const scale = 0.5 + progress * 0.5;
      element.style.transform = `scale(${scale})`;
      element.style.opacity = progress.toString();
    },
  });

  // Transition for bounce scale (out)
  bounceScaleTransitionOut = (element: HTMLElement) => ({
    spring: { stiffness: this.stiffness(), damping: this.damping() },
    tick: (progress: number) => {
      const scale = 0.5 + progress * 0.5;
      element.style.transform = `scale(${scale})`;
      element.style.opacity = progress.toString();
    },
  });

  onJaeminButtonHover(event: MouseEvent, isEnter: boolean) {
    const target = event.currentTarget as HTMLElement;
    if (isEnter) {
      target.style.transform = 'translateY(-2px)';
    } else {
      target.style.transform = 'translateY(0)';
    }
  }
}
