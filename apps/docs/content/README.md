# SSGOI 문서 목차

SSGOI(상태를 기억하는 스프링 트랜지션) 라이브러리의 공식 문서입니다.

## 📚 문서 구조

### [00. 문서 작성 가이드](./00.문서작성가이드.md)
문서 작성 규칙과 가이드라인

### 01. 시작하기
- [01. SSGOI란?](./01.시작하기/01.SSGOI란.md) - 왜 SSGOI를 써야 하는지, 매력적인 데모
- [02. 설치](./01.시작하기/02.설치.md) - 패키지 설치 방법
- [03. 개별 요소 애니메이션 (transition)](./01.시작하기/03.개별요소애니메이션.md) - React/Svelte에서 transition 사용법
- [04. 페이지 전환 애니메이션 (Ssgoi)](./01.시작하기/04.페이지전환애니메이션.md) - SsgoiProvider와 SsgoiTransition 사용법

### 02. 핵심 개념
- [01. DOM 생명주기와 애니메이션](./02.핵심개념/01.DOM생명주기와애니메이션.md) - DOM이 나타나고 사라질 때 애니메이션 원리
- [02. Transition API 상세](./02.핵심개념/02.TransitionAPI상세.md) - in/out, progress, tick 함수 설명
- [03. 4가지 전환 시나리오](./02.핵심개념/03.4가지전환시나리오.md) - Fresh IN/OUT, IN→OUT, OUT→IN 시나리오
- [04. prepare와 레이아웃 관리](./02.핵심개념/04.prepare와레이아웃관리.md) - absolute positioning과 레이아웃 shift 방지

### 03. API 레퍼런스
- [01. Core 패키지](./03.API레퍼런스/01.Core패키지.md)
- [02. transition 함수](./03.API레퍼런스/02.transition함수.md)
- [03. SsgoiProvider와 SsgoiTransition](./03.API레퍼런스/03.SsgoiProvider와SsgoiTransition.md)
- [04. 트랜지션 프리셋](./03.API레퍼런스/04.트랜지션프리셋.md)
- [05. 타입 정의](./03.API레퍼런스/05.타입정의.md)

## 🚀 빠른 링크

- [GitHub 저장소](https://github.com/meursyphus/ssgoi)
- [npm - React](https://www.npmjs.com/package/@meursyphus/ssgoi-react)
- [npm - Svelte](https://www.npmjs.com/package/@meursyphus/ssgoi-svelte)
- [React 데모](../../react-demo)
- [Svelte 데모](../../svelte-demo)

## 📝 라이선스

MIT License