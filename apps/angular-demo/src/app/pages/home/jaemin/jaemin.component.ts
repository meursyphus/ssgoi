import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-jaemin',
  imports: [RouterLink, SsgoiTransition],
  host: {
    class: 'black relative min-h-screen w-full',
  },
  template: `
    <div
      ssgoiTransition="/jaemin"
      class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-300 text-white p-8"
    >
      <!-- Header Section -->
      <div class="text-center mb-16 max-w-3xl mx-auto">
        <h1
          class="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-pink-200 to-indigo-200 bg-clip-text text-transparent"
        >
          Jaemin Transition
        </h1>
        <p class="text-xl mb-8 opacity-90 leading-relaxed">
          Experience dramatic tunnel emergence with three-phase animation
          timing. This page demonstrates the transition performance with complex
          layouts and extensive content.
        </p>
        <div
          class="inline-block bg-white/20 px-8 py-4 rounded-full border border-white/20"
        >
          Created by Jaemin ✨
        </div>
      </div>

      <!-- Animation Phases -->
      <div class="max-w-6xl mx-auto mb-16">
        <h2 class="text-4xl text-center mb-12">Animation Phases</h2>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
          @for (feature of features; track feature.title) {
            <div
              class="bg-white/20 p-8 rounded-2xl border border-white/20 transition-transform duration-300 hover:-translate-y-1"
            >
              <div class="text-5xl mb-4">{{ feature.icon }}</div>
              <h3 class="text-2xl font-semibold mb-4">{{ feature.title }}</h3>
              <p class="mb-4 opacity-90 leading-normal">
                {{ feature.description }}
              </p>
              <p class="text-sm opacity-70 italic">{{ feature.details }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Technical Specifications -->
      <div class="max-w-6xl mx-auto mb-16">
        <h2 class="text-4xl text-center mb-12">Technical Specifications</h2>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          @for (spec of technicalSpecs; track spec.label) {
            <div class="bg-black/20 p-6 rounded-xl border border-white/10">
              <div class="text-sm opacity-70 mb-2">{{ spec.label }}</div>
              <div class="text-lg font-semibold mb-2">{{ spec.value }}</div>
              <div class="text-xs opacity-80">{{ spec.description }}</div>
            </div>
          }
        </div>
      </div>

      <!-- Performance Test Section -->
      <div class="max-w-6xl mx-auto mb-16">
        <h2 class="text-4xl text-center mb-12">Performance Testing</h2>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
          @for (item of performanceComponents; track item) {
            <div
              class="p-8 rounded-2xl text-white relative overflow-hidden"
              [style.background]="
                'linear-gradient(135deg, hsl(' +
                (item * 60 + 200) +
                ', 70%, 60%), hsl(' +
                (item * 60 + 260) +
                ', 70%, 60%))'
              "
            >
              <div
                class="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
              ></div>
              <div class="relative z-10">
                <h3 class="text-xl mb-4">Test Component {{ item + 1 }}</h3>
                <p class="mb-4 opacity-90">
                  This component tests transition performance with gradient
                  backgrounds, multiple layers, and complex visual effects.
                </p>
                <div class="flex gap-2 flex-wrap">
                  @for (tag of tags; track tag) {
                    <span class="px-3 py-1 bg-white/20 rounded-full text-xs">{{
                      tag
                    }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Long Content Section -->
      <div class="max-w-6xl mx-auto mb-16">
        <h2 class="text-4xl text-center mb-12">Extensive Content Test</h2>
        @for (item of contentBlocks; track item) {
          <div class="mb-12 bg-white/20 p-8 rounded-2xl border border-white/20">
            <h3 class="text-3xl mb-4 text-pink-200">
              Content Block {{ item + 1 }}
            </h3>
            <p class="mb-6 leading-relaxed opacity-90">
              This is extensive content designed to test the Jaemin transition
              with complex layouts. The transition maintains smooth 60fps
              performance even with multiple DOM elements, gradients, backdrop
              filters, and nested components. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>
            <div
              class="h-[150px] rounded-lg flex items-center justify-center text-xl font-semibold mb-4"
              [style.background]="
                'linear-gradient(45deg, hsl(' +
                (item * 40 + 180) +
                ', 70%, 50%), hsl(' +
                (item * 40 + 240) +
                ', 70%, 50%))'
              "
            >
              Visual Element {{ item + 1 }}
            </div>
            <p class="text-sm opacity-80">
              Additional content to increase page complexity and DOM element
              count. The Jaemin transition handles this extensive content
              smoothly.
            </p>
          </div>
        }
      </div>

      <!-- Footer -->
      <div
        class="text-center mt-16 p-12 bg-black/30 rounded-3xl border border-white/10 max-w-2xl mx-auto"
      >
        <h2 class="text-3xl mb-4">Performance Test Complete ✅</h2>
        <p class="mb-8 opacity-90 leading-relaxed">
          This page demonstrates the Jaemin transition working smoothly with
          extensive content, multiple visual effects, and complex DOM
          structures.
        </p>
        <a
          routerLink="/"
          class="bg-white/20 text-white px-8 py-4 rounded-xl no-underline border-2 border-white/30 transition-all duration-300 text-lg font-semibold inline-block hover:bg-white/30 hover:-translate-y-1"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JaeminComponent {
  features = [
    {
      icon: '🔥',
      title: 'Entry Phase (0-5%)',
      description:
        'Page emerges from tiny dot with 45° rotation. The element starts at scale 0.01 and maintains full rotation angle.',
      details:
        'This phase creates the initial "portal" effect where the new page appears to emerge from a single point in space.',
    },
    {
      icon: '📈',
      title: 'Trans Phase (5-80%)',
      description:
        'Ultra-slow scaling growth using nonic easing curve. The page gradually grows while maintaining rotation.',
      details:
        'This extended phase allows users to perceive the transition and builds anticipation for the final reveal.',
    },
    {
      icon: '⚡',
      title: 'Emergence Phase (80-100%)',
      description:
        'Final dramatic expansion with glow effects, border radius changes, and rotation completion.',
      details:
        'The climactic phase where all visual effects combine to create a dramatic reveal of the final page.',
    },
  ];

  technicalSpecs = [
    {
      label: 'Spring Physics',
      value: 'stiffness: 50, damping: 30',
      description: 'Carefully tuned for cinematic timing',
    },
    {
      label: 'Initial Rotation',
      value: '45 degrees',
      description: 'Optimized angle for visual impact',
    },
    {
      label: 'Scale Range',
      value: '0.01 → 1.0',
      description: '100x scaling for dramatic effect',
    },
    {
      label: 'Performance',
      value: '60fps on modern devices',
      description: 'CSS transforms for optimal performance',
    },
  ];

  contentBlocks = Array.from({ length: 5 }, (_, i) => i);
  performanceComponents = Array.from({ length: 6 }, (_, i) => i);
  tags = ['CSS', 'Transform', 'Gradient', 'Blur'];
}
