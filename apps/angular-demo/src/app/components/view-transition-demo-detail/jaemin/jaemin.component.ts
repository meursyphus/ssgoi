import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi, SsgoiTransition } from '@ssgoi/angular';
import { jaemin } from '@ssgoi/angular/view-transitions';
import { BrowserMockupComponent } from '../shared/browser-mockup.component';
import {
  JaeminLayoutComponent,
  type JaeminRoute,
} from './jaemin-layout.component';
import { JaeminHomeComponent } from './jaemin-home.component';
import { JaeminPremiumComponent } from './jaemin-premium.component';
import { JaeminAchievementComponent } from './jaemin-achievement.component';
import { JaeminSettingsComponent } from './jaemin-settings.component';

const JAEMIN_PATHS = {
  home: '/jaemin' as string,
  premium: '/jaemin/premium' as string,
  achievement: '/jaemin/achievement' as string,
  settings: '/jaemin/settings' as string,
} as const;

// Main Jaemin Demo Component
@Component({
  selector: 'app-jaemin-demo',
  imports: [
    BrowserMockupComponent,
    JaeminLayoutComponent,
    Ssgoi,
    SsgoiTransition,
    JaeminHomeComponent,
    JaeminPremiumComponent,
    JaeminAchievementComponent,
    JaeminSettingsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-browser-mockup [currentPath]="currentPath()">
      <app-jaemin-layout
        ssgoi
        [config]="ssgoiConfig"
        [routes]="routes"
        [currentPath]="currentPath()"
        (navigate)="onNavigate($event)"
      >
        @switch (currentPath()) {
          @case (paths.home) {
            <div
              [ssgoiTransition]="paths.home"
              class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-full"
            >
              <app-jaemin-home />
            </div>
          }
          @case (paths.premium) {
            <div
              [ssgoiTransition]="paths.premium"
              class="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 min-h-full"
            >
              <app-jaemin-premium />
            </div>
          }
          @case (paths.achievement) {
            <div
              [ssgoiTransition]="paths.achievement"
              class="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 min-h-full"
            >
              <app-jaemin-achievement />
            </div>
          }
          @case (paths.settings) {
            <app-jaemin-settings />
          }
        }
      </app-jaemin-layout>
    </app-browser-mockup>
  `,
})
export class JaeminDemoComponent {
  readonly paths = JAEMIN_PATHS;

  currentPath = signal(JAEMIN_PATHS.home);
  readonly routes: JaeminRoute[] = [
    { path: JAEMIN_PATHS.home, label: 'Home' },
    { path: JAEMIN_PATHS.premium, label: 'Premium' },
    { path: JAEMIN_PATHS.achievement, label: 'Achievement' },
    { path: JAEMIN_PATHS.settings, label: 'Settings' },
  ];
  readonly ssgoiConfig = {
    transitions: [
      // Use jaemin transition for all special pages (excluding settings)
      {
        from: JAEMIN_PATHS.home,
        to: JAEMIN_PATHS.premium,
        transition: jaemin({ containerMode: 'positioned-parent' } as any),
        symmetric: true,
      },
      {
        from: JAEMIN_PATHS.home,
        to: JAEMIN_PATHS.achievement,
        transition: jaemin({ containerMode: 'positioned-parent' } as any),
        symmetric: true,
      },
      {
        from: JAEMIN_PATHS.premium,
        to: JAEMIN_PATHS.achievement,
        transition: jaemin({ containerMode: 'positioned-parent' } as any),
        symmetric: true,
      },
      // Settings uses standard browser navigation (not special)
      // No transition defined = uses browser default navigation
    ],
  };

  onNavigate(path: string) {
    this.currentPath.set(path);
  }
}
