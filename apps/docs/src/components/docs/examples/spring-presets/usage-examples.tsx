import { CodeTabs } from '../code-tabs';

export function ViewTransitionPresets() {
  return (
    <CodeTabs
      react={`import { Ssgoi } from '@ssgoi/react';
import { config } from '@ssgoi/react/presets';
import { fade } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: fade({ spring: config.gentle }),
  transitions: [
    {
      from: '/home',
      to: '/about',
      transition: slide({ spring: config.wobbly })
    }
  ]
};`}
      svelte={`<script>
  import { Ssgoi } from '@ssgoi/svelte';
  import { config } from '@ssgoi/svelte/presets';
  import { fade, slide } from '@ssgoi/svelte/view-transitions';

  const config = {
    defaultTransition: fade({ spring: config.gentle }),
    transitions: [
      {
        from: '/home',
        to: '/about',
        transition: slide({ spring: config.wobbly })
      }
    ]
  };
</script>

<Ssgoi {config}>
  <slot />
</Ssgoi>`}
    />
  );
}

export function ElementTransitionPresets() {
  return (
    <CodeTabs
      react={`import { transition } from '@ssgoi/react';
import { config } from '@ssgoi/react/presets';

const fadeIn = transition({
  spring: config.slow,
  tick: (progress) => ({
    opacity: progress,
    transform: \`translateY(\${(1 - progress) * 20}px)\`
  })
});`}
      svelte={`<script>
  import { transition } from '@ssgoi/svelte';
  import { config } from '@ssgoi/svelte/presets';

  const fadeIn = {
    spring: config.slow,
    tick: (progress) => ({
      opacity: progress,
      transform: \`translateY(\${(1 - progress) * 20}px)\`
    })
  };
</script>

<div use:transition={{ key: 'fade-in', ...fadeIn }}>
  컨텐츠
</div>`}
    />
  );
}