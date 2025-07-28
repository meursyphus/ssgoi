---
title: "淡入淡出动画"
description: "通过平滑的淡入/淡出效果为元素添加动画"
nav-title: "淡入淡出"
---

# 淡入淡出动画

淡入淡出（Fade）动画通过调整元素的透明度来创建平滑的出现或消失效果。这是最基础且广泛使用的动画效果。

## 基本用法

```tsx
import { transition } from '@ssgoi/react';
import { fade } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fade-element', ...fade() })}>
          应用了淡入淡出动画的元素
        </div>
      )}
    </div>
  );
}
```

## 选项

```typescript
interface FadeOptions {
  from?: number;    // 起始透明度（默认：0）
  to?: number;      // 结束透明度（默认：1）
  spring?: {
    stiffness?: number;  // 弹簧刚度（默认：300）
    damping?: number;    // 阻尼系数（默认：30）
  };
}
```

### 选项说明

- **from**: 动画开始时的透明度值（0-1）
- **to**: 动画结束时的透明度值（0-1）
- **spring**: 弹簧物理设置
  - `stiffness`: 值越大，动画越快
  - `damping`: 值越大，动画越平滑

## 使用示例

### 部分淡入淡出

从半透明开始到略微透明结束的淡入淡出：

```tsx
const partialFade = fade({
  from: 0.2,  // 从20%透明度开始
  to: 0.8,    // 到80%透明度结束
  spring: { stiffness: 300, damping: 30 }
});

<div ref={transition({ key: 'partial-fade', ...partialFade })}>
  部分淡入淡出效果
</div>
```

### 缓慢淡入淡出

缓慢平滑出现的效果：

```tsx
const slowFade = fade({
  spring: { 
    stiffness: 100,  // 低刚度
    damping: 20      // 低阻尼
  }
});

<div ref={transition({ key: 'slow-fade', ...slowFade })}>
  缓慢淡入淡出效果
</div>
```

### 快速淡入淡出

快速出现的效果：

```tsx
const fastFade = fade({
  spring: { 
    stiffness: 500,  // 高刚度
    damping: 40      // 高阻尼
  }
});

<div ref={transition({ key: 'fast-fade', ...fastFade })}>
  快速淡入淡出效果
</div>
```

## 与其他动画组合

淡入淡出可以与其他动画组合使用，创造更丰富的效果：

```tsx
// 自定义组合动画
const fadeAndScale = {
  in: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  })
};
```

## 性能考虑

- 淡入淡出使用GPU加速，性能优秀
- `opacity`更改不会触发重排，效率高
- 即使同时应用于多个元素也能保持流畅的动画

## 无障碍性

使用淡入淡出动画时请考虑无障碍性：

```tsx
<div 
  ref={transition({ key: 'accessible-fade', ...fade() })}
  role="status"
  aria-live="polite"
>
  会向屏幕阅读器发送通知的淡入淡出元素
</div>
```

## 推荐使用场景

- **通知消息**：向用户提供反馈时
- **模态框/弹出框**：显示/隐藏遮罩层
- **图片画廊**：图片切换效果
- **加载状态**：显示内容加载
- **工具提示**：悬停时显示信息