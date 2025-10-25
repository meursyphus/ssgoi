import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-jaemin-achievement',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      ssgoiTransition="/jaemin/achievement"
      class="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 min-h-full"
    >
      <div class="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-12 text-center">
        <div class="mb-8">
          <div class="inline-block p-3 bg-emerald-500/10 rounded-full mb-4">
            <span class="text-emerald-400 text-sm font-semibold"
              >ACHIEVEMENT UNLOCKED</span
            >
          </div>
          <div class="text-6xl mb-4">🏆</div>
          <h1 class="text-2xl md:text-4xl font-bold text-white mb-2">
            Stellar Navigator
          </h1>
          <h2 class="text-lg md:text-xl text-emerald-300 mb-4">
            Congratulations!
          </h2>
          <p class="text-gray-300 max-w-2xl mx-auto">
            You've successfully identified 100 constellations and earned the
            prestigious Stellar Navigator badge.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-12">
          @for (stat of stats; track $index) {
            <div
              class="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20"
            >
              <div class="text-2xl font-bold text-emerald-400 mb-1">
                {{ stat.value }}
              </div>
              <div class="text-gray-400 text-sm">{{ stat.label }}</div>
            </div>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (reward of rewards; track $index) {
            <div
              class="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 rounded-lg backdrop-blur border border-emerald-500/20"
            >
              <div class="text-3xl mb-3">{{ reward.icon }}</div>
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ reward.title }}
              </h3>
              <p class="text-gray-300 text-sm">{{ reward.description }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class JaeminAchievementComponent {
  navigate = output<string>();

  stats = [
    { value: '100', label: 'Constellations' },
    { value: '50', label: 'Deep Sky Objects' },
    { value: '25', label: 'Planets Observed' },
  ];

  rewards = [
    {
      icon: '🏆',
      title: 'Navigator Badge',
      description: 'Exclusive badge for your profile',
    },
    {
      icon: '🎁',
      title: 'Premium Month',
      description: 'Free premium access for 30 days',
    },
    {
      icon: '⭐',
      title: 'Special Title',
      description: "Unlock the 'Stellar Navigator' title",
    },
  ];
}
