---
title: "회전 애니메이션"
description: "요소를 회전시켜 동적이고 활기찬 효과를 만듭니다"
nav-title: "회전"
---

# 회전 애니메이션

회전(Rotate) 애니메이션은 요소를 2D 또는 3D 공간에서 회전시키는 효과를 만듭니다. 재미있고 눈길을 끄는 애니메이션으로 사용자의 주목을 끌 수 있습니다.

## 기본 사용법

```tsx
import { transition } from '@ssgoi/react';
import { rotate } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'rotate-element', ...rotate() })}>
          회전 애니메이션이 적용된 요소
        </div>
      )}
    </div>
  );
}
```

## 옵션

```typescript
interface RotateOptions {
  degrees?: number;        // 회전 각도 (기본값: 360)
  clockwise?: boolean;     // 시계 방향 여부 (기본값: true)
  scale?: boolean;         // 스케일 효과 추가 (기본값: false)
  fade?: boolean;          // 페이드 효과 추가 (기본값: false)
  origin?: string;         // 회전 중심점 (기본값: 'center')
  axis?: '2d' | 'x' | 'y' | 'z';  // 회전 축 (기본값: '2d')
  perspective?: number;    // 3D 원근감 (기본값: 800)
  spring?: {
    stiffness?: number;    // 스프링 강도 (기본값: 500)
    damping?: number;      // 감쇠 계수 (기본값: 25)
  };
}
```

### 옵션 설명

- **degrees**: 회전 각도 (360 = 한 바퀴)
- **clockwise**: true면 시계방향, false면 반시계방향
- **scale**: 회전과 함께 크기 변화 효과
- **fade**: 회전과 함께 페이드 효과
- **origin**: 회전 중심점 (CSS transform-origin 값)
- **axis**: 회전 축
  - `'2d'`: 평면 회전 (기본값)
  - `'x'`: X축 회전 (위아래로 뒤집기)
  - `'y'`: Y축 회전 (좌우로 뒤집기)
  - `'z'`: Z축 회전 (평면 회전과 동일)
- **perspective**: 3D 회전 시 원근감 거리
- **spring**: 스프링 물리 설정

## 사용 예시

### 기본 회전 변형

```tsx
// 반 바퀴 회전
const halfRotate = rotate({ 
  degrees: 180 
});

// 반시계 방향 회전
const counterClockwise = rotate({ 
  clockwise: false 
});

// 두 바퀴 회전
const doubleRotate = rotate({ 
  degrees: 720 
});

// 작은 회전
const smallRotate = rotate({ 
  degrees: 45 
});
```

### 3D 회전

```tsx
// X축 회전 (카드 뒤집기 효과)
const flipX = rotate({ 
  axis: 'x',
  degrees: 180,
  perspective: 1000
});

// Y축 회전 (문 열기 효과)
const flipY = rotate({ 
  axis: 'y',
  degrees: 90,
  perspective: 800
});

// Z축 회전 (평면 회전)
const rotateZ = rotate({ 
  axis: 'z',
  degrees: 360
});
```

### 회전 중심점 변경

```tsx
// 왼쪽 상단 기준 회전
const topLeftRotate = rotate({ 
  origin: 'top left',
  degrees: 90
});

// 오른쪽 하단 기준 회전
const bottomRightRotate = rotate({ 
  origin: 'bottom right',
  degrees: -90
});

// 커스텀 중심점
const customOrigin = rotate({ 
  origin: '25% 75%',
  degrees: 180
});
```

### 복합 효과

```tsx
// 회전 + 스케일
const rotateScale = rotate({ 
  degrees: 360,
  scale: true
});

// 회전 + 페이드
const rotateFade = rotate({ 
  degrees: 720,
  fade: true
});

// 회전 + 스케일 + 페이드
const rotateAll = rotate({ 
  degrees: 360,
  scale: true,
  fade: true,
  spring: { stiffness: 300, damping: 20 }
});
```

## 실용적인 활용 예시

### 로딩 스피너

```tsx
function LoadingSpinner({ isLoading }) {
  return (
    <>
      {isLoading && (
        <div 
          ref={transition({ 
            key: 'spinner', 
            ...rotate({ 
              degrees: 360,
              spring: { stiffness: 100, damping: 10 }
            }) 
          })}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      )}
    </>
  );
}
```

### 카드 뒤집기

```tsx
function FlipCard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="relative w-64 h-96 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 앞면 */}
      {!isFlipped && (
        <div 
          ref={transition({ 
            key: 'card-front', 
            ...rotate({ 
              axis: 'y',
              degrees: 180,
              perspective: 1000
            }) 
          })}
          className="absolute inset-0 bg-white rounded-lg shadow-lg p-6"
        >
          {front}
        </div>
      )}
      
      {/* 뒷면 */}
      {isFlipped && (
        <div 
          ref={transition({ 
            key: 'card-back', 
            ...rotate({ 
              axis: 'y',
              degrees: 180,
              perspective: 1000,
              clockwise: false
            }) 
          })}
          className="absolute inset-0 bg-gray-800 text-white rounded-lg shadow-lg p-6"
        >
          {back}
        </div>
      )}
    </div>
  );
}
```

