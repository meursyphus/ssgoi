---
title: "플라이 애니메이션"
description: "요소가 특정 위치에서 날아오는 듯한 효과를 만듭니다"
nav-title: "플라이"
---

# 플라이 애니메이션

플라이(Fly) 애니메이션은 요소가 특정 좌표에서 날아오는 효과를 만듭니다. X, Y 좌표를 모두 제어할 수 있어 대각선 이동이나 복잡한 진입 효과를 구현할 수 있습니다.

## 기본 사용법

```tsx
import { transition } from '@ssgoi/react';
import { fly } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fly-element', ...fly() })}>
          플라이 애니메이션이 적용된 요소
        </div>
      )}
    </div>
  );
}
```

## 옵션

```typescript
interface FlyOptions {
  x?: number | string;    // X축 이동 거리 (기본값: 0)
  y?: number | string;    // Y축 이동 거리 (기본값: -100)
  opacity?: number;       // 시작 투명도 (기본값: 0)
  spring?: {
    stiffness?: number;   // 스프링 강도 (기본값: 400)
    damping?: number;     // 감쇠 계수 (기본값: 35)
  };
}
```

### 옵션 설명

- **x**: 가로 방향 시작 위치 (양수: 오른쪽, 음수: 왼쪽)
- **y**: 세로 방향 시작 위치 (양수: 아래, 음수: 위)
- **opacity**: 시작 투명도 (0-1)
- **spring**: 스프링 물리 설정

## 사용 예시

### 다양한 방향에서 날아오기

```tsx
// 위에서 날아오기 (기본값)
const flyFromTop = fly();

// 아래에서 날아오기
const flyFromBottom = fly({ 
  y: 100 
});

// 왼쪽에서 날아오기
const flyFromLeft = fly({ 
  x: -200, 
  y: 0 
});

// 오른쪽에서 날아오기
const flyFromRight = fly({ 
  x: 200, 
  y: 0 
});

// 대각선 (왼쪽 위)
const flyDiagonal = fly({ 
  x: -150, 
  y: -150 
});
```

### 단위 지정

```tsx
// 픽셀 단위 (기본)
const flyPixels = fly({ 
  x: 100, 
  y: -50 
});

// rem 단위
const flyRem = fly({ 
  x: '5rem', 
  y: '-3rem' 
});

// 뷰포트 단위
const flyViewport = fly({ 
  x: '50vw', 
  y: '-100vh' 
});

// 퍼센트 단위
const flyPercent = fly({ 
  x: '200%', 
  y: '0%' 
});
```

### 투명도 조절

```tsx
// 반투명에서 시작
const flyWithOpacity = fly({ 
  x: 0, 
  y: -100, 
  opacity: 0.2  // 20% 투명도에서 시작
});

// 완전 불투명 (플라이만)
const flyNoFade = fly({ 
  x: -100, 
  y: 0, 
  opacity: 1  // 페이드 효과 없음
});
```

## 실용적인 활용 예시

### 플로팅 액션 버튼 (FAB)

```tsx
function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4">
      {/* 메인 버튼 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg"
      >
        +
      </button>
      
      {/* 서브 버튼들 */}
      {isExpanded && (
        <>
          <button
            ref={transition({ 
              key: 'fab-1', 
              ...fly({ x: -60, y: -10 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-green-500"
          >
            📝
          </button>
          
          <button
            ref={transition({ 
              key: 'fab-2', 
              ...fly({ x: -45, y: -45 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-red-500"
          >
            📸
          </button>
          
          <button
            ref={transition({ 
              key: 'fab-3', 
              ...fly({ x: -10, y: -60 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-yellow-500"
          >
            📎
          </button>
        </>
      )}
    </div>
  );
}
```

### 카드 그리드 애니메이션

```tsx
function CardGrid({ cards }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, index) => {
        // 각 카드가 다른 방향에서 날아옴
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        return (
          <div
            key={card.id}
            ref={transition({ 
              key: `card-${card.id}`, 
              ...fly({ 
                x: (col - 1) * 100,  // 중앙 열은 0, 좌우는 ±100
                y: row * 50,         // 아래 행일수록 더 아래에서
                spring: { 
                  stiffness: 300, 
                  damping: 30 + index * 2  // 순차적 효과
                }
              }) 
            })}
            className="p-4 bg-white rounded-lg shadow"
          >
            {card.content}
          </div>
        );
      })}
    </div>
  );
}
```

### 툴팁 애니메이션

```tsx
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPosition({
            x: rect.width / 2,
            y: -10
          });
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={transition({ 
            key: 'tooltip', 
            ...fly({ 
              x: 0, 
              y: 10,  // 아래에서 살짝 올라옴
              opacity: 0.1 
            }) 
          })}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded"
          style={{ left: position.x }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

### 알림 스택

```tsx
function NotificationStack({ notifications }) {
  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          ref={transition({ 
            key: `notification-${notification.id}`, 
            ...fly({ 
              x: 300,  // 오른쪽에서 날아옴
              y: 0,
              spring: { 
                stiffness: 400, 
                damping: 35 
              }
            }) 
          })}
          className="bg-white rounded-lg shadow-lg p-4 min-w-[300px]"
        >
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## 고급 활용

### 마우스 위치 기반 플라이

```tsx
function MouseBasedFly() {
  const [items, setItems] = useState([]);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const newItem = {
      id: Date.now(),
      x,
      y
    };
    
    setItems([...items, newItem]);
  };
  
  return (
    <div 
      className="relative w-full h-96 bg-gray-100 overflow-hidden"
      onClick={handleClick}
    >
      {items.map(item => (
        <div
          key={item.id}
          ref={transition({ 
            key: `item-${item.id}`, 
            ...fly({ 
              x: -item.x,  // 클릭 위치에서 중앙으로
              y: -item.y,
              spring: { stiffness: 200, damping: 25 }
            }) 
          })}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full"
        />
      ))}
    </div>
  );
}
```

### 스태거드 플라이 애니메이션

```tsx
function StaggeredFly({ items }) {
  const [visibleItems, setVisibleItems] = useState([]);
  
  useEffect(() => {
    // 순차적으로 아이템 표시
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, item]);
      }, index * 100);
    });
  }, [items]);
  
  return (
    <div className="space-y-2">
      {visibleItems.map((item, index) => (
        <div
          key={item.id}
          ref={transition({ 
            key: `stagger-${item.id}`, 
            ...fly({ 
              x: -50 - index * 10,  // 점진적으로 더 멀리서
              y: 0,
              spring: { 
                stiffness: 300, 
                damping: 30 
              }
            }) 
          })}
          className="p-3 bg-white rounded shadow"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

## 성능 최적화

- `transform: translate()`는 GPU 가속을 사용합니다
- X와 Y를 동시에 애니메이션해도 단일 transform으로 처리됩니다
- 복잡한 경로는 CSS 애니메이션보다 스프링 물리가 더 자연스럽습니다

## 접근성 고려사항

```tsx
<div 
  ref={transition({ 
    key: 'accessible-fly', 
    ...fly({ x: -100, y: -50 }) 
  })}
  role="status"
  aria-live="polite"
  aria-label="날아오는 콘텐츠"
>
  중요한 알림 내용
</div>
```

## 권장 사용 사례

- **플로팅 버튼**: FAB 메뉴 확장
- **툴팁/팝오버**: 마우스 위치 기반 표시
- **알림**: 화면 가장자리에서 진입
- **카드 레이아웃**: 그리드 아이템 애니메이션
- **대시보드 위젯**: 동적 콘텐츠 추가