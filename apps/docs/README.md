# SSGOI 문서

> 웹에서 네이티브 앱과 같은 자연스러운 페이지 전환 애니메이션을 구현하는 라이브러리

## 왜 Page Transition인가?

### 🚀 웹에서 앱과 같은 경험을 제공하세요

웹 애플리케이션에 자연스러운 페이지 전환 애니메이션을 추가하면:
- **사용자 경험 극대화**: 페이지 이동 시 끊김 없는 부드러운 전환으로 프리미엄 UX 제공
- **웹뷰로도 네이티브 앱처럼**: 모바일 웹뷰에서도 네이티브 앱과 구분되지 않는 자연스러운 동작
- **브랜드 아이덴티티 강화**: 독특한 전환 효과로 서비스만의 개성 표현

### 🎯 View Transition API의 한계를 넘어서

브라우저 기본 View Transition API는:
- ❌ 제한적인 브라우저 지원 (Chrome 111+만 지원)
- ❌ 복잡한 애니메이션 구현의 어려움
- ❌ 세밀한 제어 불가능

SSGOI는:
- ✅ 모든 모던 브라우저 지원
- ✅ Spring 물리 기반의 자연스러운 애니메이션
- ✅ 간단한 설정으로 다양한 전환 효과 구현

### ⚡ 간편한 적용과 제거

```jsx
// 단 한 줄로 페이지 전환 애니메이션 적용
<SsgoiTransition id="/home">
  <YourPage />
</SsgoiTransition>
```

### 🌐 웹 프레임워크의 라우팅을 그대로 활용

- 기존 라우팅 로직 변경 없이 애니메이션만 추가
- React Router, Next.js App Router 등 모든 라우팅 시스템과 호환
- 필요할 때만 선택적으로 애니메이션 적용

### 🚄 SSR 최적화

- **Next.js에서 완벽하게 작동**: SSR/SSG 환경에서도 문제없이 동작
- 서버 사이드 렌더링 시 애니메이션으로 인한 성능 저하 없음
- SEO 친화적 - 검색 엔진은 원본 콘텐츠를 그대로 인식

## 🛠️ 프레임워크 지원

### 공식 지원
- **React** (16.8+)
- **Svelte** (3.0+)

### Framework Agnostic 설계
SSGOI는 프레임워크 독립적으로 설계되어 다음 프레임워크들도 지원합니다:
- Vue.js
- SolidJS
- Qwik
- Vanilla JavaScript

## 📦 설치하기

### React
```bash
npm install @meursyphus/ssgoi-react
```

### Svelte
```bash
npm install @meursyphus/ssgoi-svelte
```

### 기본 사용법

#### 1. Provider 설정
```jsx
import { Ssgoi } from '@meursyphus/ssgoi-react';
import { fade } from '@meursyphus/ssgoi-react/view-transitions';

function App() {
  return (
    <Ssgoi config={{
      defaultTransition: fade()
    }}>
      <div style={{ position: 'relative' }}> {/* 중요: relative 필수 */}
        {/* 앱 콘텐츠 */}
      </div>
    </Ssgoi>
  );
}
```

#### 2. 페이지 전환 적용
```jsx
import { SsgoiTransition } from '@meursyphus/ssgoi-react';

function HomePage() {
  return (
    <SsgoiTransition id="/home">
      <div>홈 페이지 콘텐츠</div>
    </SsgoiTransition>
  );
}

function AboutPage() {
  return (
    <SsgoiTransition id="/about">
      <div>소개 페이지 콘텐츠</div>
    </SsgoiTransition>
  );
}
```

## 📚 Export 구조

SSGOI는 용도에 따라 구분된 모듈을 제공합니다:

### `/view-transitions` - 페이지 전환 프리셋
```jsx
import { fade, slide, scale } from '@meursyphus/ssgoi-react/view-transitions';
```

### `/transitions` - DOM 요소 애니메이션
```jsx
import { fadeIn, slideUp } from '@meursyphus/ssgoi-react/transitions';
```

