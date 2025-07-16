# SSGOI - 상태를 기억하는 스프링 트랜지션

SSGOI는 DOM 요소의 생명주기에 맞춰 자연스러운 애니메이션을 제공하는 라이브러리입니다.

**핵심 특징**: 애니메이션 상태가 바뀔 때(in → out) 이전 속도와 위치를 기억해서 끊김 없이 부드러운 전환이 가능합니다.

## 설치

```bash
# React
npm install @meursyphus/ssgoi-react

# Svelte  
npm install @meursyphus/ssgoi-svelte
```

## 핵심 아키텍처

### Context 기반 트랜지션 관리
SSGOI는 `create-ssgoi-transition-context`를 통해 중앙화된 트랜지션 관리 시스템을 제공합니다:

- **경로 기반 매칭**: from/to 경로에 따라 다른 트랜지션 적용
- **Promise 기반 동기화**: out과 in 애니메이션의 완벽한 조율
- **패턴 매칭 지원**: 와일드카드(`*`)를 사용한 유연한 경로 매칭
- **폴백 시스템**: 매칭되는 트랜지션이 없을 때 기본 트랜지션 사용

## React 사용법

### 1. Provider 설정 (Ssgoi 컴포넌트)

```jsx
import { Ssgoi, type SsgoiConfig } from '@meursyphus/ssgoi-react';
import { fade } from '@meursyphus/ssgoi-react/view-transitions';

const ssgoiConfig: SsgoiConfig = {
  transitions: [
    // 특정 경로 간 트랜지션 정의
    { from: '/home', to: '/about', transition: slideLeft() },
    { from: '/about', to: '/home', transition: slideRight() },
    { from: '/products', to: '/products/*', transition: fade() }
  ],
  defaultTransition: fade({
    spring: { stiffness: 300, damping: 150 }
  })
};

function App() {
  return (
    <Ssgoi config={ssgoiConfig}>
      {/* 앱 컨텐츠 */}
    </Ssgoi>
  );
}
```

### 2. 페이지 트랜지션 (SsgoiTransition 컴포넌트)

```jsx
import { SsgoiTransition } from '@meursyphus/ssgoi-react';

function HomePage() {
  return (
    <SsgoiTransition id="/home">
      <div>
        <h1>홈 페이지</h1>
        <p>이 컨텐츠는 페이지 전환 시 애니메이션됩니다</p>
      </div>
    </SsgoiTransition>
  );
}
```

### 3. 개별 요소 트랜지션

```jsx
import { transition } from '@meursyphus/ssgoi-react';

function App() {
  const [show, setShow] = useState(true);
  
  return (
    <>
      {show && (
        <div
          ref={transition({
            key: 'fade',
            in: (element) => ({
              spring: { stiffness: 300, damping: 30 },
              tick: (progress) => {
                element.style.opacity = progress.toString();
              }
            }),
            out: (element) => ({
              spring: { stiffness: 300, damping: 30 },
              tick: (progress) => {
                element.style.opacity = progress.toString();
              }
            })
          })}
        >
          Hello World
        </div>
      )}
    </>
  );
}
```

## React 컴포넌트 상세

### Ssgoi (Provider)
- **역할**: 전체 트랜지션 컨텍스트를 관리하는 Provider
- **Props**: 
  - `config`: 트랜지션 설정 (경로별 트랜지션, 기본 트랜지션)
  - `children`: 하위 컴포넌트
- **사용 시점**: 앱의 최상위 또는 트랜지션이 필요한 섹션의 루트

### SsgoiTransition (Wrapper)
- **역할**: 특정 컨텐츠에 트랜지션 효과를 적용하는 Wrapper
- **Props**:
  - `id`: 고유 식별자 (주로 경로 사용)
  - `children`: 애니메이션될 컨텐츠
- **사용 시점**: 페이지 전환이나 조건부 렌더링되는 컨텐츠에 사용

### Svelte

