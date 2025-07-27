---
title: "슬라이드 애니메이션"
description: "요소를 특정 방향으로 슬라이드하여 동적인 이동 효과를 만듭니다"
nav-title: "슬라이드"
---

# 슬라이드 애니메이션

슬라이드(Slide) 애니메이션은 요소를 특정 방향에서 미끄러지듯이 나타나거나 사라지게 합니다. 방향성이 있는 전환이 필요할 때 효과적입니다.

## 기본 사용법

```tsx
import { transition } from '@ssgoi/react';
import { slide } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'slide-element', ...slide() })}>
          슬라이드 애니메이션이 적용된 요소
        </div>
      )}
    </div>
  );
}
```

## 옵션

```typescript
interface SlideOptions {
  direction?: 'left' | 'right' | 'up' | 'down';  // 슬라이드 방향 (기본값: 'left')
  distance?: number | string;   // 이동 거리 (기본값: 100)
  opacity?: number;            // 시작 투명도 (기본값: 0)
  fade?: boolean;              // 페이드 효과 추가 (기본값: true)
  axis?: 'x' | 'y';          // 이동 축 (direction 대체)
  spring?: {
    stiffness?: number;        // 스프링 강도 (기본값: 400)
    damping?: number;          // 감쇠 계수 (기본값: 35)
  };
}
```

### 옵션 설명

- **direction**: 슬라이드 방향
  - `'left'`: 왼쪽에서 등장
  - `'right'`: 오른쪽에서 등장
  - `'up'`: 위에서 등장
  - `'down'`: 아래에서 등장
- **distance**: 이동 거리 (픽셀 또는 CSS 단위)
- **opacity**: 시작 투명도 (0-1)
- **fade**: 슬라이드와 함께 페이드 효과 사용
- **axis**: 간단한 축 지정 ('x' 또는 'y')
- **spring**: 스프링 물리 설정

## 사용 예시

### 방향별 슬라이드

```tsx
// 왼쪽에서 슬라이드
const slideLeft = slide({ 
  direction: 'left' 
});

// 오른쪽에서 슬라이드
const slideRight = slide({ 
  direction: 'right' 
});

// 위에서 슬라이드
const slideUp = slide({ 
  direction: 'up' 
});

// 아래에서 슬라이드
const slideDown = slide({ 
  direction: 'down' 
});
```

### 거리 조절

```tsx
// 짧은 거리
const shortSlide = slide({
  direction: 'left',
  distance: 50  // 50px만 이동
});

// 긴 거리
const longSlide = slide({
  direction: 'right',
  distance: '100vw'  // 화면 너비만큼 이동
});

// rem 단위 사용
const remSlide = slide({
  direction: 'up',
  distance: '5rem'
});
```

### 페이드 없는 슬라이드

```tsx
const slideNoFade = slide({
  direction: 'left',
  fade: false,      // 페이드 효과 제거
  opacity: 1        // 완전 불투명 상태 유지
});
```

## 실용적인 활용 예시

### 사이드바 메뉴

```tsx
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* 사이드바 */}
          <div 
            ref={transition({ 
              key: 'sidebar', 
              ...slide({ 
                direction: 'left', 
                distance: 300,
                fade: false 
              }) 
            })}
            className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg z-50"
          >
            <nav className="p-4">
              <h2>메뉴</h2>
              {/* 메뉴 아이템들 */}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
```

### 알림 토스트

```tsx
function Toast({ message, isVisible }) {
  return (
    <>
      {isVisible && (
        <div 
          ref={transition({ 
            key: 'toast', 
            ...slide({ 
              direction: 'up', 
              distance: 100 
            }) 
          })}
          className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {message}
        </div>
      )}
    </>
  );
}
```

### 탭 콘텐츠 전환

