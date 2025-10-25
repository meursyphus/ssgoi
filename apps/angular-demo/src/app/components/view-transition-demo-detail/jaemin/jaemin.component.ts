import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Ssgoi } from '@ssgoi/angular';
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

// Main Jaemin Demo Component
@Component({
  selector: 'app-jaemin-demo',
  imports: [
    BrowserMockupComponent,
    JaeminLayoutComponent,
    Ssgoi,
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
        @for (page of [currentPath()]; track page) {
          @switch (page) {
            @case ('/jaemin') {
              <app-jaemin-home />
            }
            @case ('/jaemin/premium') {
              <app-jaemin-premium />
            }
            @case ('/jaemin/achievement') {
              <app-jaemin-achievement />
            }
            @case ('/jaemin/settings') {
              <app-jaemin-settings />
            }
          }
        }
      </app-jaemin-layout>
    </app-browser-mockup>
  `,
})
export class JaeminDemoComponent {
  currentPath = signal('/jaemin');
  readonly routes: JaeminRoute[] = [
    { path: '/jaemin', label: 'Home' },
    { path: '/jaemin/premium', label: 'Premium' },
    { path: '/jaemin/achievement', label: 'Achievement' },
    { path: '/jaemin/settings', label: 'Settings' },
  ];
  readonly ssgoiConfig = {
    transitions: [
      // Use jaemin transition for all special pages (excluding settings)
      {
        from: '/jaemin',
        to: '/jaemin/premium',
        transition: jaemin({ containerMode: 'positioned-parent' } as any),
        symmetric: true,
      },
      {
        from: '/jaemin',
        to: '/jaemin/achievement',
        transition: jaemin({ containerMode: 'positioned-parent' } as any),
        symmetric: true,
      },
      {
        from: '/jaemin/premium',
        to: '/jaemin/achievement',
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
