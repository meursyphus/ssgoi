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

## 기본 사용법

### React

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