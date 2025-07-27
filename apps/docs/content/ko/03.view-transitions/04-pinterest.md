---
title: "핀터레스트 전환"
description: "갤러리에서 상세 화면으로 확장되는 Pinterest 스타일 전환"
nav-title: "핀터레스트"
---

# 핀터레스트 전환

핀터레스트(Pinterest) 전환은 갤러리의 작은 아이템이 전체 화면으로 확장되는 효과입니다. Pinterest 앱의 시그니처 전환 효과를 웹에서 구현하여, 시각적으로 매력적이고 직관적인 사용자 경험을 제공합니다.

## 핵심 개념

Pinterest 전환은 두 가지 key 속성을 사용합니다:

- **`data-pinterest-gallery-key`**: 갤러리 페이지의 아이템
- **`data-pinterest-detail-key`**: 상세 페이지의 컨테이너

같은 key 값을 가진 요소끼리 연결되어 확장/축소 애니메이션이 발생합니다.

```
갤러리 페이지                    상세 페이지
┌─────────────────┐            ┌─────────────────┐
│ ┌──┐ ┌──┐ ┌──┐ │            │                 │
│ │▣ │ │  │ │  │ │ ═════════> │       ▣         │
│ └──┘ └──┘ └──┘ │            │                 │
│ gallery-key="1" │            │ detail-key="1"  │
└─────────────────┘            └─────────────────┘
```

## 기본 사용법

### 1. 전환 설정

```tsx
import { Ssgoi } from '@ssgoi/react';
import { pinterest } from '@ssgoi/react/view-transitions';

const config = {
  transitions: [
    {
      from: '/gallery',
      to: '/gallery/*',
      transition: pinterest(),
      symmetric: true
    }
  ]
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* 앱 내용 */}
    </Ssgoi>
  );
}
```

### 2. 갤러리 페이지

```tsx
export function Gallery() {
  return (
    <div className="masonry-grid">
      {items.map(item => (
        <Link 
          key={item.id} 
          href={`/gallery/${item.id}`}
          data-pinterest-gallery-key={item.id}
          className="gallery-item"
        >
          <img src={item.thumbnail} alt={item.title} />
          <h3>{item.title}</h3>
        </Link>
      ))}
    </div>
  );
}
```

### 3. 상세 페이지

```tsx
export function GalleryDetail({ item }) {
  return (
    <div 
      data-pinterest-detail-key={item.id}
      className="detail-container"
    >
      <img src={item.fullImage} alt={item.title} />
      <h1>{item.title}</h1>
      <p>{item.description}</p>
    </div>
  );
}
```

## 옵션

```tsx
pinterest({
  spring: {
    stiffness: 50,   // 스프링 강도 (기본값: 50)
    damping: 10      // 감쇠 계수 (기본값: 10)
  },
  timeout: 300       // 페이지 매칭 대기 시간 (기본값: 300ms)
})
```

## 작동 원리

### 갤러리 → 상세 (Enter Mode)

1. 갤러리 아이템의 위치와 크기 계산
2. clip-path를 사용해 아이템 영역에서 시작
3. 전체 화면으로 확장하며 clip-path 애니메이션
4. 동시에 scale과 translate 적용

```
시작: 작은 카드          중간: 확장 중           완료: 전체 화면
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│┌──┐         │        │ ┌────────┐  │        │             │
││▣ │         │   =>   │ │   ▣    │  │   =>   │      ▣      │
│└──┘         │        │ └────────┘  │        │             │
└─────────────┘        └─────────────┘        └─────────────┘
```

### 상세 → 갤러리 (Exit Mode)

1. 상세 화면에서 갤러리 아이템 위치 계산
2. clip-path로 갤러리 아이템 크기로 축소
3. 원래 위치로 이동하며 페이드 아웃

## 고급 사용 예시

### Masonry 레이아웃과 함께

```tsx
// 갤러리 페이지
<div className="masonry-grid">
  {items.map((item, index) => (
    <div 
      key={item.id}
      data-pinterest-gallery-key={item.id}
      className="masonry-item"
      style={{ 
        gridRowEnd: `span ${item.height}`,
        animationDelay: `${index * 50}ms` 
      }}
    >
      <Link href={`/gallery/${item.id}`}>
        <img src={item.thumbnail} alt={item.title} />
      </Link>
    </div>
  ))}
</div>
```

### 이미지 프리로딩

```tsx
// 상세 페이지 - 부드러운 전환을 위한 이미지 프리로딩
export function GalleryDetail({ item }) {
  useEffect(() => {
    // 고해상도 이미지 프리로드
    const img = new Image();
    img.src = item.fullImage;
  }, [item.fullImage]);

  return (
    <div data-pinterest-detail-key={item.id}>
      {/* 내용 */}
    </div>
  );
}
```

## 스타일링 고려사항

### 갤러리 아이템

```css
.gallery-item {
  /* Pinterest 효과를 위한 기본 스타일 */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.gallery-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### 상세 컨테이너

```css
.detail-container {
  /* 전체 화면 활용 */
  min-height: 100vh;
  width: 100%;
  
  /* 컨텐츠 정렬 */
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

## 주의사항

### 1. Key 규칙
- 한 페이지당 하나의 `data-pinterest-detail-key`만 사용
- 갤러리 key와 상세 key는 정확히 일치해야 함
- 숫자나 문자열 모두 key로 사용 가능

### 2. 레이아웃 요구사항
- 갤러리 아이템은 명확한 경계가 있어야 함
- 상세 페이지는 전체 화면을 활용하는 것이 효과적
- 반응형 디자인 고려 필요

### 3. 성능 최적화
- 이미지는 적절한 크기로 최적화
- 썸네일과 전체 이미지 분리 사용
- lazy loading 적용 권장

## 권장 사용 사례

- 📷 이미지 갤러리
- 🛍️ 이커머스 상품 목록
- 📌 핀보드 스타일 레이아웃
- 🎨 포트폴리오 갤러리
- 📰 카드 기반 콘텐츠 목록

## Hero vs Pinterest

| 특징 | Hero 전환 | Pinterest 전환 |
|------|-----------|----------------|
| 용도 | 개별 요소 이동 | 전체 화면 확장 |
| 애니메이션 | 위치와 크기 변형 | Clip-path 확장 |
| 복잡도 | 여러 요소 가능 | 단일 컨테이너 |
| 효과 | 요소 간 연결성 | 몰입감 있는 확장 |