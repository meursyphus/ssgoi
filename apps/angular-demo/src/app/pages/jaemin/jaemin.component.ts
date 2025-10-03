import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SsgoiTransition } from '@ssgoi/angular';

@Component({
  selector: 'app-jaemin',
  imports: [RouterLink, SsgoiTransition],
  templateUrl: './jaemin.component.html',
  styleUrl: './jaemin.component.css',
})
export class JaeminComponent {
  features = [
    {
      icon: '🔥',
      title: 'Entry Phase (0-5%)',
      description:
        'Page emerges from tiny dot with 45° rotation. The element starts at scale 0.01 and maintains full rotation angle.',
      details:
        'This phase creates the initial "portal" effect where the new page appears to emerge from a single point in space.',
    },
    {
      icon: '📈',
      title: 'Trans Phase (5-80%)',
      description:
        'Ultra-slow scaling growth using nonic easing curve. The page gradually grows while maintaining rotation.',
      details:
        'This extended phase allows users to perceive the transition and builds anticipation for the final reveal.',
    },
    {
      icon: '⚡',
      title: 'Emergence Phase (80-100%)',
      description:
        'Final dramatic expansion with glow effects, border radius changes, and rotation completion.',
      details:
        'The climactic phase where all visual effects combine to create a dramatic reveal of the final page.',
    },
  ];

  technicalSpecs = [
    {
      label: 'Spring Physics',
      value: 'stiffness: 50, damping: 30',
      description: 'Carefully tuned for cinematic timing',
    },
    {
      label: 'Initial Rotation',
      value: '45 degrees',
      description: 'Optimized angle for visual impact',
    },
    {
      label: 'Scale Range',
      value: '0.01 → 1.0',
      description: '100x scaling for dramatic effect',
    },
    {
      label: 'Performance',
      value: '60fps on modern devices',
      description: 'CSS transforms for optimal performance',
    },
  ];

  contentBlocks = Array.from({ length: 5 }, (_, i) => i);
  performanceComponents = Array.from({ length: 6 }, (_, i) => i);
  tags = ['CSS', 'Transform', 'Gradient', 'Blur'];
}
