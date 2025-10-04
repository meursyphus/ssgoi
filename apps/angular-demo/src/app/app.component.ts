import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ssgoi } from '@ssgoi/angular';
import { fade, hero, jaemin } from '@ssgoi/angular/view-transitions';
import type { SsgoiConfig } from '@ssgoi/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Ssgoi],
  template: `
    <ssgoi [config]="ssgoiConfig">
      <div style="position: relative; min-height: 100vh; width: 100%">
        <router-outlet />
      </div>
    </ssgoi>
  `,
  styles: [],
})
export class AppComponent {
  ssgoiConfig: SsgoiConfig = {
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
