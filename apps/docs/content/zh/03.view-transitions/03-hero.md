---
title: "英雄过渡"
description: "共享元素在页面间自然移动的过渡效果"
nav-title: "英雄"
---

# 英雄过渡

英雄过渡创建了两个页面间共享元素自然移动和变形的效果。它提供了沉浸式的过渡体验，如图片或卡片从列表扩展到详情视图。

## 核心概念

要使用英雄过渡，需要给要动画的元素添加 `data-hero-key` 属性。具有相同 key 的元素之间会连接并在页面间产生动画。

```
页面 A                      页面 B
┌─────────────┐            ┌─────────────┐
│ ┌─────────┐ │            │             │
│ │ key="1" │ │ ══════════>│   key="1"   │
│ └─────────┘ │            │             │
└─────────────┘            └─────────────┘
```

## 基本用法

### 1. 过渡设置

```tsx
import { Ssgoi } from '@ssgoi/react';
import { hero } from '@ssgoi/react/view-transitions';

const config = {
  transitions: [
    {
      from: '/products',
      to: '/products/*',
      transition: hero(),
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

### 2. 为元素添加 key

**列表页面：**
```tsx
export function ProductList() {
  return (
    <div className="grid">
      {products.map(product => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <img 
            data-hero-key={`product-image-${product.id}`}
            src={product.thumbnail}
            alt={product.name}
          />
          <h3 data-hero-key={`product-title-${product.id}`}>
            {product.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}
```

**详情页面：**
```tsx
export function ProductDetail({ product }) {
  return (
    <div>
      <img 
        data-hero-key={`product-image-${product.id}`}
        src={product.fullImage}
        alt={product.name}
      />
      <h1 data-hero-key={`product-title-${product.id}`}>
        {product.name}
      </h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## 选项

```tsx
hero({
  spring: {
    stiffness: 300,  // 弹簧刚度（默认：300）
    damping: 30      // 阻尼比（默认：30）
  },
  timeout: 300       // 页面匹配超时（默认：300ms）
})
```

## 高级示例

### 多元素同时过渡

```tsx
// 图片、标题和价格都进行英雄过渡
<article>
  <img data-hero-key={`hero-img-${id}`} src={image} />
  <h2 data-hero-key={`hero-title-${id}`}>{title}</h2>
  <span data-hero-key={`hero-price-${id}`}>￥{price}</span>
</article>
```

### 动态 key 生成

```tsx
// 按类别分组的英雄元素
<div data-hero-key={`${category}-item-${id}`}>
  {content}
</div>
```

## 工作原理

1. **匹配**: 在离开和进入页面中查找相同的 `data-hero-key`
2. **计算**: 计算元素的起始位置、结束位置和大小差异
3. **变形**: 同时动画位置（translate）和大小（scale）
4. **清理**: 动画完成后重置样式

```
开始状态          中间动画          最终状态
┌──┐              ┌────┐            ┌──────┐
│  │ ──────────> │    │ ────────> │      │
└──┘              └────┘            └──────┘
位置 A            移动中            位置 B
大小 S            变形中            大小 L
```

## 重要说明

### 1. Key 唯一性
- 页面内的 `data-hero-key` 必须唯一
- 对于动态数据，建议在 key 中包含 ID

### 2. 元素匹配
- 如果找不到匹配的 key，则退回到常规过渡
- 如果多个元素有相同的 key，只有第一个会动画

### 3. 样式注意事项
- 过渡期间临时应用 `position: relative`
- `transform-origin` 设置为 `top left`
- 动画后恢复原始样式

## 推荐使用场景

- 📸 图片画廊 → 图片详情视图
- 🛍️ 产品列表 → 产品详情页
- 📝 卡片布局 → 全屏视图
- 👤 个人资料缩略图 → 个人资料页面
- 🎵 专辑封面 → 播放器界面

## 性能优化

- 不要在太多元素上使用 hero key
- 应用于简单元素而非复杂 DOM 结构
- 优化图片到适当大小
- `will-change: transform` 由 Ssgoi 自动处理