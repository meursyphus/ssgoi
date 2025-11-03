import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jaemin-home',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-12 lg:py-20',
  },
  template: `
    <div class="text-center space-y-6">
      <div class="inline-block p-3 bg-purple-500/10 rounded-full mb-4">
        <span class="text-purple-400 text-sm font-semibold">WELCOME</span>
      </div>
      <h1 class="text-3xl md:text-5xl lg:text-7xl font-bold text-white">
        <span
          class="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
        >
          Stellar
        </span>
      </h1>
      <h2 class="text-lg md:text-2xl lg:text-3xl text-gray-200 font-semibold">
        Experience the Universe
      </h2>
      <p class="text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
        Discover cosmic wonders and explore the mysteries of space with our
        premium stargazing platform.
      </p>
      <div class="pt-8">
        <button
          class="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-lg font-semibold"
        >
          Start Journey
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
      @for (feature of features; track $index) {
        <div class="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
          <div class="text-4xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-lg font-semibold text-white mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-gray-400 text-sm">{{ feature.description }}</p>
        </div>
      }
    </div>
  `,
})
export class JaeminHomeComponent {
  navigate = output<string>();

  features = [
    {
      icon: '🌟',
      title: 'Premium Experience',
      description: 'Unlock exclusive content and premium features',
    },
    {
      icon: '🎯',
      title: 'Special Moments',
      description: 'Celebrate achievements with unique animations',
    },
    {
      icon: '🚀',
      title: 'Brand Identity',
      description: 'Express your unique personality and style',
    },
  ];
}