```svelte
<script>
  import { transition } from '@meursyphus/ssgoi-svelte';
  
  let show = true;
</script>

{#if show}
  <div
    use:transition={{
      key: 'fade',
      in: (element) => ({
        spring: { stiffness: 300, damping: 30 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        }
      }),
      out: (element) => ({
        spring: { stiffness: 300, damping: 30 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        }
      })
    }}
  >
    Hello World
  </div>
{/if}
```

## 실제 사용 예제 (React Demo)

React 데모 앱에서는 Next.js와 함께 다음과 같이 사용합니다:

### Layout 설정 (app/demo/layout.tsx)
```jsx
import { Ssgoi, type SsgoiConfig } from "@meursyphus/ssgoi-react";

const ssgoiConfig: SsgoiConfig = {
  transitions: [], // 특정 경로 트랜지션 없음
  defaultTransition: {
    in: async (element) => ({
      spring: { stiffness: 300, damping: 150 },
      tick: (progress) => {
        element.style.opacity = progress.toString();
      }
    }),
    out: async (element) => {
      // out 애니메이션 시 위치 고정
      element.style.position = "absolute";
      element.style.width = "100%";
      element.style.top = "0";
      element.style.left = "0";
      return {
        spring: { stiffness: 300, damping: 150 },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        }
      };
    }
  }
};

export default function DemoLayout({ children }) {
  return (
    <Ssgoi config={ssgoiConfig}>
      <div>{children}</div>
    </Ssgoi>
  );
}
```

### 페이지 구현 (app/demo/page.tsx)
```jsx
import { SsgoiTransition } from "@meursyphus/ssgoi-react";

export default function DemoPage() {
  return (
    <SsgoiTransition id="/demo">
      <div>
        <h1>Welcome to Demo Home</h1>
        <Link href="/demo/about">Go to About</Link>
      </div>
    </SsgoiTransition>
  );
}
```

## 다양한 애니메이션 예제

### Scale + Rotate

```jsx
ref={transition({
  key: 'scale-rotate',
  in: (element) => ({
    spring: { stiffness: 500, damping: 25 },
    tick: (progress) => {
      element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 500, damping: 25 },
    tick: (progress) => {
      element.style.transform = `scale(${progress}) rotate(${progress * 360}deg)`;
    }
  })
})}
```

### Slide

```jsx
ref={transition({
  key: 'slide',
  in: (element) => ({
    spring: { stiffness: 400, damping: 35 },
    tick: (progress) => {
      element.style.transform = `translateX(${(1 - progress) * -100}px)`;
      element.style.opacity = progress.toString();
    }
  }),
  out: (element) => ({
    spring: { stiffness: 400, damping: 35 },
    tick: (progress) => {
      element.style.transform = `translateX(${(1 - progress) * -100}px)`;
      element.style.opacity = progress.toString();
    }
  })
})}
```

## Spring 설정

- `stiffness`: 스프링의 강도 (1-1000, 높을수록 빠름)
- `damping`: 진동 감쇠 (0-100, 높을수록 진동 적음)

```jsx
// 빠르고 팅기는 느낌
spring: { stiffness: 800, damping: 20 }

// 부드럽고 느린 느낌
spring: { stiffness: 200, damping: 40 }
```

## 왜 SSGOI인가?

일반적인 CSS transition이나 다른 애니메이션 라이브러리와 달리, SSGOI는 애니메이션이 진행 중일 때 방향이 바뀌어도 현재 속도를 유지하며 자연스럽게 전환됩니다.

예를 들어, 토글 버튼을 빠르게 여러 번 클릭해도:
- ❌ 기존 방식: 애니메이션이 뚝뚝 끊기며 처음부터 다시 시작
- ✅ SSGOI: 현재 위치와 속도를 유지하며 부드럽게 방향 전환

## 데모

- [React 데모](./apps/react-demo)
- [Svelte 데모](./apps/svelte-demo)

## 주의사항

### out 애니메이션의 progress 방향
`out` 애니메이션에서 `progress`는 **1에서 0으로** 진행됩니다:
- `in`: progress가 0 → 1 (요소가 나타날 때)
- `out`: progress가 1 → 0 (요소가 사라질 때)

이는 애니메이션 상태 전환 시 자연스러운 연속성을 보장하기 위함입니다.

## 라이선스

MIT