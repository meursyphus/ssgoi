# 라우터별 패키지 분리 검토

상태: 실험 브랜치에 구현했으며, 공개 API와 설치 방식은 재검토 중이다. 배포하지 않았다.
조사 기준일: 2026-09-13.

## 먼저 전달해야 하는 라이브러리의 성격

SSGOI의 React 기능은 `@ssgoi/react`가 제공한다. Next.js와 TanStack Router
등의 연동 코드는 현재 라우트 정보를 읽어 바운더리에 연결하는 도우미다.
라우터마다 서로 다른 전환 엔진을 제공하는 구조가 아니다.

따라서 사용자가 알아야 할 기본 관계는 다음과 같다.

- `@ssgoi/react`: React 앱에서 사용하는 기본 패키지.
- 라우터별 도우미: 이미 설치한 라우터에 쉽게 연결하기 위한 선택 기능.
- 별도 도우미가 없는 React 라우터: 기본 패키지에 경로와 바운더리를 직접 연결.

`@ssgoi/nextjs` 하나에서 모든 기능을 가져오도록 안내하면 설치는 간단해진다.
하지만 사용자는 이를 “SSGOI의 Next.js 전용 구현”으로 이해할 수 있다.
새로운 React 프레임워크에 대응하는 패키지가 없으면 아직 지원되지 않는다고
판단할 가능성도 있다. 이는 사용자 인식에 관한 설계상 우려이며, 실제 사용자
조사로 확인한 결과는 아니다.

현재 Next.js 도우미의 역할에 비해 전용 패키지가 제품의 중심으로 보이는 것은
과한 구분일 수 있다. 설치 명령 하나를 줄이는 편의뿐 아니라, 기본 패키지로
어디까지 할 수 있는지 드러내는 것도 API 설계의 목표로 삼아야 한다.

## 현재 추천하는 공개 사용 방식

**기본 사용 경로는 `@ssgoi/react`로 유지하고, 라우터 도우미를 선택해서
추가하는 방식이 SSGOI의 성격을 더 잘 전달한다.**

다음은 추천안이며, 현재 실험 코드에는 아직 다시 반영하지 않았다.

```tsx
import { Ssgoi } from "@ssgoi/react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { drill } from "@ssgoi/react/view-transitions";
```

이 예제는 “React 기능을 사용하면서 Next.js 연결 도우미를 추가한다”는 관계를
보여준다. 새 라우터에 대한 설명도 이 관계를 기준으로 작성한다.

문서에서는 공통 구성인 provider, 경로, 바운더리를 먼저 설명하고,
그다음 라우터별 도우미를 소개한다. 도우미가 없는 경우 직접 연결하는 예제를
같은 위치에서 찾을 수 있도록 한다. 일반적인 React DOM 사용 조건을 충족하는지와
바운더리의 수명을 올바르게 연결했는지는 각 라우터에서 확인해야 한다.

## 선택지 비교

| 방식 | 사용자에게 보이는 관계 | 이득 | 비용 |
| --- | --- | --- | --- |
| 기본 패키지 + 하위 경로 도우미 | React 라이브러리에 라우터 연결 기능을 추가 | 기본 패키지의 범용성이 드러나고 설치와 배포 대상이 적음 | 하위 경로를 사용할 때만 의존성을 필수로 요구할 수 없음 |
| 기본 패키지 + 별도 도우미 패키지 | React 라이브러리와 선택적인 연결 도구 | 의존성과 호환 버전을 도우미별로 선언 가능 | 설치 대상과 배포물이 늘어남 |
| 라우터 패키지가 공통 API까지 재노출 | 프레임워크별 완제품처럼 보임 | 앱에서 SSGOI 패키지 하나만 설치하고 가져옴 | 기본 React 패키지의 범용성이 가려질 수 있고 재노출 검증도 필요 |

현재 실험 구현은 세 번째 방식이다. 첫 번째 방식이 공개 API의 기본안으로 더
적합하다는 관점에서 PR을 검토한다. 설치 시 호환 버전 검사가 반드시 필요하다고
판단하는 경우 두 번째 방식을 비교할 수 있다.

