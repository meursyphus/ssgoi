---
title: "스크롤 전환"
description: "페이지가 위아래로 스크롤되며 전환되는 효과"
nav-title: "스크롤"
---

# 스크롤 전환

스크롤(Scroll) 전환은 페이지가 위 또는 아래로 슬라이드하며 전환되는 효과입니다. 모바일 앱에서 흔히 볼 수 있는 자연스러운 페이지 전환을 웹에서 구현합니다.

## 기본 사용법

```tsx
import { Ssgoi } from '@ssgoi/react';
import { scroll } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: scroll()
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* 앱 내용 */}
    </Ssgoi>
  );
}
```

## 옵션

### 방향 설정

```tsx
scroll({
  direction: 'up',    // 'up' | 'down' (기본값: 'up')
  spring: {
    stiffness: 300,   // 스프링 강도 (기본값: 300)
    damping: 30       // 감쇠 계수 (기본값: 30)
  }
})
```

### 방향별 동작

- **`direction: 'up'`** (기본값)
  - 들어오는 페이지: 아래에서 위로 올라옴
  - 나가는 페이지: 위로 사라짐
  
- **`direction: 'down'`**
  - 들어오는 페이지: 위에서 아래로 내려옴
  - 나가는 페이지: 아래로 사라짐

## 사용 예시

### 위로 스크롤 (기본)

```tsx
const config = {
  defaultTransition: scroll()
};
```

### 아래로 스크롤

```tsx
const config = {
  defaultTransition: scroll({ direction: 'down' })
};
```

### 부드러운 스크롤

```tsx
const config = {
  defaultTransition: scroll({
    spring: {
      stiffness: 150,
      damping: 25
    }
  })
};
```

## 경로별 방향 설정

계층 구조에 따라 다른 방향으로 전환:

```tsx
const config = {
  transitions: [
    {
      from: '/list',
      to: '/detail/*',
      transition: scroll({ direction: 'up' }),
      symmetric: true  // 반대로 갈 때는 자동으로 down
    },
    {
      from: '/parent',
      to: '/child',
      transition: scroll({ direction: 'down' })
    }
  ]
};

<Ssgoi config={config}>
  {/* 앱 내용 */}
</Ssgoi>
```

## 작동 원리

```
Direction: UP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
나가는 페이지  →  위로 이동 (translateY: 0 → -100%)
들어오는 페이지 →  아래에서 위로 (translateY: 100% → 0)

Direction: DOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
나가는 페이지  →  아래로 이동 (translateY: 0 → 100%)
들어오는 페이지 →  위에서 아래로 (translateY: -100% → 0)
```

## 장점

- 직관적인 방향성으로 페이지 계층 구조 표현
- 모바일 앱과 유사한 자연스러운 UX
- GPU 가속을 활용한 부드러운 성능
- 스크롤 제스처와 일관된 동작

## 권장 사용 사례

### UP 방향
- 목록 → 상세 페이지
- 홈 → 서브 페이지
- 일반적인 forward 네비게이션

### DOWN 방향
- 부모 → 자식 관계
- 메뉴 → 하위 메뉴
- 모달이나 오버레이 표시

## 주의사항

- 페이지 높이가 viewport보다 긴 경우, 전환 시작 위치가 중요
- 스크롤 위치는 자동으로 보존되므로 별도 처리 불필요
- 양방향 네비게이션에는 `symmetric: true` 사용 권장