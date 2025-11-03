import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ssgoi, SsgoiConfig, SsgoiTransition } from '@ssgoi/angular';
import { scroll } from '@ssgoi/angular/view-transitions';

@Component({
  selector: 'app-transitions',
  imports: [RouterOutlet],
  template: `
    <div class="flex min-h-screen bg-gray-950 text-gray-100">
      <!-- Right Demo Area -->
      <main class="flex-1 p-8">
        <div class="max-w-4xl mx-auto">
          <div class="space-y-6">
            <router-outlet />
          </div>
        </div>
      </main>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransitionsComponent {
  config: SsgoiConfig = {
    defaultTransition: scroll(),
  };
}
