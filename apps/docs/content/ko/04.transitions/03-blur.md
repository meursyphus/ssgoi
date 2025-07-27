---
title: "블러 애니메이션"
description: "블러 효과로 요소를 부드럽게 포커스하거나 흐리게 만듭니다"
nav-title: "블러"
---

# 블러 애니메이션

블러(Blur) 애니메이션은 요소에 흐림 효과를 적용하여 포커스를 전환하거나 배경을 부드럽게 처리할 때 사용합니다. 시각적 깊이감과 우아한 전환 효과를 제공합니다.

## 기본 사용법

```tsx
import { transition } from '@ssgoi/react';
import { blur } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'blur-element', ...blur() })}>
          블러 애니메이션이 적용된 요소
        </div>
      )}
    </div>
  );
}
```

## 옵션

```typescript
interface BlurOptions {
  amount?: number | string;  // 블러 강도 (기본값: 10)
  opacity?: number;          // 시작 투명도 (기본값: 0)
  scale?: boolean;           // 스케일 효과 추가 (기본값: false)
  fade?: boolean;            // 페이드 효과 추가 (기본값: true)
  spring?: {
    stiffness?: number;      // 스프링 강도 (기본값: 300)
    damping?: number;        // 감쇠 계수 (기본값: 30)
  };
}
```

### 옵션 설명

- **amount**: 블러의 강도 (픽셀 단위 또는 CSS 값)
- **opacity**: 시작 투명도 (0-1)
- **scale**: 블러와 함께 스케일 효과 적용 여부
- **fade**: 블러와 함께 페이드 효과 적용 여부
- **spring**: 스프링 물리 설정

## 사용 예시

### 강한 블러 효과

```tsx
const heavyBlur = blur({
  amount: 20,  // 강한 블러
  spring: { stiffness: 200, damping: 25 }
});

<div ref={transition({ key: 'heavy-blur', ...heavyBlur })}>
  강하게 흐려지는 요소
</div>
```

### 블러 + 스케일 조합

```tsx
const blurScale = blur({
  amount: 15,
  scale: true,  // 스케일 효과 추가
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'blur-scale', ...blurScale })}>
  흐려지면서 축소되는 효과
</div>
```

### 블러만 (페이드 없이)

```tsx
const blurOnly = blur({
  fade: false,     // 페이드 효과 제거
  opacity: 1,      // 완전 불투명 상태 유지
  amount: '2rem'   // rem 단위 사용
});

<div ref={transition({ key: 'blur-only', ...blurOnly })}>
  투명도 변화 없이 블러만 적용
</div>
```

## 실용적인 활용 예시

### 배경 블러 효과

```tsx
function BlurredBackground() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* 배경 콘텐츠 */}
      <div className="p-8">
        <h1>메인 콘텐츠</h1>
        <button onClick={() => setIsModalOpen(true)}>
          모달 열기
        </button>
      </div>
      
      {/* 블러 오버레이 */}
      {isModalOpen && (
        <div 
          ref={transition({ 
            key: 'blur-overlay', 
            ...blur({ amount: 8, opacity: 0.5 }) 
          })}
          className="fixed inset-0 bg-black/20"
          onClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
```

### 이미지 로딩 효과

```tsx
function BlurredImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative">
      {/* 플레이스홀더 */}
      {!isLoaded && (
        <div 
          ref={transition({ 
            key: 'image-placeholder', 
            ...blur({ amount: 20 }) 
          })}
          className="absolute inset-0 bg-gray-200"
        />
      )}
      
      {/* 실제 이미지 */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'opacity-100' : 'opacity-0'}
      />
    </div>
  );
}
```

### 포커스 전환 효과

```tsx
function FocusableCards() {
  const [focusedId, setFocusedId] = useState(null);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(id => (
        <div
          key={id}
          onClick={() => setFocusedId(id)}
          className="relative cursor-pointer"
        >
          {/* 블러 효과 */}
          {focusedId && focusedId !== id && (
            <div 
              ref={transition({ 
                key: `blur-${id}`, 
                ...blur({ amount: 5, opacity: 0.7 }) 
              })}
              className="absolute inset-0 z-10"
            />
          )}
          
          {/* 카드 내용 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3>카드 {id}</h3>
            <p>클릭하여 포커스</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 고급 활용

### 동적 블러 강도

```tsx
function DynamicBlur() {
  const [blurAmount, setBlurAmount] = useState(10);
  
  const dynamicBlur = blur({
    amount: blurAmount,
    spring: { stiffness: 300, damping: 30 }
  });
  
  return (
    <div>
      <input
        type="range"
        min="0"
        max="30"
        value={blurAmount}
        onChange={(e) => setBlurAmount(Number(e.target.value))}
      />
      
      <div ref={transition({ key: `blur-${blurAmount}`, ...dynamicBlur })}>
        블러 강도: {blurAmount}px
      </div>
    </div>
  );
}
```

### 텍스트 스포일러

```tsx
function Spoiler({ children }) {
  const [isRevealed, setIsRevealed] = useState(false);
  
  return (
    <span 
      className="relative inline-block cursor-pointer"
      onClick={() => setIsRevealed(!isRevealed)}
    >
      {!isRevealed && (
        <span 
          ref={transition({ 
            key: 'spoiler-blur', 
            ...blur({ amount: 8, fade: false }) 
          })}
          className="absolute inset-0"
        />
      )}
      <span className={!isRevealed ? 'select-none' : ''}>
        {children}
      </span>
    </span>
  );
}
```

## 성능 고려사항

- 블러 효과는 GPU 가속을 사용하지만 다른 효과보다 연산이 많습니다
- 큰 영역이나 많은 요소에 동시 적용 시 성능 저하 가능
- 모바일 기기에서는 블러 강도를 낮추는 것을 권장

### 성능 최적화 팁

```tsx
// 모바일 대응
const isMobile = window.innerWidth < 768;
const optimizedBlur = blur({
  amount: isMobile ? 5 : 15,  // 모바일에서 블러 강도 감소
  spring: { 
    stiffness: isMobile ? 400 : 300,  // 모바일에서 빠른 애니메이션
    damping: 35 
  }
});
```

## 브라우저 호환성

- 모든 모던 브라우저에서 지원
- Safari에서는 `-webkit-backdrop-filter` 필요할 수 있음
- IE11은 CSS 필터를 지원하지 않음

## 권장 사용 사례

- **모달/다이얼로그**: 배경 콘텐츠 흐리기
- **이미지 로딩**: 플레이스홀더에서 실제 이미지로 전환
- **포커스 효과**: 중요한 요소 강조
- **스포일러 텍스트**: 클릭 전 내용 숨기기
- **깊이감 표현**: UI 레이어 구분