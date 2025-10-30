import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-jaemin-settings',
  imports: [CommonModule, SsgoiTransition],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      ssgoiTransition="/jaemin/settings"
      class="bg-gradient-to-br from-slate-900 to-gray-900 min-h-full"
    >
      <div class="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-12">
        <h1 class="text-2xl md:text-4xl font-bold text-white mb-8">Settings</h1>

        <div class="space-y-8">
          @for (section of sections; track $index) {
            <div>
              <h2 class="text-xl font-semibold text-gray-200 mb-4">
                {{ section.title }}
              </h2>
              <div class="space-y-3">
                @for (item of section.items; track item.title) {
                  <div
                    class="bg-gray-800/50 p-4 rounded-lg backdrop-blur border border-gray-700/50 hover:border-gray-600/50 transition-colors cursor-pointer"
                  >
                    <div class="flex items-center gap-4">
                      <div class="text-2xl">{{ item.icon }}</div>
                      <div class="flex-1">
                        <h3 class="text-white font-medium mb-1">
                          {{ item.title }}
                        </h3>
                        <p class="text-gray-400 text-sm">
                          {{ item.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class JaeminSettingsComponent {
  navigate = output<string>();

  sections = [
    {
      title: 'Account',
      items: [
        {
          icon: '👤',
          title: 'Profile',
          description: 'Manage your account information',
        },
        {
          icon: '🔒',
          title: 'Privacy',
          description: 'Control your privacy settings',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: '🌙',
          title: 'Dark Mode',
          description: 'Toggle dark/light theme',
        },
        {
          icon: '🔔',
          title: 'Notifications',
          description: 'Manage notification preferences',
        },
      ],
    },
  ];
}
