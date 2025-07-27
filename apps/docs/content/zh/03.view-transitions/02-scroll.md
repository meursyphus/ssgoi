---
title: "滚动过渡"
description: "页面以垂直滚动效果进行过渡"
nav-title: "滚动"
---

# 滚动过渡

滚动过渡创建一个页面向上或向下滑动切换的效果。它将熟悉的移动应用导航体验带到了 Web 上。

## 基本用法

```tsx
import { Ssgoi } from '@ssgoi/react';
import { scroll } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: scroll()
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* 应用内容 */}
    </Ssgoi>
  );
}
```

## 选项

### 方向设置

```tsx
scroll({
  direction: 'up',    // 'up' | 'down' (默认: 'up')
  spring: {
    stiffness: 300,   // 弹簧刚度（默认：300）
    damping: 30       // 阻尼比（默认：30）
  }
})
```

### 方向行为

- **`direction: 'up'`** (默认)
  - 进入页面：从底部向上滑动
  - 离开页面：向上滑出
  
- **`direction: 'down'`**
  - 进入页面：从顶部向下滑动
  - 离开页面：向下滑出

## 使用示例

### 向上滚动（默认）

```tsx
const config = {
  defaultTransition: scroll()
};
```

### 向下滚动

```tsx
const config = {
  defaultTransition: scroll({ direction: 'down' })
};
```

### 平滑滚动

```tsx
const config = {
  defaultTransition: scroll({
    spring: {
      stiffness: 150,
      damping: 25
    }
  })
};
```

## 特定路由方向

基于层级结构设置不同方向：

```tsx
const config = {
  transitions: [
    {
      from: '/list',
      to: '/detail/*',
      transition: scroll({ direction: 'up' }),
      symmetric: true  // 反向自动使用 'down'
    },
    {
      from: '/parent',
      to: '/child',
      transition: scroll({ direction: 'down' })
    }
  ]
};

<Ssgoi config={config}>
  {/* 应用内容 */}
</Ssgoi>
```

## 工作原理

```
方向: UP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
离开页面 → 向上移动 (translateY: 0 → -100%)
进入页面 → 从底部向上滑动 (translateY: 100% → 0)

方向: DOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
离开页面 → 向下移动 (translateY: 0 → 100%)
进入页面 → 从顶部向下滑动 (translateY: -100% → 0)
```

## 优点

- 直观的方向流代表页面层级
- 类似移动应用的自然用户体验
- 使用 GPU 加速的流畅性能
- 与滚动手势行为一致

## 推荐使用场景

### UP 方向
- 列表 → 详情页
- 首页 → 子页面
- 常规前进导航

### DOWN 方向
- 父 → 子关系
- 菜单 → 子菜单导航
- 模态框或覆盖层展示

## 注意事项

- 对于超过视口的页面，过渡起始位置很重要
- 滚动位置自动保留，无需额外处理
- 双向导航建议使用 `symmetric: true`