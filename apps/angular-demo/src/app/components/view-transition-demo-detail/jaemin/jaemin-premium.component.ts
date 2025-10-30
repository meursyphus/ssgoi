import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jaemin-premium',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-12',
  },
  template: `
    <div class="text-center mb-12">
      <div class="inline-block p-3 bg-indigo-500/10 rounded-full mb-4">
        <span class="text-indigo-400 text-sm font-semibold">PREMIUM</span>
      </div>
      <h1 class="text-2xl md:text-4xl font-bold text-white mb-4">
        Cosmic Explorer
      </h1>
      <h2 class="text-lg md:text-xl text-indigo-300 mb-4">
        Premium Membership
      </h2>
      <p class="text-gray-300 max-w-2xl mx-auto">
        Access exclusive star maps, advanced telescope controls, and
        personalized constellation guides.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      @for (feature of features; track $index) {
        <div
          class="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-lg backdrop-blur border border-indigo-500/20"
        >
          <div class="text-3xl mb-3">{{ feature.icon }}</div>
          <h3 class="text-lg font-semibold text-white mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-gray-300 text-sm">{{ feature.description }}</p>
        </div>
      }
    </div>

    <div class="text-center">
      <button
        class="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all text-lg font-semibold"
      >
        Upgrade Now
      </button>
    </div>
  `,
})
export class JaeminPremiumComponent {
  navigate = output<string>();

  features = [
    {
      icon: '🔭',
      title: 'Advanced Telescope',
      description: 'Professional-grade virtual telescope with 360° view',
    },
    {
      icon: '⭐',
      title: 'Star Catalog',
      description: 'Complete database of 100,000+ celestial objects',
    },
    {
      icon: '🌌',
      title: 'Deep Space',
      description: 'Explore galaxies, nebulae, and cosmic phenomena',
    },
  ];
}
