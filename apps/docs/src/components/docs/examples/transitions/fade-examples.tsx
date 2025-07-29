import { CodeTabs } from '../code-tabs';

export function FadeBasic() {
  return (
    <CodeTabs
      react={`import { transition } from '@ssgoi/react';
import { fade } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fade-element', ...fade() })}>
          페이드 애니메이션이 적용된 요소
        </div>
      )}
    </div>
  );
}`}
      svelte={`<script>
  import { transition } from '@ssgoi/svelte';
  import { fade } from '@ssgoi/svelte/transitions';
  
  let isVisible = true;
</script>

{#if isVisible}
  <div use:transition={{ key: 'fade-element', ...fade() }}>
    페이드 애니메이션이 적용된 요소
  </div>
{/if}`}
    />
  );
}

export function PartialFade() {
  return (
    <CodeTabs
      react={`const partialFade = fade({
  from: 0.2,  // 20% 투명도에서 시작
  to: 0.8,    // 80% 투명도로 종료
  spring: { stiffness: 300, damping: 30 }
});

<div ref={transition({ key: 'partial-fade', ...partialFade })}>
  부분 페이드 효과
</div>`}
      svelte={`<script>
  import { transition } from '@ssgoi/svelte';
  import { fade } from '@ssgoi/svelte/transitions';
  
  const partialFade = fade({
    from: 0.2,  // 20% 투명도에서 시작
    to: 0.8,    // 80% 투명도로 종료
    spring: { stiffness: 300, damping: 30 }
  });
</script>

<div use:transition={{ key: 'partial-fade', ...partialFade }}>
  부분 페이드 효과
</div>`}
    />
  );
}

export function SlowFade() {
  return (
    <CodeTabs
      react={`const slowFade = fade({
  spring: { 
    stiffness: 100,  // 낮은 강도
    damping: 20      // 낮은 감쇠
  }
});

<div ref={transition({ key: 'slow-fade', ...slowFade })}>
  느린 페이드 효과
</div>`}
      svelte={`<script>
  import { transition } from '@ssgoi/svelte';
  import { fade } from '@ssgoi/svelte/transitions';
  
  const slowFade = fade({
    spring: { 
      stiffness: 100,  // 낮은 강도
      damping: 20      // 낮은 감쇠
    }
  });
</script>

<div use:transition={{ key: 'slow-fade', ...slowFade }}>
  느린 페이드 효과
</div>`}
    />
  );
}

export function FastFade() {
  return (
    <CodeTabs
      react={`const fastFade = fade({
  spring: { 
    stiffness: 500,  // 높은 강도
    damping: 40      // 높은 감쇠
  }
});

<div ref={transition({ key: 'fast-fade', ...fastFade })}>
  빠른 페이드 효과
</div>`}
      svelte={`<script>
  import { transition } from '@ssgoi/svelte';
  import { fade } from '@ssgoi/svelte/transitions';
  
  const fastFade = fade({
    spring: { 
      stiffness: 500,  // 높은 강도
      damping: 40      // 높은 감쇠
    }
  });
</script>

<div use:transition={{ key: 'fast-fade', ...fastFade }}>
  빠른 페이드 효과
</div>`}
    />
  );
}

export function FadeAndScale() {
  return (
    <CodeTabs
      react={`// 커스텀 조합 애니메이션
const fadeAndScale = {
  in: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = \`scale(\${0.8 + progress * 0.2})\`;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = \`scale(\${0.8 + progress * 0.2})\`;
    }
  })
};`}
      svelte={`<script>
  // 커스텀 조합 애니메이션
  const fadeAndScale = {
    in: (element) => ({
      spring: { stiffness: 300, damping: 30 },
      tick: (progress) => {
        element.style.opacity = progress.toString();
        element.style.transform = \`scale(\${0.8 + progress * 0.2})\`;
      }
    }),
    out: (element) => ({
      spring: { stiffness: 300, damping: 30 },
      tick: (progress) => {
        element.style.opacity = progress.toString();
        element.style.transform = \`scale(\${0.8 + progress * 0.2})\`;
      }
    })
  };
</script>`}
    />
  );
}

export function AccessibleFade() {
  return (
    <CodeTabs
      react={`<div 
  ref={transition({ key: 'accessible-fade', ...fade() })}
  role="status"
  aria-live="polite"
>
  스크린 리더에 알림이 전달되는 페이드 요소
</div>`}
      svelte={`<div 
  use:transition={{ key: 'accessible-fade', ...fade() }}
  role="status"
  aria-live="polite"
>
  스크린 리더에 알림이 전달되는 페이드 요소
</div>`}
    />
  );
}