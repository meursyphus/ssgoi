# 라우터 도우미의 소스와 문서 구성

## 결정

SSGOI는 렌더링 프레임워크별 기본 패키지를 유지한다. 라우터 연결 도우미는
같은 패키지의 하위 경로로 제공하며, 별도 공개 패키지나 내부 작업공간 패키지를
추가하지 않는다. 개발 의존성도 해당 프레임워크 패키지에 모은다.

```tsx
import { Ssgoi } from "@ssgoi/react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
```

기본 패키지의 공통 API를 통해 새 라우터에도 직접 연결할 수 있다. 도우미는
현재 경로와 페이지 수명을 연결하는 편의 기능이며, 라우터별 전환 엔진이 아니다.

## 코드 구성

React는 `src/`에 공통 구현을 두고 `src/routers/`에 Next.js, Remix,
React Router, TanStack Router 도우미를 둔다. Next.js 보조 함수는 같은 폴더에
묶는다. 공통 진입점에서 라우터를 가져오지 않도록 린트 규칙과 소비자 검사를 둔다.

Svelte, Vue, Solid, Qwik은 기존 라이브러리 도구의 `src/lib` 관례를 유지하면서
그 아래 `routers/`로 모은다. React Native는 `src/routers/`를 사용한다.
Angular는 ng-packagr가 요구하는 보조 진입점 구조에 따라 `router/src/`를 사용한다.
모두 같은 프레임워크 패키지에 포함되어 배포된다.

추가한 연동은 Remix 2, Solid Router, Qwik City, Angular Router다. 기존
Next.js, React Router, TanStack Router, SvelteKit, Vue Router, Nuxt,
SolidStart, Expo Router 경로도 유지한다. TanStack Start는 TanStack Router의
연동을 사용한다.

Qwik은 슬롯 소유권을 보존하도록 페이지 루트에 적용할 id/key를 제공하는 훅을
사용한다. Angular는 경로가 달라질 때 삽입 템플릿을 교체하는 지시문을 제공한다.
모든 프레임워크에 같은 모양의 래퍼를 강제하지 않는다.

## 의존성과 공개 상태

라우터 패키지는 개발·테스트 의존성이며, 배포물에서는 선택적인 peer dependency로
선언하고 번들에서 제외한다. 하위 경로별 조건부 설치 요구는 npm이 표현하지
못하므로, 기본 패키지를 사용하는 앱의 라우터 버전을 불필요하게 제한하지 않는
넓은 선택 의존성 범위를 유지한다. 실제 지원·검증 범위는 각 안내에 적는다.

Next.js를 제외한 모든 라우터 도우미에 `@experimental` 주석을 달고, 생성된
타입 선언에도 보존되는지 검사한다. Next.js에는 이 주석을 달지 않는다.

React 개발 런타임은 Remix 2와도 맞는 React 18.3.1을 사용한다. React 19 소비자도
별도 템플릿 빌드로 확인한다. Angular 개발 패키지는 20.3.9로 맞춘다.

## 문서 구성

문서는 React, Svelte, Vue, Solid, Qwik, Angular, React Native 페이지로 묶는다.
각 페이지에서 공통 사용법을 먼저 설명하고 라우터별 연결을 하위 절로 제공한다.
기존 라우터 페이지 주소는 해당 프레임워크 페이지의 절로 연결한다.

실험적 표시는 문서 본문의 작은 문구로만 제공한다. 데스크톱과 모바일 사이드바의
항목 이름에는 Experimental 또는 Preview를 넣지 않는다. 프레임워크의 공통 API
전체와 라우터 도우미의 상태도 구분한다.

직접 바운더리를 만드는 일반적인 방법은 웹 문서의 Route boundaries에 둔다.
`llms.txt`는 Next.js App Router를 가정한 최소 예제와 필요한 상세 링크로 제한하고,
직접 바운더리를 만드는 가이드는 메인 파일에서 노출하지 않는다.
현재 버전 표기는 유지하며, 버전을 올릴 때는 실제 패키지와 함께 갱신한다.

## 판단 근거와 한계

- [Redux Toolkit](https://redux-toolkit.js.org/rtk-query/overview)은 같은 패키지의
  하위 경로로 공통 기능과 React 연동을 구분한다. [의존성 선언](https://github.com/reduxjs/redux-toolkit/blob/master/packages/toolkit/package.json)도
  선택적인 React 의존성을 사용한다. 이것은 하위 경로의 사례이며, 별도 내부
  작업공간 패키지를 합치는 사례로 인용한 것은 아니다.
- [Sentry의 Next.js 패키지](https://github.com/getsentry/sentry-javascript/blob/develop/packages/nextjs/src/client/index.ts)는
  React API를 재노출하는 방식이 가능함을 보여준다. 하지만 서버·엣지·빌드 설정까지
  연결하는 Sentry의 역할은 SSGOI의 작은 웹 바운더리보다 크다.
- [Motion의 재노출 코드](https://github.com/motiondivision/motion/blob/main/packages/motion/src/react.ts)는
  특정 재노출 구문 때문에 번들러 문제가 생겼던 수정 이유를 기록한다. 얇은
  진입점도 검증 비용이 존재한다는 사례이며 재노출 전체가 나쁘다는 증거는 아니다.

현재 작은 도우미들을 각각 패키지로 나누면 설정·빌드·타입·배포물 관리가 더
늘어난다. 의존성 충돌이나 독립 개발 필요가 커질 때 분리를 재검토할 수 있다.
이번 변경을 설치 크기나 속도의 개선이라고 주장하지 않는다.

## 검증 범위

- 기본 패키지 빌드와 기존 경로·화면 수명 테스트.
- 실제 배포 파일의 공개 경로 존재 여부와 실험적 주석 검사.
- 라우터가 없는 소비자에서 기본 패키지 설치·타입·번들 검사.
- 실제 Remix 라우터와 React 18 조합의 이동, 쿼리 변경, 이전 DOM 보존 검사.
- Next.js·React Router·TanStack Router·Qwik 템플릿 및 문서 프로덕션 빌드.
- 브라우저에서 문서 이동, 작은 본문 표시, 모바일 메뉴, Qwik 페이지 교체 검사.
- Expo iOS 번들 생성과 네이티브 패키지의 독립성 검사.

Qwik 1.20.0의 외부 타입 선언에는 잘못된 ambient 구문이 있어 해당 소비자 검사는
공식 템플릿처럼 외부 선언 검사를 건너뛴다. 애플리케이션 검사와 설치·번들 격리
검사는 유지한다. 이 검증은 모든 지원 버전이나 실제 네이티브 기기 성능을
보장하지 않는다. 버전 변경과 배포는 수행하지 않는다.