## 실제 라이브러리에서 확인한 근거

### Sentry: 공통 API를 포함하는 프레임워크 패키지

`@sentry/nextjs`는 `@sentry/react`에 의존하고 React API를 재노출하면서
Next.js용 기능을 추가하거나 대체한다. Next.js는 필수 peer dependency,
즉 함께 사용하는 앱에 요구하는 의존성으로 선언한다. 내부 SDK 의존성은
같은 정확한 버전으로 맞춘다.

- [패키지 의존성](https://github.com/getsentry/sentry-javascript/blob/develop/packages/nextjs/package.json)
- [React API 재노출 코드](https://github.com/getsentry/sentry-javascript/blob/develop/packages/nextjs/src/client/index.ts)

이 사례는 단일 설치 방식이 기술적으로 가능한 근거다. 다만 Sentry는 서버,
브라우저, 엣지, 계측, 빌드 설정까지 연결한다. 작은 라우트 바운더리를 제공하는
SSGOI가 같은 공개 구분을 가져야 한다는 근거로 쓰기에는 차이가 크다.

### TanStack Query: 내부 계층과 사용자 설치를 분리

`@tanstack/react-query`는 `@tanstack/query-core`에 의존하며 공통 API를
재노출한다. 사용자가 구현 계층을 모두 직접 설치할 필요는 없다.

- [패키지 의존성](https://github.com/TanStack/query/blob/main/packages/react-query/package.json)
- [공개 진입점](https://github.com/TanStack/query/blob/main/packages/react-query/src/index.ts)

다만 이것은 코어와 React 바인딩의 구분이다. React 바인딩을 다시 개별 라우터별
제품처럼 나누는 판단과는 다르다. SSGOI의 기존 `core → react` 구조에도 이미
해당하는 사례다.

### Redux Toolkit: 하위 경로와 선택 의존성도 유효한 대안

Redux Toolkit은 `/query`와 `/query/react`를 같은 패키지에 제공하고,
React와 React Redux를 선택적인 peer dependency로 선언한다.

- [RTK Query 구성 설명](https://redux-toolkit.js.org/rtk-query/overview)
- [패키지 선언](https://github.com/reduxjs/redux-toolkit/blob/master/packages/toolkit/package.json)

이는 기존 SSGOI 방식도 유지 가능한 설계라는 근거다. 패키지 수를 줄이고
기본 라이브러리와 선택 기능의 관계를 드러낼 수 있다. 대신 npm 의존성 선언은
패키지 단위이므로 특정 하위 경로의 사용 여부에 따라 설치 요구를 바꿀 수 없다.

### Motion: 재노출은 가능하지만 검증 비용이 존재

`motion/react`는 framer-motion을 재노출한다. 특정한 이름 지정 재노출과
전체 재노출의 조합 때문에 Turbopack 메모리 문제가 발생하여 수정한 기록이 있다.

- [재노출 코드와 수정 이유](https://github.com/motiondivision/motion/blob/main/packages/motion/src/react.ts)
- [관련 이슈](https://github.com/motiondivision/motion/issues/3741)

재노출 자체가 나쁘거나 일반적으로 메모리 문제를 만든다는 뜻은 아니다.
얇은 진입점도 번들러, 타입 선언, 자동 완성, 모듈 방식에 대한 검증 대상이라는
구체적인 사례다.

## SSGOI에서 얻는 것과 늘어나는 비용

- 기존 웹 바운더리 구현은 Next.js 49줄, React Router 17줄, TanStack Router
  24줄이었다. 패키지 네 개를 추가하면 설정, 공개 경로, 배포물, 테스트 관리
  항목이 작은 구현에 비해 많이 늘어날 수 있다.
- Expo 연동은 `unstable_integrateWithRouter`라는 불안정한 API를 사용한다.
  검증한 Expo Router 56.2.20과의 호환 관계를 따로 선언할 가치는 웹 도우미보다 크다.
- 버전 스크립트는 이미 `packages/*`를 자동 탐색하며, 릴리스도 의존성 순서대로
  빌드하고 배포한다. 패키지 분리가 수동 릴리스 명령을 추가하지는 않지만,
  빌드 시간과 배포 대상은 늘린다.
  [pnpm의 실행 순서](https://pnpm.io/10.x/cli/recursive#--no-sort)
- 함께 배포하더라도 npm에 모든 패키지가 한 번에 원자적으로 등록되는 것은
  아니다. 일부 배포가 실패할 수 있고, 앱이 서로 다른 버전을 섞으면 중복 설치도
  가능하다. 같은 버전 배포만으로 이 문제가 모두 해결되지는 않는다.
- React 패키지의 Babel과 unplugin 설치 의존성은 분리 후에도 남는다.
  라우터 패키지 분리를 설치 용량이나 앱 번들 크기의 개선이라고 설명하면 안 된다.
  이번 검증에서는 용량이나 속도의 전후 차이를 측정하지 않았다.

## 실험 브랜치의 구현 상태

현재 코드는 아래 구조를 시험한다. 최종 공개 API에 대한 확정안이 아니다.

```text
packages/
  core/                 공통 엔진
  react/                공통 React 구현
  nextjs/               React API 재노출 + Next.js 바운더리
  react-router/         React API 재노출 + React Router 바운더리
  tanstack-router/      React API 재노출 + TanStack Router 바운더리
  react-native/         네이티브 렌더링과 재생
  expo-router/          네이티브 API 재노출 + Expo Router 바운더리
```

공통 구현을 복사하거나 어댑터에 다시 번들링하지 않고 내부 패키지에 의존한다.
내부 버전은 `workspace:*`로 맞추며, 배포 파일을 만들 때 정확한 버전으로 변환된다.
[workspace 의존성의 배포 방식](https://pnpm.io/10.x/workspaces#publishing-workspace-packages)

`/types`, `/view-transitions`, 빌드 도구 경로는 각각 유지한다. 컴포넌트의
클라이언트 지시문도 해당 모듈에 남겨서 일반 유틸리티까지 클라이언트 전용으로
바뀌지 않도록 했다. 구현과 함께 사용처, 템플릿, 문서를 변경한 상태다.

이 실험은 기존 라우터 하위 경로를 제거하므로 그대로 채택한다면 메이저 버전
변경이 필요하다. 아직 버전 변경과 배포는 하지 않았다. 최종안을 정한 뒤
버전을 올릴 경우 `apps/docs/public/llms.txt`의 `Current version:`도 함께 바꾼다.

## 완료한 검증과 한계

- 기존 릴리스 빌드 명령으로 배포 대상 12개 패키지 빌드 통과.
- 위치를 옮긴 웹 바운더리 및 네이티브 동작 테스트 47개 통과.
- 각 웹 어댑터의 실제 배포 파일을 임시 소비자 프로젝트에 설치하여 검사.
  SSGOI 직접 설치 대상은 어댑터 하나로 두고, 필수 라우터 의존성, 공통 API의
  객체 동일성, 하위 경로 전달, 엄격한 타입 검사, 앱 번들 구성을 확인.
- 이 검사에서 CommonJS 기본 export가 한 겹 더 감싸지는 문제를 발견하고,
  Rollup의 `interop: "auto"` 설정으로 수정.
- Next.js 템플릿 프로덕션 빌드, 문서 타입 검사, React Router·TanStack Router·Expo
  템플릿 타입 검사 통과.
- 실제 설치한 웹 기본 패키지가 라우터를 요구하지 않는 격리 검사 통과.
- 코어와 네이티브 기본 패키지가 DOM 또는 Expo를 요구하지 않는 격리 검사 통과.
- Expo 템플릿의 iOS Hermes 번들 생성 통과.

이 결과는 실험 구현의 연결과 동작을 검증한다. 패키지 구분이 사용자에게 더
잘 이해되는지는 검증하지 않았다. 지원 범위의 모든 프레임워크 버전을 시험한
것도 아니며, 설치 용량, 컴파일 비용, 실제 기기 성능도 측정하지 않았다.
