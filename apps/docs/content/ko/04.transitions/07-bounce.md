---
title: "바운스 애니메이션"
description: "요소가 통통 튀는 듯한 생동감 있는 효과를 만듭니다"
nav-title: "바운스"
---

# 바운스 애니메이션

바운스(Bounce) 애니메이션은 요소가 튀어오르는 듯한 효과를 만들어 재미있고 생동감 있는 인터랙션을 제공합니다. 주목을 끌거나 즐거운 사용자 경험을 만들 때 효과적입니다.

## 기본 사용법

```tsx
import { transition } from '@ssgoi/react';
import { bounce } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'bounce-element', ...bounce() })}>
          바운스 애니메이션이 적용된 요소
        </div>
      )}
    </div>
  );
}
```

## 옵션

```typescript
interface BounceOptions {
  height?: number;         // 바운스 높이 (기본값: 20)
  intensity?: number;      // 바운스 강도 (기본값: 1)
  scale?: boolean;         // 스케일 효과 추가 (기본값: true)
  fade?: boolean;          // 페이드 효과 추가 (기본값: false)
  direction?: 'up' | 'down';  // 바운스 방향 (기본값: 'up')
  spring?: {
    stiffness?: number;    // 스프링 강도 (기본값: 800)
    damping?: number;      // 감쇠 계수 (기본값: 15)
  };
}
```

### 옵션 설명

- **height**: 바운스 최대 높이 (픽셀)
- **intensity**: 바운스 횟수와 강도 (1 = 기본, 2 = 두 배)
- **scale**: 바운스와 함께 크기 변화 효과
- **fade**: 바운스와 함께 페이드 효과
- **direction**: 바운스 방향
  - `'up'`: 위로 튀어오름
  - `'down'`: 아래로 떨어짐
- **spring**: 스프링 물리 설정 (높은 stiffness = 빠른 바운스)

## 사용 예시

### 바운스 강도 조절

```tsx
// 부드러운 바운스
const softBounce = bounce({ 
  height: 10,
  intensity: 0.5,
  spring: { stiffness: 600, damping: 20 }
});

// 강한 바운스
const strongBounce = bounce({ 
  height: 30,
  intensity: 2,
  spring: { stiffness: 1000, damping: 10 }
});

// 미세한 바운스
const subtleBounce = bounce({ 
  height: 5,
  intensity: 0.3
});
```

### 방향 변경

```tsx
// 위로 바운스 (기본)
const bounceUp = bounce({ 
  direction: 'up' 
});

// 아래로 바운스 (떨어지는 효과)
const bounceDown = bounce({ 
  direction: 'down',
  height: 25
});
```

### 복합 효과

```tsx
// 바운스 + 페이드
const bounceFade = bounce({ 
  fade: true,
  height: 20
});

// 바운스만 (스케일 없이)
const bounceOnly = bounce({ 
  scale: false,
  height: 15
});

// 모든 효과 조합
const bounceAll = bounce({ 
  height: 25,
  intensity: 1.5,
  scale: true,
  fade: true,
  spring: { stiffness: 700, damping: 12 }
});
```

## 실용적인 활용 예시

### 좋아요 버튼

```tsx
function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <button
      onClick={() => setIsLiked(!isLiked)}
      className="relative p-2"
    >
      {isLiked ? (
        <HeartIcon 
          ref={transition({ 
            key: 'heart-filled', 
            ...bounce({ 
              height: 15,
              intensity: 1.2,
              spring: { stiffness: 900, damping: 15 }
            }) 
          })}
          className="w-8 h-8 text-red-500"
        />
      ) : (
        <HeartOutlineIcon className="w-8 h-8 text-gray-400" />
      )}
      
      {/* 좋아요 카운트 애니메이션 */}
      {isLiked && (
        <span 
          ref={transition({ 
            key: 'like-count', 
            ...bounce({ 
              height: 10,
              direction: 'up',
              fade: true
            }) 
          })}
          className="absolute -top-2 -right-2 text-xs text-red-500"
        >
          +1
        </span>
      )}
    </button>
  );
}
```

### 알림 벨

```tsx
function NotificationBell({ hasNew }) {
  return (
    <div className="relative">
      <BellIcon 
        ref={hasNew ? transition({ 
          key: 'bell-bounce', 
          ...bounce({ 
            height: 8,
            intensity: 2,
            spring: { stiffness: 1200, damping: 20 }
          }) 
        }) : undefined}
        className="w-6 h-6"
      />
      
      {hasNew && (
        <div 
          ref={transition({ 
            key: 'notification-dot', 
            ...bounce({ 
              height: 5,
              scale: true
            }) 
          })}
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
        />
      )}
    </div>
  );
}
```

