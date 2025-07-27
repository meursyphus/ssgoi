---
title: "模糊动画"
description: "通过模糊效果平滑地聚焦或模糊元素"
nav-title: "模糊"
---

# 模糊动画

模糊（Blur）动画通过对元素应用模糊效果来切换焦点或柔化背景。它提供了视觉深度和优雅的过渡效果。

## 基本用法

```tsx
import { transition } from '@ssgoi/react';
import { blur } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'blur-element', ...blur() })}>
          应用了模糊动画的元素
        </div>
      )}
    </div>
  );
}
```

## 选项

```typescript
interface BlurOptions {
  amount?: number | string;  // 模糊强度（默认：10）
  opacity?: number;          // 起始透明度（默认：0）
  scale?: boolean;           // 添加缩放效果（默认：false）
  fade?: boolean;            // 添加淡入淡出效果（默认：true）
  spring?: {
    stiffness?: number;      // 弹簧刚度（默认：300）
    damping?: number;        // 阻尼系数（默认：30）
  };
}
```

### 选项说明

- **amount**: 模糊的强度（像素单位或CSS值）
- **opacity**: 起始透明度（0-1）
- **scale**: 是否与模糊一起应用缩放效果
- **fade**: 是否与模糊一起应用淡入淡出效果
- **spring**: 弹簧物理设置

## 使用示例

### 强模糊效果

```tsx
const heavyBlur = blur({
  amount: 20,  // 强模糊
  spring: { stiffness: 200, damping: 25 }
});

<div ref={transition({ key: 'heavy-blur', ...heavyBlur })}>
  强烈模糊的元素
</div>
```

### 模糊+缩放组合

```tsx
const blurScale = blur({
  amount: 15,
  scale: true,  // 添加缩放效果
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'blur-scale', ...blurScale })}>
  模糊并缩小的效果
</div>
```

### 仅模糊（无淡入淡出）

```tsx
const blurOnly = blur({
  fade: false,     // 移除淡入淡出效果
  opacity: 1,      // 保持完全不透明
  amount: '2rem'   // 使用rem单位
});

<div ref={transition({ key: 'blur-only', ...blurOnly })}>
  仅应用模糊而无透明度变化
</div>
```

## 实用示例

### 背景模糊效果

```tsx
function BlurredBackground() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* 背景内容 */}
      <div className="p-8">
        <h1>主要内容</h1>
        <button onClick={() => setIsModalOpen(true)}>
          打开模态框
        </button>
      </div>
      
      {/* 模糊遮罩 */}
      {isModalOpen && (
        <div 
          ref={transition({ 
            key: 'blur-overlay', 
            ...blur({ amount: 8, opacity: 0.5 }) 
          })}
          className="fixed inset-0 bg-black/20"
          onClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
```

### 图片加载效果

```tsx
function BlurredImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative">
      {/* 占位符 */}
      {!isLoaded && (
        <div 
          ref={transition({ 
            key: 'image-placeholder', 
            ...blur({ amount: 20 }) 
          })}
          className="absolute inset-0 bg-gray-200"
        />
      )}
      
      {/* 实际图片 */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={isLoaded ? 'opacity-100' : 'opacity-0'}
      />
    </div>
  );
}
```

### 焦点切换效果

```tsx
function FocusableCards() {
  const [focusedId, setFocusedId] = useState(null);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(id => (
        <div
          key={id}
          onClick={() => setFocusedId(id)}
          className="relative cursor-pointer"
        >
          {/* 模糊效果 */}
          {focusedId && focusedId !== id && (
            <div 
              ref={transition({ 
                key: `blur-${id}`, 
                ...blur({ amount: 5, opacity: 0.7 }) 
              })}
              className="absolute inset-0 z-10"
            />
          )}
          
          {/* 卡片内容 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3>卡片 {id}</h3>
            <p>点击聚焦</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 高级用法

### 动态模糊强度

```tsx
function DynamicBlur() {
  const [blurAmount, setBlurAmount] = useState(10);
  
  const dynamicBlur = blur({
    amount: blurAmount,
    spring: { stiffness: 300, damping: 30 }
  });
  
  return (
    <div>
      <input
        type="range"
        min="0"
        max="30"
        value={blurAmount}
        onChange={(e) => setBlurAmount(Number(e.target.value))}
      />
      
      <div ref={transition({ key: `blur-${blurAmount}`, ...dynamicBlur })}>
        模糊强度：{blurAmount}px
      </div>
    </div>
  );
}
```

### 文本遮挡

```tsx
function Spoiler({ children }) {
  const [isRevealed, setIsRevealed] = useState(false);
  
  return (
    <span 
      className="relative inline-block cursor-pointer"
      onClick={() => setIsRevealed(!isRevealed)}
    >
      {!isRevealed && (
        <span 
          ref={transition({ 
            key: 'spoiler-blur', 
            ...blur({ amount: 8, fade: false }) 
          })}
          className="absolute inset-0"
        />
      )}
      <span className={!isRevealed ? 'select-none' : ''}>
        {children}
      </span>
    </span>
  );
}
```

## 性能考虑

- 模糊效果使用GPU加速，但比其他效果计算量更大
- 在大面积或多个元素同时应用时可能会影响性能
- 建议在移动设备上降低模糊强度

### 性能优化提示

```tsx
// 移动端适配
const isMobile = window.innerWidth < 768;
const optimizedBlur = blur({
  amount: isMobile ? 5 : 15,  // 移动端降低模糊强度
  spring: { 
    stiffness: isMobile ? 400 : 300,  // 移动端加快动画
    damping: 35 
  }
});
```

## 浏览器兼容性

- 所有现代浏览器都支持
- Safari可能需要`-webkit-backdrop-filter`
- IE11不支持CSS滤镜

## 推荐使用场景

- **模态框/对话框**：模糊背景内容
- **图片加载**：从占位符过渡到实际图片
- **焦点效果**：强调重要元素
- **剧透文本**：点击前隐藏内容
- **深度表现**：区分UI层级