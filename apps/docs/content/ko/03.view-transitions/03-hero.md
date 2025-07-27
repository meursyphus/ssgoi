---
title: "히어로 전환"
description: "공유 요소가 페이지 간 자연스럽게 이동하는 전환 효과"
nav-title: "히어로"
---

# 히어로 전환

히어로(Hero) 전환은 두 페이지 간 공유되는 요소가 자연스럽게 이동하며 변형되는 효과입니다. 이미지나 카드가 목록에서 상세 페이지로 확대되는 듯한 몰입감 있는 전환을 제공합니다.

## 핵심 개념

히어로 전환을 사용하려면 전환될 요소에 `data-hero-key` 속성을 추가해야 합니다. 같은 key를 가진 요소끼리 연결되어 애니메이션됩니다.

```
페이지 A                    페이지 B
┌─────────────┐            ┌─────────────┐
│ ┌─────────┐ │            │             │
│ │ key="1" │ │ ══════════>│   key="1"   │
│ └─────────┘ │            │             │
└─────────────┘            └─────────────┘
```

## 기본 사용법

### 1. 전환 설정

```tsx
import { Ssgoi } from "@ssgoi/react";
import { hero } from "@ssgoi/react/view-transitions";

const config = {
  transitions: [
    {
      from: "/products",
      to: "/products/*",
      transition: hero(),
      symmetric: true,
    },
  ],
};

export default function App() {
  return <Ssgoi config={config}>{/* 앱 내용 */}</Ssgoi>;
}
```

### 2. 요소에 key 추가

**목록 페이지:**

```tsx
export function ProductList() {
  return (
    <div className="grid">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <img
            data-hero-key={`product-link-${product.id}`}
            src={product.thumbnail}
            alt={product.name}
          />
          <h3>{product.name}</h3>
        </Link>
      ))}
    </div>
  );
}
```

**상세 페이지:**

```tsx
export function ProductDetail({ product }) {
  return (
    <div>
      <img
        data-hero-key={`product-image-${product.id}`}
        src={product.fullImage}
        alt={product.name}
      />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## 옵션

```tsx
hero({
  spring: {
    stiffness: 300, // 스프링 강도 (기본값: 300)
    damping: 30, // 감쇠 계수 (기본값: 30)
  },
  timeout: 300, // 페이지 매칭 대기 시간 (기본값: 300ms)
});
```

## 고급 사용 예시

### 여러 요소 동시 전환

```tsx
// 이미지, 제목, 가격이 모두 히어로 전환
<article>
  <img data-hero-key={`hero-img-${id}`} src={image} />
  <h2 data-hero-key={`hero-title-${id}`}>{title}</h2>
  <span data-hero-key={`hero-price-${id}`}>${price}</span>
</article>
```

### 동적 key 생성

```tsx
// 카테고리별로 다른 히어로 그룹
<div data-hero-key={`${category}-item-${id}`}>{content}</div>
```

## 작동 원리

1. **매칭**: 나가는 페이지와 들어오는 페이지에서 같은 `data-hero-key`를 찾음
2. **계산**: 요소의 시작 위치와 끝 위치, 크기 차이를 계산
3. **변형**: 위치(translate)와 크기(scale)를 동시에 애니메이션
4. **정리**: 애니메이션 완료 후 스타일 초기화

```
시작 상태          중간 상태          최종 상태
┌──┐              ┌────┐            ┌──────┐
│  │ ──────────> │    │ ────────> │      │
└──┘              └────┘            └──────┘
위치 A            이동 중           위치 B
크기 S            변형 중           크기 L
```

## 주의사항

### 1. Key 고유성

- 한 페이지 내에서 `data-hero-key`는 고유해야 함
- 동적 데이터의 경우 ID를 포함한 key 사용 권장

### 2. 요소 매칭

- 같은 key를 가진 요소가 없으면 일반 전환으로 대체
- 여러 요소가 같은 key를 가지면 첫 번째 요소만 전환

### 3. 스타일 고려사항

- 전환 중 `position: relative`가 임시로 적용됨
- `transform-origin`이 `top left`로 설정됨
- 애니메이션 후 원래 스타일로 복원됨

## 권장 사용 사례

- 📸 이미지 갤러리 → 이미지 상세보기
- 🛍️ 상품 목록 → 상품 상세 페이지
- 📝 카드 레이아웃 → 전체 화면 뷰
- 👤 프로필 썸네일 → 프로필 페이지
- 🎵 음악 앨범 커버 → 재생 화면

## 성능 최적화

- 너무 많은 요소에 hero key를 사용하지 않기
- 복잡한 DOM 구조보다는 단순한 요소에 적용
- 이미지는 적절한 크기로 최적화
- `will-change: transform`은 Ssgoi가 자동 처리