### 성공 메시지

```tsx
function SuccessMessage({ show, message }) {
  return (
    <>
      {show && (
        <div 
          ref={transition({ 
            key: 'success-message', 
            ...bounce({ 
              height: 20,
              direction: 'down',
              fade: true,
              spring: { stiffness: 600, damping: 18 }
            }) 
          })}
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <CheckCircleIcon className="w-5 h-5" />
          {message}
        </div>
      )}
    </>
  );
}
```

### 드롭 애니메이션

```tsx
function DroppableItem({ item, onDrop }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  
  const handleDrop = () => {
    setIsDropped(true);
    onDrop(item);
  };
  
  return (
    <div
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false);
        handleDrop();
      }}
      className={isDragging ? 'opacity-50' : ''}
    >
      {isDropped ? (
        <div 
          ref={transition({ 
            key: 'dropped-item', 
            ...bounce({ 
              height: 30,
              direction: 'down',
              intensity: 1.5,
              spring: { stiffness: 500, damping: 12 }
            }) 
          })}
          className="p-4 bg-blue-100 rounded-lg"
        >
          {item.name} (Dropped!)
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg cursor-move">
          {item.name}
        </div>
      )}
    </div>
  );
}
```

## 고급 활용

### 연속 바운스

```tsx
function ContinuousBounce() {
  const [bounceCount, setBounceCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounceCount(c => c + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={transition({ 
        key: `bounce-${bounceCount}`, 
        ...bounce({ 
          height: 15,
          intensity: 0.8
        }) 
      })}
      className="w-20 h-20 bg-purple-500 rounded-full"
    />
  );
}
```

### 탄성 메뉴

```tsx
function ElasticMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-500 text-white rounded-full"
      >
        <MenuIcon />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 space-y-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={transition({ 
                key: `menu-item-${item.id}`, 
                ...bounce({ 
                  height: 20 - index * 3,  // 점진적으로 감소
                  intensity: 1,
                  spring: { 
                    stiffness: 800 - index * 50,  // 순차적 효과
                    damping: 15 
                  }
                }) 
              })}
              className="block w-full px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
              style={{ 
                transitionDelay: `${index * 50}ms`  // 스태거 효과
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 공 튀기기 시뮬레이션

```tsx
function BouncingBall() {
  const [position, setPosition] = useState({ x: 50, y: 0 });
  const [bounceKey, setBounceKey] = useState(0);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setBounceKey(k => k + 1);
  };
  
  return (
    <div 
      className="relative w-full h-96 bg-gray-100 overflow-hidden"
      onClick={handleClick}
    >
      <div
        ref={transition({ 
          key: `ball-${bounceKey}`, 
          ...bounce({ 
            height: 150,
            direction: 'down',
            intensity: 2,
            scale: true,
            spring: { stiffness: 400, damping: 10 }
          }) 
        })}
        className="absolute w-12 h-12 bg-red-500 rounded-full"
        style={{ 
          left: position.x - 24,
          top: position.y - 24
        }}
      />
    </div>
  );
}
```

## 성능 최적화

- 바운스는 `transform: translateY()`를 사용하여 GPU 가속됩니다
- 높은 `intensity` 값은 더 많은 계산을 필요로 합니다
- 여러 요소의 동시 바운스는 성능을 고려해야 합니다

### 성능 팁

```tsx
// 모바일 최적화
const isMobile = window.innerWidth < 768;
const optimizedBounce = bounce({
  height: isMobile ? 10 : 20,
  intensity: isMobile ? 0.8 : 1,
  spring: { 
    stiffness: isMobile ? 900 : 800,
    damping: 15 
  }
});
```

## 접근성 고려사항

```tsx
<button
  ref={transition({ 
    key: 'accessible-bounce', 
    ...bounce() 
  })}
  aria-label="새 알림 있음"
  aria-live="polite"
  aria-atomic="true"
>
  <NotificationIcon />
</button>
```

## 권장 사용 사례

- **인터랙션 피드백**: 버튼 클릭, 좋아요
- **알림**: 새 메시지, 업데이트 알림
- **성공/완료 상태**: 작업 완료 표시
- **게임 요소**: 점수 획득, 아이템 수집
- **튜토리얼**: 주목할 요소 강조