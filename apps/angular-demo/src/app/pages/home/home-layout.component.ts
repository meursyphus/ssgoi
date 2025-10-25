import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ssgoi, SsgoiConfig } from '@ssgoi/angular';
import { fade, hero, jaemin } from '@ssgoi/angular/view-transitions';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Ssgoi],
  template: `
    <div
      ssgoi
      [config]="ssgoiConfig"
      class="black relative min-h-screen w-full"
    >
      <router-outlet />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLayoutComponent {
  ssgoiConfig: SsgoiConfig = {
    middleware(from, to) {
      // Skip transition if navigating to the same path
      if (from === to) {
        return { from: '', to: '' };
      }

      return { from, to };
    },
    transitions: [
      {
        from: '/',
        to: '/item/*',
        transition: hero({ spring: { stiffness: 5, damping: 1 } }),
        symmetric: true,
      },
      {
        from: '/',
        to: '/jaemin',
        transition: jaemin(),
      },
      {
        from: '/jaemin',
        to: '/',
        transition: fade(),
      },
    ],
  };
}