### 새로고침 버튼

```tsx
function RefreshButton({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-2 rounded-full hover:bg-gray-100"
    >
      <svg 
        ref={isRefreshing ? transition({ 
          key: 'refresh-icon', 
          ...rotate({ 
            degrees: 360,
            spring: { stiffness: 200, damping: 20 }
          }) 
        }) : undefined}
        className="w-6 h-6"
        viewBox="0 0 24 24"
      >
        <path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z"/>
      </svg>
    </button>
  );
}
```

### 아이콘 트랜지션

```tsx
function IconTransition({ isActive }) {
  return (
    <div className="relative w-8 h-8">
      {isActive ? (
        <CheckIcon 
          ref={transition({ 
            key: 'check-icon', 
            ...rotate({ 
              degrees: 360,
              scale: true,
              spring: { stiffness: 600, damping: 30 }
            }) 
          })}
          className="absolute inset-0"
        />
      ) : (
        <CloseIcon 
          ref={transition({ 
            key: 'close-icon', 
            ...rotate({ 
              degrees: -360,
              scale: true,
              spring: { stiffness: 600, damping: 30 }
            }) 
          })}
          className="absolute inset-0"
        />
      )}
    </div>
  );
}
```

## 고급 활용

### 다단계 회전

```tsx
function MultiStageRotate() {
  const [stage, setStage] = useState(0);
  
  const rotations = [
    { degrees: 90, origin: 'top left' },
    { degrees: 180, origin: 'center' },
    { degrees: 270, origin: 'bottom right' },
    { degrees: 360, origin: 'center' }
  ];
  
  return (
    <div>
      <div 
        ref={transition({ 
          key: `rotate-stage-${stage}`, 
          ...rotate(rotations[stage]) 
        })}
        className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
      />
      
      <button onClick={() => setStage((s) => (s + 1) % 4)}>
        다음 단계
      </button>
    </div>
  );
}
```

### 마우스 추적 회전

```tsx
function MouseTrackingRotate() {
  const [rotation, setRotation] = useState(0);
  const elementRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    ) * (180 / Math.PI);
    
    setRotation(angle);
  };
  
  return (
    <div 
      className="relative w-full h-64"
      onMouseMove={handleMouseMove}
    >
      <div 
        ref={(el) => {
          elementRef.current = el;
          if (el) {
            transition({ 
              key: `mouse-rotate-${Math.floor(rotation / 10)}`, 
              ...rotate({ 
                degrees: rotation,
                spring: { stiffness: 300, damping: 30 }
              }) 
            })(el);
          }
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
      >
        →
      </div>
    </div>
  );
}
```

### 3D 큐브 회전

```tsx
function RotatingCube() {
  const [face, setFace] = useState(0);
  const faces = ['front', 'right', 'back', 'left'];
  
  return (
    <div className="perspective-1000">
      <div 
        ref={transition({ 
          key: `cube-${face}`, 
          ...rotate({ 
            axis: 'y',
            degrees: face * 90,
            perspective: 1000,
            spring: { stiffness: 200, damping: 25 }
          }) 
        })}
        className="relative w-32 h-32 transform-style-preserve-3d"
      >
        {/* 큐브의 각 면 */}
        <div className="absolute inset-0 bg-red-500">앞</div>
        <div className="absolute inset-0 bg-blue-500 rotate-y-90">오른쪽</div>
        <div className="absolute inset-0 bg-green-500 rotate-y-180">뒤</div>
        <div className="absolute inset-0 bg-yellow-500 rotate-y-270">왼쪽</div>
      </div>
      
      <button onClick={() => setFace((f) => (f + 1) % 4)}>
        다음 면
      </button>
    </div>
  );
}
```

## 성능 최적화

- `transform: rotate()`는 GPU 가속을 사용합니다
- 3D 회전 시 `will-change: transform`을 사용하면 성능 향상
- 많은 요소의 동시 회전은 성능에 영향을 줄 수 있으므로 주의

## 접근성 고려사항

```tsx
<div 
  ref={transition({ 
    key: 'accessible-rotate', 
    ...rotate() 
  })}
  role="img"
  aria-label="회전하는 로고"
  aria-live="polite"
>
  <Logo />
</div>
```

## 권장 사용 사례

- **로딩 인디케이터**: 스피너, 진행 표시
- **아이콘 전환**: 상태 변경 시 아이콘 회전
- **카드 인터랙션**: 앞뒤 뒤집기 효과
- **새로고침**: 리프레시 버튼 애니메이션
- **게임 요소**: 룰렛, 다이스 등 게임 UI