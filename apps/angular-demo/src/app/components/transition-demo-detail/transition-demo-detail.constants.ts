export type TransitionType =
  | 'fade'
  | 'scale'
  | 'blur'
  | 'slide'
  | 'fly'
  | 'rotate'
  | 'bounce'
  | 'mask';

export interface DemoInfo {
  name: string;
  description: string;
  typescript: string;
  html: string;
  usage: string;
}

export const demoInfoMap: Record<string, DemoInfo> = {
  fade: {
    name: 'Fade Transition',
    description:
      'A simple opacity-based transition for mounting/unmounting elements.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { fade } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => fade());

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Perfect for subtle appearance/disappearance of UI elements.',
  },
  scale: {
    name: 'Scale Transition',
    description: 'Scale elements from/to a specified size with axis control.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { scale } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => scale({
    start: 0,
    opacity: 0,
    axis: 'both'
  }));

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Great for emphasizing elements or creating zoom-in/out effects.',
  },
  blur: {
    name: 'Blur Transition',
    description: 'Combines blur filter with opacity for a modern effect.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { blur } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => blur({
    amount: 10,
    opacity: 0
  }));

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Modern effect for modals, overlays, and focus transitions.',
  },
  slide: {
    name: 'Slide Transition',
    description: 'Slide elements from any direction with distance control.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { slide } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => slide({
    direction: 'left',
    distance: 100,
    fade: true
  }));

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Classic transition for sidebars, drawers, and notifications.',
  },
  fly: {
    name: 'Fly Transition',
    description: 'Fly elements in from custom x/y coordinates.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { fly } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => fly({
    x: 0,
    y: -100,
    opacity: 0
  }));

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Flexible transition for any directional movement needs.',
  },
  rotate: {
    name: 'Rotate Transition',
    description: 'Rotate elements with 2D or 3D axis control.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { rotate } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => rotate({
    degrees: 360,
    axis: '2d',
    clockwise: true,
    fade: true
  }));

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Adds flair to icons, cards, or attention-grabbing elements.',
  },
  bounce: {
    name: 'Bounce Transition',
    description: 'Bouncing animation with configurable height and bounces.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { bounce } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => bounce({
    height: 20,
    bounces: 3,
    fade: true
  }));

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Playful animation for notifications and success messages.',
  },
  mask: {
    name: 'Mask Transition',
    description: 'Reveal elements using circular, elliptical, or square masks.',
    typescript: `import { Component, signal, computed } from '@angular/core';
import { TransitionDirective } from '@ssgoi/angular';
import { mask } from '@ssgoi/angular/transitions';

@Component({
  selector: 'app-example',
  imports: [TransitionDirective],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  isVisible = signal(true);
  transitionConfig = computed(() => mask({
    shape: 'circle',
    origin: 'center',
    scale: 1.5
  }));

  toggleVisibility() {
    this.isVisible.update(v => !v);
  }
}`,
    html: `@if (isVisible()) {
  <div [transition]="transitionConfig()">
    Content
  </div>
}

<button (click)="toggleVisibility()">
  {{ isVisible() ? 'Hide' : 'Show' }}
</button>`,
    usage: 'Unique reveal effect for images and creative presentations.',
  },
};