```tsx
function TabContent({ activeTab }) {
  const getSlideDirection = (tab) => {
    const tabs = ['tab1', 'tab2', 'tab3'];
    const currentIndex = tabs.indexOf(activeTab);
    const targetIndex = tabs.indexOf(tab);
    return currentIndex < targetIndex ? 'left' : 'right';
  };
  
  return (
    <div className="relative overflow-hidden h-64">
      {activeTab === 'tab1' && (
        <div 
          ref={transition({ 
            key: 'tab1', 
            ...slide({ direction: getSlideDirection('tab1') }) 
          })}
          className="absolute inset-0 p-4"
        >
          탭 1 내용
        </div>
      )}
      
      {activeTab === 'tab2' && (
        <div 
          ref={transition({ 
            key: 'tab2', 
            ...slide({ direction: getSlideDirection('tab2') }) 
          })}
          className="absolute inset-0 p-4"
        >
          탭 2 내용
        </div>
      )}
    </div>
  );
}
```

### 캐러셀 슬라이드

```tsx
function Carousel({ images, currentIndex }) {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      {images.map((image, index) => (
        index === currentIndex && (
          <img
            key={index}
            ref={transition({ 
              key: `slide-${index}`, 
              ...slide({ 
                direction: 'left',
                distance: '100%',
                spring: { stiffness: 300, damping: 30 }
              }) 
            })}
            src={image}
            alt={`Slide ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ))}
    </div>
  );
}
```

## 고급 활용

### 축 기반 슬라이드

```tsx
// X축 슬라이드 (좌우)
const slideX = slide({
  axis: 'x',  // direction 대신 axis 사용
  distance: 200
});

// Y축 슬라이드 (상하)
const slideY = slide({
  axis: 'y',
  distance: 150
});
```

### 연속 애니메이션

```tsx
function SequentialSlides() {
  const [step, setStep] = useState(0);
  
  return (
    <div>
      {step >= 0 && (
        <div 
          ref={transition({ 
            key: 'step-1', 
            ...slide({ direction: 'right', distance: 50 }) 
          })}
        >
          단계 1
        </div>
      )}
      
      {step >= 1 && (
        <div 
          ref={transition({ 
            key: 'step-2', 
            ...slide({ direction: 'right', distance: 50 }) 
          })}
        >
          단계 2
        </div>
      )}
      
      <button onClick={() => setStep(step + 1)}>다음</button>
    </div>
  );
}
```

### 반응형 슬라이드

```tsx
function ResponsiveSlide() {
  const isMobile = window.innerWidth < 768;
  
  const responsiveSlide = slide({
    direction: isMobile ? 'up' : 'left',
    distance: isMobile ? 50 : 100,
    spring: { 
      stiffness: isMobile ? 500 : 400,
      damping: 35 
    }
  });
  
  return (
    <div ref={transition({ key: 'responsive', ...responsiveSlide })}>
      반응형 슬라이드
    </div>
  );
}
```

## 성능 최적화

- `transform: translate()`는 GPU 가속을 사용하여 성능이 우수합니다
- 레이아웃을 변경하지 않아 리플로우가 발생하지 않습니다
- 많은 요소에 동시 적용 시에도 부드러운 애니메이션 유지

### 성능 팁

```tsx
// 좋은 예: transform 사용
const goodSlide = slide(); // transform: translateX/Y 사용

// 피해야 할 예: position 직접 변경
const badSlide = {
  in: (element) => ({
    tick: (progress) => {
      // 리플로우 발생!
      element.style.left = `${(1 - progress) * -100}px`;
    }
  })
};
```

## 접근성 고려사항

```tsx
<div 
  ref={transition({ 
    key: 'accessible-slide', 
    ...slide() 
  })}
  role="region"
  aria-live="polite"
  aria-label="슬라이드 콘텐츠"
>
  접근 가능한 슬라이드 콘텐츠
</div>
```

## 권장 사용 사례

- **내비게이션 메뉴**: 사이드바, 드롭다운
- **알림/토스트**: 화면 가장자리에서 등장
- **탭/스텝 전환**: 방향성 있는 콘텐츠 전환
- **이미지 갤러리**: 슬라이드쇼, 캐러셀
- **폼 단계**: 다단계 폼의 단계별 전환