---
title: "缩放动画"
description: "通过调整元素大小来创建放大/缩小效果"
nav-title: "缩放"
---

# 缩放动画

缩放（Scale）动画通过改变元素的大小来创建放大或缩小的效果。在提高注意力或表现视觉层次时非常有效。

## 基本用法

```tsx
import { transition } from '@ssgoi/react';
import { scale } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'scale-element', ...scale() })}>
          应用了缩放动画的元素
        </div>
      )}
    </div>
  );
}
```

## 选项

```typescript
interface ScaleOptions {
  start?: number;      // 起始大小比例（默认：0）
  opacity?: number;    // 起始透明度（默认：0）
  axis?: 'x' | 'y' | 'both';  // 缩放方向（默认：'both'）
  spring?: {
    stiffness?: number;  // 弹簧刚度（默认：300）
    damping?: number;    // 阻尼系数（默认：30）
  };
}
```

### 选项说明

- **start**: 动画开始时的大小（0 = 0%，1 = 100%）
- **opacity**: 起始透明度（0-1）
- **axis**: 缩放应用的轴
  - `'both'`: X轴和Y轴同时（默认）
  - `'x'`: 仅水平方向
  - `'y'`: 仅垂直方向
- **spring**: 弹簧物理设置

## 使用示例

### 轴向缩放

#### X轴缩放（水平扩展）

```tsx
const scaleX = scale({
  axis: 'x',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-x', ...scaleX })}>
  仅水平扩展的元素
</div>
```

#### Y轴缩放（垂直扩展）

```tsx
const scaleY = scale({
  axis: 'y',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-y', ...scaleY })}>
  仅垂直扩展的元素
</div>
```

### 部分缩放

从较小尺寸开始的效果：

```tsx
const partialScale = scale({
  start: 0.5,     // 从50%大小开始
  opacity: 0.3,   // 从30%透明度开始
});

<div ref={transition({ key: 'partial-scale', ...partialScale })}>
  从一半大小开始的元素
</div>
```

### 带弹跳效果的缩放

通过弹簧设置添加弹跳效果：

```tsx
const bounceScale = scale({
  spring: { 
    stiffness: 200,  // 较低刚度产生弹跳
    damping: 15      // 较低阻尼增加振动
  }
});

<div ref={transition({ key: 'bounce-scale', ...bounceScale })}>
  弹跳缩放效果
</div>
```

## 实用示例

### 卡片悬停效果

```tsx
function Card() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div 
          ref={transition({ 
            key: 'card-hover', 
            ...scale({ start: 0.95, opacity: 0.8 }) 
          })}
          className="absolute inset-0 bg-blue-500/20 rounded-lg"
        />
      )}
      <div className="p-4">卡片内容</div>
    </div>
  );
}
```

### 模态框出现效果

```tsx
function Modal({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div 
            ref={transition({ 
              key: 'modal', 
              ...scale({ start: 0.8, opacity: 0 }) 
            })}
            className="bg-white rounded-lg p-6 shadow-xl"
          >
            <h2>模态框标题</h2>
            <p>模态框内容</p>
            <button onClick={onClose}>关闭</button>
          </div>
        </div>
      )}
    </>
  );
}
```

### 图标动画

```tsx
function AnimatedIcon() {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button onClick={() => setIsActive(!isActive)}>
      {isActive ? (
        <HeartFilledIcon 
          ref={transition({ 
            key: 'heart-icon', 
            ...scale({ start: 0, spring: { stiffness: 600, damping: 20 } }) 
          })} 
        />
      ) : (
        <HeartOutlineIcon />
      )}
    </button>
  );
}
```

## 性能优化

- `transform: scale()`使用GPU加速，性能优秀
- 不会引起布局变化，避免重排
- 即使同时应用于多个元素也能保持流畅的动画

### 性能提示

```tsx
// 好的做法：使用transform
const goodScale = scale(); // 使用transform: scale()

// 避免的做法：直接修改width/height
const badScale = {
  in: (element) => ({
    tick: (progress) => {
      // 触发重排！
      element.style.width = `${progress * 100}px`;
      element.style.height = `${progress * 100}px`;
    }
  })
};
```

## 无障碍考虑

```tsx
<button
  ref={transition({ 
    key: 'accessible-button', 
    ...scale({ start: 0.9 }) 
  })}
  aria-label="会放大的按钮"
  className="focus:outline-none focus:ring-2"
>
  点击我
</button>
```

## 推荐使用场景

- **按钮/图标**：点击反馈或悬停效果
- **卡片/磁贴**：选中状态或焦点显示
- **模态框/弹出框**：出现和消失动画
- **图片画廊**：缩略图放大效果
- **图表/图形**：数据可视化元素的强调