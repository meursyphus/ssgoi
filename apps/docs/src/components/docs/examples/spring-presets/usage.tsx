// 뷰 트랜지션에서 프리셋 사용
export const viewTransitionPresetsReact = `import { Ssgoi } from '@ssgoi/react';
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
};`;

export const viewTransitionPresetsSvelte = `<script>
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
</Ssgoi>`;

// 요소 트랜지션에서 프리셋 사용
export const elementTransitionPresetsReact = `import { transition } from '@ssgoi/react';
import { config } from '@ssgoi/react/presets';

const fadeIn = transition({
  spring: config.slow,
  tick: (progress) => ({
    opacity: progress,
    transform: \`translateY(\${(1 - progress) * 20}px)\`
  })
});`;

export const elementTransitionPresetsSvelte = `<script>
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
</div>`;