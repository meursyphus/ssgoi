---
title: "스케일 애니메이션"
description: "요소의 크기를 조절하여 확대/축소 효과를 만듭니다"
nav-title: "스케일"
---

# 스케일 애니메이션

스케일(Scale) 애니메이션은 요소의 크기를 변경하여 확대되거나 축소되는 효과를 만듭니다. 주목도를 높이거나 시각적 계층을 표현할 때 효과적입니다.

## 기본 사용법

```tsx
import { transition } from '@ssgoi/react';
import { scale } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'scale-element', ...scale() })}>
          스케일 애니메이션이 적용된 요소
        </div>
      )}
    </div>
  );
}
```

## 옵션

```typescript
interface ScaleOptions {
  start?: number;      // 시작 크기 배율 (기본값: 0)
  opacity?: number;    // 시작 투명도 (기본값: 0)
  axis?: 'x' | 'y' | 'both';  // 스케일 방향 (기본값: 'both')
  spring?: {
    stiffness?: number;  // 스프링 강도 (기본값: 300)
    damping?: number;    // 감쇠 계수 (기본값: 30)
  };
}
```

### 옵션 설명

- **start**: 애니메이션 시작 시 크기 (0 = 0%, 1 = 100%)
- **opacity**: 시작 투명도 (0-1)
- **axis**: 스케일이 적용될 축
  - `'both'`: X와 Y축 모두 (기본값)
  - `'x'`: 가로 방향만
  - `'y'`: 세로 방향만
- **spring**: 스프링 물리 설정

## 사용 예시

### 축 방향 스케일

#### X축 스케일 (가로 확장)

```tsx
const scaleX = scale({
  axis: 'x',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-x', ...scaleX })}>
  가로로만 확장되는 요소
</div>
```

#### Y축 스케일 (세로 확장)

```tsx
const scaleY = scale({
  axis: 'y',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-y', ...scaleY })}>
  세로로만 확장되는 요소
</div>
```

### 부분 스케일

작은 크기에서 시작하는 효과:

```tsx
const partialScale = scale({
  start: 0.5,     // 50% 크기에서 시작
  opacity: 0.3,   // 30% 투명도에서 시작
});

<div ref={transition({ key: 'partial-scale', ...partialScale })}>
  절반 크기에서 시작하는 요소
</div>
```

### 바운스 효과가 있는 스케일

스프링 설정으로 바운스 효과 추가:

```tsx
const bounceScale = scale({
  spring: { 
    stiffness: 200,  // 낮은 강도로 바운스
    damping: 15      // 낮은 감쇠로 진동 증가
  }
});

<div ref={transition({ key: 'bounce-scale', ...bounceScale })}>
  통통 튀는 스케일 효과
</div>
```

## 실용적인 활용 예시

### 카드 호버 효과

```tsx
function Card() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div 
          ref={transition({ 
            key: 'card-hover', 
            ...scale({ start: 0.95, opacity: 0.8 }) 
          })}
          className="absolute inset-0 bg-blue-500/20 rounded-lg"
        />
      )}
      <div className="p-4">카드 내용</div>
    </div>
  );
}
```

### 모달 등장 효과

```tsx
function Modal({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div 
            ref={transition({ 
              key: 'modal', 
              ...scale({ start: 0.8, opacity: 0 }) 
            })}
            className="bg-white rounded-lg p-6 shadow-xl"
          >
            <h2>모달 제목</h2>
            <p>모달 내용</p>
            <button onClick={onClose}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
}
```

### 아이콘 애니메이션

```tsx
function AnimatedIcon() {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button onClick={() => setIsActive(!isActive)}>
      {isActive ? (
        <HeartFilledIcon 
          ref={transition({ 
            key: 'heart-icon', 
            ...scale({ start: 0, spring: { stiffness: 600, damping: 20 } }) 
          })} 
        />
      ) : (
        <HeartOutlineIcon />
      )}
    </button>
  );
}
```

## 성능 최적화

- `transform: scale()`은 GPU 가속을 사용하여 성능이 우수합니다
- 레이아웃 변경을 일으키지 않아 리플로우가 발생하지 않습니다
- 많은 요소에 동시 적용 시에도 부드러운 애니메이션을 유지합니다

### 성능 팁

```tsx
// 좋은 예: transform 사용
const goodScale = scale(); // transform: scale() 사용

// 피해야 할 예: width/height 직접 변경
const badScale = {
  in: (element) => ({
    tick: (progress) => {
      // 리플로우 발생!
      element.style.width = `${progress * 100}px`;
      element.style.height = `${progress * 100}px`;
    }
  })
};
```

## 접근성 고려사항

```tsx
<button
  ref={transition({ 
    key: 'accessible-button', 
    ...scale({ start: 0.9 }) 
  })}
  aria-label="확대되는 버튼"
  className="focus:outline-none focus:ring-2"
>
  클릭하세요
</button>
```

## 권장 사용 사례

- **버튼/아이콘**: 클릭 피드백이나 호버 효과
- **카드/타일**: 선택 상태나 포커스 표시
- **모달/팝업**: 등장과 퇴장 애니메이션
- **이미지 갤러리**: 썸네일 확대 효과
- **차트/그래프**: 데이터 시각화 요소의 강조