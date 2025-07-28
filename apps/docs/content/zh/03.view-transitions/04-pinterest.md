---
title: "Pinterest 过渡"
description: "Pinterest 风格的从画廊到详情视图的展开效果"
nav-title: "Pinterest"
---

# Pinterest 过渡

Pinterest 过渡创建了画廊小项目展开到全屏的效果。它将 Pinterest 应用的标志性过渡效果带到了 Web 上，提供视觉上吸引人且直观的用户体验。

## 核心概念

Pinterest 过渡使用两个 key 属性：

- **`data-pinterest-gallery-key`**: 画廊页面的项目
- **`data-pinterest-detail-key`**: 详情页面的容器

具有相同 key 值的元素会连接并创建展开/收缩动画。

```
画廊页面                      详情页面
┌─────────────────┐            ┌─────────────────┐
│ ┌──┐ ┌──┐ ┌──┐ │            │                 │
│ │▣ │ │  │ │  │ │ ═════════> │       ▣         │
│ └──┘ └──┘ └──┘ │            │                 │
│ gallery-key="1" │            │ detail-key="1"  │
└─────────────────┘            └─────────────────┘
```

## 基本用法

### 1. 过渡设置

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
      {/* 应用内容 */}
    </Ssgoi>
  );
}
```

### 2. 画廊页面

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

### 3. 详情页面

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

## 选项

```tsx
pinterest({
  spring: {
    stiffness: 50,   // 弹簧刚度（默认：50）
    damping: 10      // 阻尼比（默认：10）
  },
  timeout: 300       // 页面匹配超时（默认：300ms）
})
```

## 工作原理

### 画廊 → 详情（进入模式）

1. 计算画廊项目的位置和大小
2. 使用 clip-path 从项目区域开始
3. 展开到全屏同时进行 clip-path 动画
4. 同时应用 scale 和 translate

```
开始：小卡片        中间：展开中         结束：全屏
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│┌──┐         │     │ ┌────────┐  │     │             │
││▣ │         │ =>  │ │   ▣    │  │ =>  │      ▣      │
│└──┘         │     │ └────────┘  │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 详情 → 画廊（退出模式）

1. 从详情视图计算画廊项目位置
2. 使用 clip-path 收缩到画廊项目大小
3. 移动到原始位置同时淡出

## 高级示例

### 配合瀑布流布局

```tsx
// 画廊页面
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

### 图片预加载

```tsx
// 详情页面 - 为平滑过渡预加载图片
export function GalleryDetail({ item }) {
  useEffect(() => {
    // 预加载高分辨率图片
    const img = new Image();
    img.src = item.fullImage;
  }, [item.fullImage]);

  return (
    <div data-pinterest-detail-key={item.id}>
      {/* 内容 */}
    </div>
  );
}
```

## 样式考虑

### 画廊项目

```css
.gallery-item {
  /* Pinterest 效果的基础样式 */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.gallery-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### 详情容器

```css
.detail-container {
  /* 全屏利用 */
  min-height: 100vh;
  width: 100%;
  
  /* 内容对齐 */
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

## 重要说明

### 1. Key 规则
- 每页只使用一个 `data-pinterest-detail-key`
- 画廊 key 和详情 key 必须完全匹配
- 数字和字符串都可以作为 key

### 2. 布局要求
- 画廊项目需要明确的边界
- 详情页面使用全屏布局效果最佳
- 需要考虑响应式设计

### 3. 性能优化
- 将图片优化到适当大小
- 分别使用缩略图和完整图片
- 建议应用懒加载

## 推荐使用场景

- 📷 图片画廊
- 🛍️ 电商产品列表
- 📌 Pinterest 风格布局
- 🎨 作品集画廊
- 📰 卡片式内容列表

## Hero vs Pinterest

| 特性 | Hero 过渡 | Pinterest 过渡 |
|------|-----------|----------------|
| 用途 | 单个元素移动 | 全屏展开 |
| 动画 | 位置和大小变换 | Clip-path 展开 |
| 复杂度 | 可多个元素 | 单一容器 |
| 效果 | 元素连接性 | 沉浸式展开 |