---
title: "滑动动画"
description: "通过向特定方向滑动元素来创建动态移动效果"
nav-title: "滑动"
---

# 滑动动画

滑动（Slide）动画使元素从特定方向平滑地出现或消失。在需要方向性过渡时非常有效。

## 基本用法

```tsx
import { transition } from '@ssgoi/react';
import { slide } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'slide-element', ...slide() })}>
          应用了滑动动画的元素
        </div>
      )}
    </div>
  );
}
```

## 选项

```typescript
interface SlideOptions {
  direction?: 'left' | 'right' | 'up' | 'down';  // 滑动方向（默认：'left'）
  distance?: number | string;   // 移动距离（默认：100）
  opacity?: number;            // 起始不透明度（默认：0）
  fade?: boolean;              // 添加淡入淡出效果（默认：true）
  axis?: 'x' | 'y';          // 移动轴（direction的替代）
  spring?: {
    stiffness?: number;        // 弹簧刚度（默认：400）
    damping?: number;          // 阻尼系数（默认：35）
  };
}
```

### 选项说明

- **direction**: 滑动方向
  - `'left'`: 从左侧出现
  - `'right'`: 从右侧出现
  - `'up'`: 从上方出现
  - `'down'`: 从下方出现
- **distance**: 移动距离（像素或CSS单位）
- **opacity**: 起始不透明度（0-1）
- **fade**: 与滑动同时使用淡入淡出效果
- **axis**: 简单的轴指定（'x' 或 'y'）
- **spring**: 弹簧物理设置

## 使用示例

### 方向滑动

```tsx
// 从左滑动
const slideLeft = slide({ 
  direction: 'left' 
});

// 从右滑动
const slideRight = slide({ 
  direction: 'right' 
});

// 从上滑动
const slideUp = slide({ 
  direction: 'up' 
});

// 从下滑动
const slideDown = slide({ 
  direction: 'down' 
});
```

### 距离调整

```tsx
// 短距离
const shortSlide = slide({
  direction: 'left',
  distance: 50  // 仅移动50px
});

// 长距离
const longSlide = slide({
  direction: 'right',
  distance: '100vw'  // 移动屏幕宽度
});

// 使用rem单位
const remSlide = slide({
  direction: 'up',
  distance: '5rem'
});
```

### 无淡入淡出的滑动

```tsx
const slideNoFade = slide({
  direction: 'left',
  fade: false,      // 移除淡入淡出效果
  opacity: 1        // 保持完全不透明状态
});
```

## 实用示例

### 侧边栏菜单

```tsx
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* 侧边栏 */}
          <div 
            ref={transition({ 
              key: 'sidebar', 
              ...slide({ 
                direction: 'left', 
                distance: 300,
                fade: false 
              }) 
            })}
            className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg z-50"
          >
            <nav className="p-4">
              <h2>菜单</h2>
              {/* 菜单项 */}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
```

### 通知提示

```tsx
function Toast({ message, isVisible }) {
  return (
    <>
      {isVisible && (
        <div 
          ref={transition({ 
            key: 'toast', 
            ...slide({ 
              direction: 'up', 
              distance: 100 
            }) 
          })}
          className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {message}
        </div>
      )}
    </>
  );
}
```

### 标签内容切换

```tsx
function TabContent({ activeTab }) {
  const getSlideDirection = (tab) => {
    const tabs = ['tab1', 'tab2', 'tab3'];
    const currentIndex = tabs.indexOf(activeTab);
    const targetIndex = tabs.indexOf(tab);
    return currentIndex < targetIndex ? 'left' : 'right';
  };
  
  return (
    <div className="relative overflow-hidden h-64">
      {activeTab === 'tab1' && (
        <div 
          ref={transition({ 
            key: 'tab1', 
            ...slide({ direction: getSlideDirection('tab1') }) 
          })}
          className="absolute inset-0 p-4"
        >
          标签1内容
        </div>
      )}
      
      {activeTab === 'tab2' && (
        <div 
          ref={transition({ 
            key: 'tab2', 
            ...slide({ direction: getSlideDirection('tab2') }) 
          })}
          className="absolute inset-0 p-4"
        >
          标签2内容
        </div>
      )}
    </div>
  );
}
```

### 轮播图滑动

```tsx
function Carousel({ images, currentIndex }) {
  return (
    <div className="relative w-full h-96 overflow-hidden">
      {images.map((image, index) => (
        index === currentIndex && (
          <img
            key={index}
            ref={transition({ 
              key: `slide-${index}`, 
              ...slide({ 
                direction: 'left',
                distance: '100%',
                spring: { stiffness: 300, damping: 30 }
              }) 
            })}
            src={image}
            alt={`幻灯片 ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ))}
    </div>
  );
}
```

## 高级用法

### 基于轴的滑动

```tsx
// X轴滑动（左右）
const slideX = slide({
  axis: 'x',  // 使用axis代替direction
  distance: 200
});

// Y轴滑动（上下）
const slideY = slide({
  axis: 'y',
  distance: 150
});
```

### 连续动画

```tsx
function SequentialSlides() {
  const [step, setStep] = useState(0);
  
  return (
    <div>
      {step >= 0 && (
        <div 
          ref={transition({ 
            key: 'step-1', 
            ...slide({ direction: 'right', distance: 50 }) 
          })}
        >
          步骤1
        </div>
      )}
      
      {step >= 1 && (
        <div 
          ref={transition({ 
            key: 'step-2', 
            ...slide({ direction: 'right', distance: 50 }) 
          })}
        >
          步骤2
        </div>
      )}
      
      <button onClick={() => setStep(step + 1)}>下一步</button>
    </div>
  );
}
```

### 响应式滑动

```tsx
function ResponsiveSlide() {
  const isMobile = window.innerWidth < 768;
  
  const responsiveSlide = slide({
    direction: isMobile ? 'up' : 'left',
    distance: isMobile ? 50 : 100,
    spring: { 
      stiffness: isMobile ? 500 : 400,
      damping: 35 
    }
  });
  
  return (
    <div ref={transition({ key: 'responsive', ...responsiveSlide })}>
      响应式滑动
    </div>
  );
}
```

## 性能优化

- `transform: translate()`使用GPU加速，性能优秀
- 不改变布局，不会触发重排
- 即使同时应用于多个元素也能保持流畅的动画

### 性能提示

```tsx
// 好的做法：使用transform
const goodSlide = slide(); // 使用transform: translateX/Y

// 避免的做法：直接修改position
const badSlide = {
  in: (element) => ({
    tick: (progress) => {
      // 触发重排！
      element.style.left = `${(1 - progress) * -100}px`;
    }
  })
};
```

## 无障碍考虑

```tsx
<div 
  ref={transition({ 
    key: 'accessible-slide', 
    ...slide() 
  })}
  role="region"
  aria-live="polite"
  aria-label="滑动内容"
>
  无障碍滑动内容
</div>
```

## 推荐使用场景

- **导航菜单**：侧边栏、下拉菜单
- **通知/提示**：从屏幕边缘出现
- **标签/步骤切换**：带方向性的内容过渡
- **图片画廊**：幻灯片、轮播图
- **表单步骤**：多步骤表单的步骤间过渡