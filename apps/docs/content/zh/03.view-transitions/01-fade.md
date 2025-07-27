---
title: "淡入淡出过渡"
description: "通过淡入/淡出效果平滑切换页面"
nav-title: "淡入淡出"
---

# 淡入淡出过渡

淡入淡出过渡是最基础但优雅的页面过渡效果。它提供了平滑的过渡，当前页面逐渐消失，新页面逐渐出现。

## 基本用法

```tsx
import { Ssgoi } from '@ssgoi/react';
import { fade } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: fade()
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

淡入淡出过渡允许自定义弹簧动画设置：

```tsx
fade({
  spring: {
    stiffness: 300,  // 弹簧刚度（默认：300）
    damping: 30      // 阻尼比（默认：30）
  }
})
```

### 弹簧选项说明

- **stiffness**: 控制动画速度。值越高，过渡越快
- **damping**: 控制动画的弹跳。值越高，过渡越平滑

## 使用示例

### 缓慢淡入淡出

平滑而缓慢的淡入淡出效果：

```tsx
const config = {
  defaultTransition: fade({
    spring: {
      stiffness: 100,
      damping: 20
    }
  })
};
```

### 快速淡入淡出

快速利落的淡入淡出效果：

```tsx
const config = {
  defaultTransition: fade({
    spring: {
      stiffness: 500,
      damping: 40
    }
  })
};
```

## 特定路由应用

```tsx
const config = {
  transitions: [
    {
      from: '/home',
      to: '/about', 
      transition: fade(),
      symmetric: true  // 自动为 /about → /home 应用淡入淡出
    }
  ]
};

<Ssgoi config={config}>
  {/* 应用内容 */}
</Ssgoi>
```

## 工作原理

淡入淡出过渡的工作方式如下：

1. **离开页面**: 不透明度从 1 降到 0
2. **进入页面**: 不透明度从 0 升到 1
3. 两个动画同时运行，创建自然的交叉淡化效果

## 优点

- 适用于所有内容类型的通用过渡
- 轻量级动画，CPU/GPU 负担小
- 视觉上平滑且专业的外观
- 无方向性，适用于任何导航模式

## 推荐使用场景

- 默认页面过渡
- 无关内容页面之间的导航
- 需要平静优雅的用户体验时
- 性能关键的移动环境