### `/easing` - 이징 함수
```jsx
import { easeInOut, spring } from '@meursyphus/ssgoi-react/easing';
```

### `/types` - TypeScript 타입 정의
```typescript
import type { TransitionConfig, SpringConfig } from '@meursyphus/ssgoi-react/types';
```

## 🎨 다양한 전환 효과

### 기본 제공 효과들
- **fade**: 부드러운 페이드 인/아웃
- **slide**: 좌우/상하 슬라이드
- **scale**: 확대/축소 효과
- **flip**: 3D 플립 효과
- **morph**: 요소 간 변형 효과

### 커스텀 효과 만들기
```jsx
const customTransition = {
  in: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.transform = `translateY(${(1 - progress) * 50}px)`;
      element.style.opacity = progress;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      // 주의: out에서 progress는 1 → 0으로 진행
      element.style.transform = `translateY(${(1 - progress) * -50}px)`;
      element.style.opacity = progress;
    }
  })
};
```

## 🔬 API 상세

### DOM Transition
개별 DOM 요소에도 애니메이션을 적용할 수 있습니다:

```jsx
import { transition } from '@meursyphus/ssgoi-react';

function Component() {
  const [show, setShow] = useState(true);
  
  return (
    <>
      {show && (
        <div ref={transition({ key: 'item', ...fadeConfig })}>
          애니메이션이 적용될 요소
        </div>
      )}
    </>
  );
}
```

### Progress 방향
- **in 애니메이션**: progress가 0 → 1로 진행 (요소가 나타날 때)
- **out 애니메이션**: progress가 1 → 0으로 진행 (요소가 사라질 때)

이는 애니메이션 중단 시 자연스러운 연속성을 보장합니다.

### Spring 물리 엔진

SSGOI는 스프링 물리 기반 애니메이션을 사용합니다:

- **stiffness** (강성): 스프링의 단단함 (1-1000)
  - 높을수록 빠르고 탄력적인 움직임
  - 낮을수록 느리고 부드러운 움직임
  
- **damping** (감쇠): 진동을 억제하는 정도 (0-100)
  - 높을수록 빠르게 안정화
  - 낮을수록 더 많이 진동

```jsx
// 빠르고 탄력적인 애니메이션
spring: { stiffness: 800, damping: 20 }

// 부드럽고 느린 애니메이션
spring: { stiffness: 200, damping: 40 }
```

## 🎓 심화 개념

### 라이브러리의 핵심 원리

SSGOI는 DOM 요소의 생명주기를 관리하여:
1. 요소가 사라질 때도 애니메이션이 완료될 때까지 DOM에 유지
2. 새로운 요소와 사라지는 요소의 애니메이션을 동시에 제어
3. 애니메이션 중단 시 현재 상태에서 자연스럽게 전환

### Position 관리

페이지 전환 시 요소들이 겹치도록 하기 위해:

```jsx
// Ssgoi wrapper는 반드시 relative position 필요
<Ssgoi>
  <div style={{ position: 'relative' }}>
    {/* 콘텐츠 */}
  </div>
</Ssgoi>
```

out 애니메이션 시 자동으로 `position: absolute`가 적용되어 새로운 페이지와 겹쳐서 전환됩니다.

### Prepare 함수

애니메이션 시작 전 요소를 준비하는 단계:

```jsx
const transition = {
  prepare: (element) => {
    // 애니메이션 시작 전 설정
    element.style.transformOrigin = 'center';
  },
  in: (element) => ({
    // 애니메이션 설정
  })
};
```

## 🚀 시작하기

1. [설치 가이드](/docs/installation)
2. [빠른 시작](/docs/quick-start)
3. [예제 모음](/docs/examples)
4. [API 레퍼런스](/docs/api)

## 💬 커뮤니티

- [GitHub Issues](https://github.com/meursyphus/ssgoi/issues)
- [Discord](https://discord.gg/ssgoi)
- [Twitter](https://twitter.com/ssgoi)

## 📄 라이선스

MIT