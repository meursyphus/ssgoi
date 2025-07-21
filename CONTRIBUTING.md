# SSGOI 컨트리뷰팅 가이드

SSGOI 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트 구조, 개발 환경 설정, 그리고 기여 방법에 대한 상세한 가이드를 제공합니다.

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [프로젝트 구조](#프로젝트-구조)
3. [개발 환경 설정](#개발-환경-설정)
4. [아키텍처 이해하기](#아키텍처-이해하기)
5. [새로운 프레임워크 지원 추가하기](#새로운-프레임워크-지원-추가하기)
6. [데모 페이지 만들기](#데모-페이지-만들기)
7. [이슈 및 작업 관리](#이슈-및-작업-관리)
8. [코드 스타일 가이드](#코드-스타일-가이드)
9. [PR 제출 가이드](#pr-제출-가이드)
10. [테스트 가이드](#테스트-가이드)

## 프로젝트 소개

SSGOI(상태를 기억하는 스프링 트랜지션)는 DOM 요소의 생명주기에 맞춰 자연스러운 애니메이션을 제공하는 라이브러리입니다. 핵심 특징은 애니메이션 상태가 바뀔 때(in → out) 이전 속도와 위치를 기억해서 끊김 없이 부드러운 전환이 가능하다는 점입니다.

## 프로젝트 구조

```
ssgoi/
├── packages/
│   ├── core/                 # 프레임워크 독립적인 핵심 로직
│   │   └── src/lib/
│   │       ├── animator.ts             # 스프링 물리 애니메이션 엔진
│   │       ├── create-ssgoi-transition-context.ts  # 페이지 전환 시 트랜지션 매칭 및 동기화
│   │       ├── create-transition-callback.ts       # DOM 애니메이션 실행 및 상태 관리
│   │       ├── transition.ts           # 트랜지션 상태 저장소 (진행 중인 애니메이션 추적)
│   │       ├── types.ts               # TypeScript 타입 정의
│   │       ├── transitions/           # 개별 요소용 트랜지션 효과 프리셋
│   │       └── view-transitions/      # 페이지 전환용 트랜지션 프리셋
│   │
│   ├── react/               # React 통합 패키지
│   │   └── src/lib/
│   │       ├── index.ts
│   │       ├── context.ts            # React Context API 활용
│   │       ├── ssgoi.tsx            # Provider 컴포넌트 (트랜지션 설정)
│   │       └── ssgoi-transition.tsx  # 페이지 애니메이션 래퍼
│   │
│   ├── svelte/              # Svelte 통합 패키지
│   │   └── src/lib/
│   │       ├── index.ts
│   │       ├── context.ts           # Svelte context 활용
│   │       ├── ssgoi.svelte        # Provider 컴포넌트 (트랜지션 설정)
│   │       └── ssgoi-transition.svelte  # 페이지 애니메이션 래퍼
│   │
│   └── [TODO] 다른 프레임워크들
│       ├── vue/             # Vue 지원 (예정)
│       ├── solid/           # SolidJS 지원 (예정)
│       └── qwik/            # Qwik 지원 (예정)
│
├── apps/                    # 데모 애플리케이션 (모노레포 워크스페이스)
│   ├── react-demo/          # React 데모 앱
│   └── svelte-demo/         # Svelte 데모 앱
│
└── docs/                    # 문서
```

## 개발 환경 설정

### 필수 요구사항

- Node.js 18 이상
- pnpm 8 이상

### 설치 및 빌드

```bash
# 저장소 클론
git clone https://github.com/meursyphus/ssgoi.git
cd ssgoi

# 의존성 설치
pnpm install

# 전체 빌드
pnpm build

# 특정 패키지 빌드
pnpm --filter @ssgoi/core build
pnpm --filter @ssgoi/react build
pnpm --filter @ssgoi/svelte build

# 데모 앱 실행
pnpm --filter react-demo dev
pnpm --filter svelte-demo dev
```

### 모노레포 구조의 장점

이 프로젝트는 pnpm workspace를 사용한 모노레포로 구성되어 있습니다:

- **빌드 없이 코드 참조 가능**: 데모 앱에서 패키지 코드를 직접 참조하므로 빌드 과정 없이 즉시 변경사항 확인 가능
- **일관된 의존성 관리**: 모든 패키지가 동일한 버전의 의존성 사용
- **병렬 개발**: 여러 패키지를 동시에 개발하고 테스트 가능

## 아키텍처 이해하기

### Core 패키지 핵심 구성요소

#### 1. Animator 클래스 (`animator.ts`)

스프링 물리 기반 애니메이션 엔진입니다. Runge-Kutta 4차 적분을 사용하여 부드러운 애니메이션을 구현합니다.

```typescript
class Animator {
  constructor(options: Partial<AnimationOptions>)
  
  // 애니메이션을 앞으로 진행 (from → to)
  forward(): void
  
  // 애니메이션을 뒤로 진행 (to → from)
  backward(): void
  
  // 애니메이션 중지
  stop(): void
  
  // 현재 값 가져오기
  getCurrentValue(): number
  
  // 현재 속도 가져오기
  getVelocity(): number
  
  // 애니메이션 진행 중인지 확인
  getIsAnimating(): boolean
  
  // 현재 상태 가져오기 (위치와 속도)
  getCurrentState(): { position: number; velocity: number }
  
  // 값 설정 (상태 전송 시 사용)
  setValue(value: number): void
  
  // 속도 설정 (상태 전송 시 사용)
  setVelocity(velocity: number): void
  
  // 현재 상태로부터 새 애니메이션 생성
  static fromState(state: { position: number; velocity: number }, newOptions: Partial<AnimationOptions>): Animator
}
```

**핵심 특징:**
- 속도 보존: 애니메이션이 중단되어도 현재 속도를 유지
- 부드러운 전환: 방향이 바뀌어도 자연스러운 감속/가속
- 정확한 물리 시뮬레이션: RK4 적분으로 정확한 스프링 동작

#### 2. 트랜지션 컨텍스트 (`create-ssgoi-transition-context.ts`) 

함수명 주의: `createSggoiTransitionContext` (중간에 'g'가 하나만 있음)

페이지 간 트랜지션을 관리하는 중앙 시스템입니다. 경로 기반으로 적절한 트랜지션을 반환합니다.

```typescript
// SsgoiConfig 타입 정의
type SsgoiConfig = {
  transitions: {
    from: string;    // 출발 경로 (예: "/home")
    to: string;      // 도착 경로 (예: "/about", 와일드카드 지원: "/products/*")
    transition: Transition;
  }[];
  defaultTransition?: Transition;  // 매칭되는 트랜지션이 없을 때 사용
};

// SsgoiContext 타입 정의 (함수 반환 타입)
type SsgoiContext = (path: string) => Transition & { key: TransitionKey };

// 사용 예시
const ssgoiConfig: SsgoiConfig = {
  transitions: [
    { from: "/home", to: "/about", transition: slideLeft() },
    { from: "/about", to: "/home", transition: slideRight() },
    { from: "/products", to: "/products/*", transition: fade() }
  ],
  defaultTransition: fade()
};
```

**동작 원리:**
1. Context는 현재 경로를 받아 적절한 트랜지션 반환
2. 페이지 전환 시 OUT/IN 애니메이션 자동 조율
3. 경로 매칭 우선순위: 정확한 매칭 → 와일드카드 → 기본값

#### 3. 트랜지션 콜백 (`create-transition-callback.ts`)

실제 DOM 애니메이션을 처리하는 핵심 로직입니다. 각 DOM 요소의 애니메이션 상태를 관리하고, 중단 시 자연스러운 전환을 보장합니다.

```typescript
function createTransitionCallback(
  getTransition: () => Transition,
  options?: {
    onCleanupEnd?: () => void;
  }
): TransitionCallback

// TransitionCallback 타입
type TransitionCallback = (element: HTMLElement | null) => void | (() => void);
```

**4가지 시나리오 처리:**
1. **Fresh IN**: 새로운 요소가 나타남
   - 요소가 처음 DOM에 추가될 때
   - 0에서 1로 애니메이션 진행
   
2. **Fresh OUT**: 요소가 사라짐 
   - DOM 복제본을 생성하여 원본 요소는 즉시 제거
   - 복제본에서 애니메이션 실행 (레이아웃 shift 방지)
   
3. **IN → OUT**: 나타나는 중에 사라지기 시작
   - 현재 진행 중인 IN 애니메이션의 상태를 가져옴
   - 그 지점에서 역방향으로 부드럽게 전환
   
4. **OUT → IN**: 사라지는 중에 다시 나타남
   - 현재 진행 중인 OUT 애니메이션의 상태를 가져옴
   - 그 지점에서 정방향으로 부드럽게 전환

#### 4. 트랜지션 매니저 (`transition.ts`)

프레임워크 독립적인 트랜지션 함수를 제공합니다.

```typescript
// 트랜지션 함수 - ref로 사용 가능
export function transition(options: {
  key: TransitionKey;  // string | symbol
  in?: GetTransitionConfig;
  out?: GetTransitionConfig;
}): TransitionCallback

// GetTransitionConfig 타입
type GetTransitionConfig = (node: HTMLElement) => TransitionConfig | Promise<TransitionConfig>;
```

**주요 역할:**
- 각 애니메이션의 현재 상태(진행률, 속도, 방향) 저장
- 애니메이션 중단 시 상태 전달을 위한 조회
- 메모리 누수 방지를 위한 정리

#### 5. Transition 타입 정의

```typescript
// Transition 설정 타입
type Transition = {
  in?: (element: HTMLElement) => TransitionConfig | Promise<TransitionConfig>;
  out?: (element: HTMLElement) => TransitionConfig | Promise<TransitionConfig>;
};

type TransitionConfig = {
  spring?: { stiffness: number; damping: number };  // 기본값: { stiffness: 300, damping: 30 }
  tick?: (progress: number) => void;                // 매 프레임 실행 (progress: 0-1)
  prepare?: (element: HTMLElement) => void;         // 애니메이션 시작 전 실행
  onStart?: () => void;                            // 애니메이션 시작 시
  onEnd?: () => void;                              // 애니메이션 종료 시
};
```

#### 6. 트랜지션 프리셋

SSGOI는 두 가지 트랜지션 프리셋을 제공합니다:

**a) 개별 요소 트랜지션 (`transitions/`)**
- 용도: 컴포넌트 내 개별 요소 애니메이션
- 특징: 요소의 자연스러운 흐름 유지
- 프리셋: fade, scale, slide, rotate, bounce, blur

**b) 페이지 전환 트랜지션 (`view-transitions/`)**
- 용도: 전체 페이지/뷰 전환
- 특징: `prepareOutgoing`으로 absolute 포지셔닝 적용
- 프리셋: fade (추가 예정)

```typescript
// view-transitions/utils.ts
export function prepareOutgoing(element: HTMLElement) {
  element.style.position = "absolute";
  element.style.width = "100%";
  element.style.top = "0";
  element.style.left = "0";
  // 나가는 페이지를 absolute로 만들어
  // 들어오는 페이지가 자연스럽게 자리를 차지하도록 함
}
```

### 프레임워크별 통합 방법

각 프레임워크는 Core 패키지를 래핑하여 프레임워크에 맞는 API를 제공합니다.

#### React 통합

```typescript
// 1. Provider 컴포넌트 (Ssgoi)
// 트랜지션 설정을 제공하는 최상위 컴포넌트
export const Ssgoi: React.FC<SsgoiProps> = ({ config, children }) => {
  const contextValue = useMemo<SsgoiContext>(
    () => createSggoiTransitionContext(config),  // 주의: Sggoi (g 하나)
    [config]
  );
  
  return <SsgoiProvider value={contextValue}>{children}</SsgoiProvider>;
};

// 2. 페이지 애니메이션 래퍼 (SsgoiTransition)
// 페이지 전체에 트랜지션을 적용하는 컴포넌트
export const SsgoiTransition = ({ children, id }: { children: ReactNode; id: string }) => {
  const getTransition = useSsgoi();  // context에서 트랜지션 getter 가져오기
  
  return (
    <div ref={transition(getTransition(id))} data-ssgoi-transition={id}>
      {children}
    </div>
  );
};

// 3. 개별 요소 트랜지션 (ref 사용)
<div ref={transition({
  key: 'fade',
  in: (element) => ({ /* ... */ }),
  out: (element) => ({ /* ... */ })
})}>
  {/* 컨텐츠 */}
</div>
```

#### Svelte 통합

```typescript
// 1. Provider 컴포넌트 (Ssgoi.svelte)
<script lang="ts">
  import type { SsgoiConfig } from './types';
  import { setSsgoiContext } from './context';
  import { createSggoiTransitionContext } from '@ssgoi/core';
  
  interface Props {
    config: SsgoiConfig;
    children: () => any;
  }
  
  let { config, children }: Props = $props();
  
  const contextValue = createSggoiTransitionContext(config);  // 주의: Sggoi (g 하나)
  setSsgoiContext(contextValue);
</script>

{@render children()}

// 2. Action 함수 (use:transition)
export const transition = (
  node: HTMLElement,
  params: Transition & { key: TransitionKey }
) => {
  let callback = _transition({
    key: params.key,
    in: params.in,
    out: params.out,
  });
  let cleanup = callback(node);
  
  return {
    update(newParams: Transition & { key: TransitionKey }) {
      callback = _transition({
        key: newParams.key,
        in: newParams.in,
        out: newParams.out,
      });
      cleanup = callback(node);
    },
    destroy() {
      cleanup?.();
    },
  };
};
```

## 새로운 프레임워크 지원 추가하기

### 예: SolidJS 지원 추가

1. **패키지 생성**
```bash
mkdir packages/solid
cd packages/solid
pnpm init
```

2. **필수 구현 사항**

```typescript
// packages/solid/src/lib/index.ts
export { createSsgoiContext } from './context';
export { Ssgoi } from './ssgoi';
export { SsgoiTransition } from './ssgoi-transition';
export { transition } from './transition';
```

3. **Context 구현**
```typescript
// context.ts
import { createContext } from 'solid-js';
import { createSggoiTransitionContext } from '@ssgoi/core';  // 주의: Sggoi (g 하나)

export const SsgoiContext = createContext<ReturnType<typeof createSggoiTransitionContext>>();
```

4. **Provider 컴포넌트**
```typescript
// ssgoi.tsx
import { SsgoiContext } from './context';

export function Ssgoi(props: { config: SsgoiConfig; children: JSX.Element }) {
  const context = createSggoiTransitionContext(props.config);  // 주의: Sggoi (g 하나)
  
  return (
    <SsgoiContext.Provider value={context}>
      {props.children}
    </SsgoiContext.Provider>
  );
}
```

5. **Transition 통합**
```typescript
// transition.ts
export function transition(element: HTMLElement, accessor: () => TransitionParams) {
  const params = accessor();
  const cleanup = createTransitionCallback(params.key, element, params);
  
  onCleanup(() => cleanup());
}
```

### 체크리스트

- [ ] Core 패키지 import 및 타입 정의
- [ ] Context/Store 시스템 구현
- [ ] Provider 컴포넌트 구현
- [ ] DOM 바인딩 메커니즘 구현 (ref, directive, action 등)
- [ ] 라이프사이클 통합 (cleanup 처리)
- [ ] TypeScript 타입 정의
- [ ] 빌드 설정 (vite.config.ts)
- [ ] package.json 설정
- [ ] 데모 앱 생성
- [ ] 문서 작성

## 데모 페이지 만들기

### 기본 구조

모든 데모 페이지는 다음 요소를 포함해야 합니다:

1. **개별 요소 트랜지션 예제**
   - Fade, Scale, Slide, Rotate 등
   - 인터랙티브한 스프링 설정 조절
   - 실시간 미리보기

2. **페이지 트랜지션 예제**
   - 라우팅 통합
   - SsgoiTransition 컴포넌트 사용
   - 여러 페이지 간 전환

3. **코드 예제**
   - 사용법을 보여주는 코드 스니펫
   - 복사 가능한 예제 코드

### 트랜지션 사용 구분

#### 개별 요소 애니메이션 (transition 함수)
모달, 카드, 버튼 등 개별 컴포넌트에 사용:

```jsx
// React
{show && (
  <div ref={transition({
    key: 'modal',
    in: (el) => ({ /* fade in */ }),
    out: (el) => ({ /* fade out */ })
  })}>
    모달 내용
  </div>
)}

// Svelte
{#if show}
  <div use:transition={{
    key: 'modal',
    in: (el) => ({ /* fade in */ }),
    out: (el) => ({ /* fade out */ })
  }}>
    모달 내용
  </div>
{/if}
```

#### 페이지 전환 애니메이션 (SsgoiTransition)
전체 페이지 콘텐츠에 사용:

```jsx
// React
<SsgoiTransition id="/demo/about">
  <div className="page-content">
    <h1>About Page</h1>
    {/* 페이지 전체 내용 */}
  </div>
</SsgoiTransition>

// Svelte
<SsgoiTransition id="/demo/about">
  <div class="page-content">
    <h1>About Page</h1>
    {/* 페이지 전체 내용 */}
  </div>
</SsgoiTransition>
```

### 애니메이션 동작 원리 (ASCII 도식)

#### 일반적인 페이지 전환
```
시간 →
[Page A]━━━━━━━━━━┓
                   ┗━━━━━━ [사라짐]
                   ┏━━━━━━ [나타남]
[Page B]           ┗━━━━━━━━━━━━━━━

문제: A가 사라지면서 B가 나타날 때 레이아웃이 깨짐
```

#### SSGOI의 해결책
```
시간 →
[Page A]━━━━━━━━━━┓
                   ┗━━━━━━ [absolute로 복제본 생성 → fade out]
                   ┏━━━━━━ [자연스럽게 자리 차지 → fade in]
[Page B]           ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

장점: 레이아웃 shift 없이 부드러운 전환
```

#### 애니메이션 인터럽트 처리
```
일반 애니메이션:
Progress: 0 ────────── 0.7 ━━━━━━━━━━━ 1
                         ↑ 
                    방향 전환 시
                         ↓
          0 ━━━━━━━━━━━━━━━━━━━━━━━━━ 1 (처음부터 다시)

SSGOI 애니메이션:
Progress: 0 ────────── 0.7 ━━━━━━━━━━━ 1
                         ↑
                    방향 전환 시  
                         ↓
          0 ━━━━━━━━━ 0.7 ────────── 1 (현재 위치에서 역방향)
                       ↑
                  속도도 유지됨
```

#### 스프링 물리 시각화
```
일반 easing:
┌─────────────────────────┐
│     ╱─────              │  선형적이고 기계적
│   ╱                     │
│ ╱                       │
└─────────────────────────┘

스프링 애니메이션:
┌─────────────────────────┐
│       ╱~╲               │  자연스러운 바운스
│     ╱    ╲_╱╲           │  물리 법칙 기반
│   ╱          ───        │  
└─────────────────────────┘
```

### React 데모 예제

```typescript
// apps/react-demo/app/demo/layout.tsx
const ssgoiConfig: SsgoiConfig = {
  transitions: [],
  defaultTransition: {
    in: async (element) => ({
      spring: { stiffness: 300, damping: 150 },
      tick: (progress) => {
        element.style.opacity = progress.toString();
      }
    }),
    out: async (element) => ({
      spring: { stiffness: 300, damping: 150 },
      tick: (progress) => {
        element.style.opacity = progress.toString();
      },
      prepare: (element) => {
        // 중요: absolute positioning으로 레이아웃 shift 방지
        element.style.position = "absolute";
        element.style.width = "100%";
        element.style.top = "0";
        element.style.left = "0";
      }
    })
  }
};

export default function DemoLayout({ children }) {
  return (
    <Ssgoi config={ssgoiConfig}>
      <div style={{ position: 'relative' }}> {/* 중요: relative container */}
        {children}
      </div>
    </Ssgoi>
  );
}
```

### Svelte 데모 예제

```svelte
<!-- apps/svelte-demo/src/routes/demo/+layout.svelte -->
<script lang="ts">
  import { Ssgoi } from '@ssgoi/svelte';
  
  const ssgoiConfig = {
    // 위와 동일한 설정
  };
</script>

<div class="demo-container">
  <nav>
    <a href="/demo">Home</a>
    <a href="/demo/about">About</a>
  </nav>
  
  <div class="content-wrapper">
    <Ssgoi config={ssgoiConfig}>
      {#snippet children()}
        <div class="content-container">
          <slot />
        </div>
      {/snippet}
    </Ssgoi>
  </div>
</div>

<style>
  .content-container {
    position: relative; /* 중요! */
  }
</style>
```

## 향후 개발 로드맵 (Linear 이슈 기반)

### 🚀 우선순위 높음

#### Hero View-Transition 구현 (SSG-26)
```
┌─────────┐         ┌─────────────┐
│ List    │   →→→   │   Detail    │
│ ┌─────┐ │         │ ┌─────────┐ │
│ │thumb│━━━━━━━━━━━▶│  image   │ │  썸네일이 확대되며 변환
│ └─────┘ │         │ └─────────┘ │
└─────────┘         └─────────────┘
```
- 공유 요소의 위치/크기 계산 및 morph 애니메이션
- 스크롤 위치 기억 및 복원 기능 포함

#### 빠른 전환 시 상태 관리 (SSG-28)
- 현재: 하나의 pendingTransition만 관리
- 개선: Queue 또는 Map으로 여러 트랜지션 동시 관리
- 메모리 누수 방지 로직 추가

#### requestAnimationFrame 최적화 (SSG-12)
```javascript
// 현재: 각 애니메이션이 개별 rAF 호출
animator1.update() → requestAnimationFrame()
animator2.update() → requestAnimationFrame()

// 개선: 싱글톤 매니저로 통합
AnimationManager.register(animator1)
AnimationManager.register(animator2)
→ 하나의 requestAnimationFrame()
```

### 🎯 중간 우선순위

#### Pinterest 스타일 트랜지션 (SSG-27)
```
클릭 전:              클릭 후:
┌─┬─┬─┐              ┌─────────┐
│1│2│3│     →→→      │    2    │  카드가 확대되며
├─┼─┼─┤              │         │  주변은 fade out
│4│5│6│              └─────────┘
└─┴─┴─┘
```

#### Scope 기능 구현 (SSG-11)
- `local`: 같은 컴포넌트 내에서만 애니메이션
- `global`: 다른 컴포넌트 간에도 연결
- Svelte의 transition:local|global과 유사

#### SSR 지원 (SSG-13)
```typescript
// 서버 환경 감지 및 애니메이션 무시
if (typeof window === 'undefined') {
  return { destroy: () => {} };
}
```

### 📚 문서 및 개선

- 일관된 데모 페이지 구조 (SSG-21)
- API 문서 개선 (SSG-15)
- 각 프레임워크별 데모 개선 (SSG-22, SSG-23)

### 🔧 프레임워크 확장

추가 예정인 프레임워크들:
- Vue 3 (Composition API)
- SolidJS 
- Qwik
- Angular (검토 중)

각 프레임워크는 Core를 기반으로 하며, 프레임워크별 특성에 맞춰 구현됩니다.

## 코드 스타일 가이드

### TypeScript

- 명시적 타입 선언 권장
- `any` 타입 사용 금지
- 인터페이스는 `I` 접두사 없이 작성

```typescript
// ✅ Good
interface SpringConfig {
  stiffness: number;
  damping: number;
}

// ❌ Bad
interface ISpringConfig {
  stiffness: any;
  damping: any;
}
```

### 네이밍 규칙

- 파일명: kebab-case (`create-transition-callback.ts`)
- 클래스: PascalCase (`Animator`)
- 함수/변수: camelCase (`createTransition`)
- 상수: UPPER_SNAKE_CASE (`SSGOI_CONTEXT_KEY`)

### 주석

- 복잡한 로직에는 설명 추가
- JSDoc으로 public API 문서화
- TODO 주석에는 이슈 번호 포함

```typescript
/**
 * 스프링 기반 애니메이션을 생성합니다.
 * @param element - 애니메이션할 DOM 요소
 * @param config - 스프링 설정
 * @returns cleanup 함수
 */
export function createSpringAnimation(
  element: HTMLElement,
  config: SpringConfig
): () => void {
  // TODO(SSG-12): requestAnimationFrame 최적화 필요
  // ...
}
```

## 디버깅 팁

### 애니메이션이 동작하지 않을 때

1. **data-ssgoi-transition 속성 확인**
   - 브라우저 개발자 도구에서 요소에 `data-ssgoi-transition` 속성이 있는지 확인
   - 이 속성이 있으면 트랜지션이 등록된 것

2. **페이지 새로고침 시 IN 애니메이션 미동작**
   ```typescript
   // 알려진 이슈: 페이지 새로고침 시 이전 페이지가 없어 OUT이 없음
   // 따라서 IN 애니메이션도 실행되지 않음
   // 해결책: defaultTransition에서 IN만 정의하거나 별도 처리
   ```

3. **Console 로그 활용**
   ```typescript
   // create-transition-callback.ts에 로그 추가
   console.log('Transition state:', { key, direction, hasExisting });
   ```

### 레이아웃 문제 해결

```css
/* 부모 컨테이너는 반드시 relative */
.content-container {
  position: relative;
  min-height: 400px; /* 높이 확보 */
}

/* OUT 애니메이션 시 absolute 처리됨 */
[data-ssgoi-transition] {
  /* 자동으로 처리되므로 수동 설정 불필요 */
}
```

## 개발 팁

### 모노레포에서 실시간 개발

```bash
# 패키지 watch 모드
pnpm --filter @ssgoi/core dev

# 데모 앱 실행 (별도 터미널)
pnpm --filter react-demo dev

# 코드 수정 시 자동 반영됨
```

### 새로운 트랜지션 만들기

```typescript
// packages/core/src/lib/transitions/my-transition.ts
export const myTransition = (options = {}) => ({
  in: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      // progress: 0 → 1
      element.style.transform = `scale(${progress})`;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      // progress: 1 → 0 (주의!)
      element.style.transform = `scale(${progress})`;
    }
  })
});
```

## 기여자 행동 강령

- 서로 존중하고 건설적인 피드백 제공
- 다양성과 포용성 존중
- 문제 해결에 집중
- 커뮤니티 가이드라인 준수

## 도움 요청

- GitHub Issues: 버그 리포트, 기능 제안
- Discussions: 일반적인 질문, 아이디어 논의
- Linear: 프로젝트 관리 및 작업 추적

프로젝트에 기여해주셔서 감사합니다! 🎉