---
title: "페이드 애니메이션"
description: "부드러운 페이드 인/아웃 효과로 요소를 애니메이션합니다"
nav-title: "페이드"
---

# 페이드 애니메이션

페이드(Fade) 애니메이션은 요소의 투명도를 조절하여 부드럽게 나타나거나 사라지는 효과를 만듭니다. 가장 기본적이면서도 널리 사용되는 애니메이션입니다.

## 기본 사용법

```tsx
import { transition } from '@ssgoi/react';
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
}
```

## 옵션

```typescript
interface FadeOptions {
  from?: number;    // 시작 투명도 (기본값: 0)
  to?: number;      // 종료 투명도 (기본값: 1)
  spring?: {
    stiffness?: number;  // 스프링 강도 (기본값: 300)
    damping?: number;    // 감쇠 계수 (기본값: 30)
  };
}
```

### 옵션 설명

- **from**: 애니메이션 시작 시 투명도 값 (0-1)
- **to**: 애니메이션 종료 시 투명도 값 (0-1)
- **spring**: 스프링 물리 설정
  - `stiffness`: 값이 클수록 빠른 애니메이션
  - `damping`: 값이 클수록 부드러운 애니메이션

## 사용 예시

### 부분 페이드

반투명에서 시작하여 약간 투명한 상태로 끝나는 페이드:

```tsx
const partialFade = fade({
  from: 0.2,  // 20% 투명도에서 시작
  to: 0.8,    // 80% 투명도로 종료
  spring: { stiffness: 300, damping: 30 }
});

<div ref={transition({ key: 'partial-fade', ...partialFade })}>
  부분 페이드 효과
</div>
```

### 느린 페이드

천천히 부드럽게 나타나는 효과:

```tsx
const slowFade = fade({
  spring: { 
    stiffness: 100,  // 낮은 강도
    damping: 20      // 낮은 감쇠
  }
});

<div ref={transition({ key: 'slow-fade', ...slowFade })}>
  느린 페이드 효과
</div>
```

### 빠른 페이드

빠르게 나타나는 효과:

```tsx
const fastFade = fade({
  spring: { 
    stiffness: 500,  // 높은 강도
    damping: 40      // 높은 감쇠
  }
});

<div ref={transition({ key: 'fast-fade', ...fastFade })}>
  빠른 페이드 효과
</div>
```

## 다른 애니메이션과 조합

페이드는 다른 애니메이션과 함께 사용하면 더욱 풍부한 효과를 만들 수 있습니다:

```tsx
// 커스텀 조합 애니메이션
const fadeAndScale = {
  in: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  })
};
```

## 성능 고려사항

- 페이드는 GPU 가속을 활용하여 성능이 우수합니다
- `opacity` 변경은 리플로우를 발생시키지 않아 효율적입니다
- 많은 요소에 동시에 적용해도 부드러운 애니메이션을 유지합니다

## 접근성

페이드 애니메이션 사용 시 접근성을 고려하세요:

```tsx
<div 
  ref={transition({ key: 'accessible-fade', ...fade() })}
  role="status"
  aria-live="polite"
>
  스크린 리더에 알림이 전달되는 페이드 요소
</div>
```

## 권장 사용 사례

- **알림 메시지**: 사용자에게 피드백을 제공할 때
- **모달/팝업**: 오버레이 표시/숨김
- **이미지 갤러리**: 이미지 전환 효과
- **로딩 상태**: 콘텐츠 로딩 표시
- **툴팁**: 호버 시 정보 표시