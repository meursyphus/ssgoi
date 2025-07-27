---
title: "旋转动画"
description: "通过旋转元素创建动态生动的效果"
nav-title: "旋转"
---

# 旋转动画

旋转（Rotate）动画在2D或3D空间中旋转元素，创建有趣且吸引眼球的动画效果，能够吸引用户的注意力。

## 基本用法

```tsx
import { transition } from '@ssgoi/react';
import { rotate } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'rotate-element', ...rotate() })}>
          应用了旋转动画的元素
        </div>
      )}
    </div>
  );
}
```

## 选项

```typescript
interface RotateOptions {
  degrees?: number;        // 旋转角度（默认：360）
  clockwise?: boolean;     // 是否顺时针（默认：true）
  scale?: boolean;         // 添加缩放效果（默认：false）
  fade?: boolean;          // 添加淡入淡出效果（默认：false）
  origin?: string;         // 旋转中心点（默认：'center'）
  axis?: '2d' | 'x' | 'y' | 'z';  // 旋转轴（默认：'2d'）
  perspective?: number;    // 3D透视距离（默认：800）
  spring?: {
    stiffness?: number;    // 弹簧刚度（默认：500）
    damping?: number;      // 阻尼系数（默认：25）
  };
}
```

### 选项说明

- **degrees**: 旋转角度（360 = 一圈）
- **clockwise**: true为顺时针，false为逆时针
- **scale**: 旋转时添加大小变化效果
- **fade**: 旋转时添加淡入淡出效果
- **origin**: 旋转中心点（CSS transform-origin值）
- **axis**: 旋转轴
  - `'2d'`: 平面旋转（默认）
  - `'x'`: X轴旋转（上下翻转）
  - `'y'`: Y轴旋转（左右翻转）
  - `'z'`: Z轴旋转（与平面旋转相同）
- **perspective**: 3D旋转时的透视距离
- **spring**: 弹簧物理设置

## 使用示例

### 基本旋转变化

```tsx
// 半圈旋转
const halfRotate = rotate({ 
  degrees: 180 
});

// 逆时针旋转
const counterClockwise = rotate({ 
  clockwise: false 
});

// 两圈旋转
const doubleRotate = rotate({ 
  degrees: 720 
});

// 小幅旋转
const smallRotate = rotate({ 
  degrees: 45 
});
```

### 3D旋转

```tsx
// X轴旋转（卡片翻转效果）
const flipX = rotate({ 
  axis: 'x',
  degrees: 180,
  perspective: 1000
});

// Y轴旋转（开门效果）
const flipY = rotate({ 
  axis: 'y',
  degrees: 90,
  perspective: 800
});

// Z轴旋转（平面旋转）
const rotateZ = rotate({ 
  axis: 'z',
  degrees: 360
});
```

### 旋转中心点变更

```tsx
// 左上角为基准旋转
const topLeftRotate = rotate({ 
  origin: 'top left',
  degrees: 90
});

// 右下角为基准旋转
const bottomRightRotate = rotate({ 
  origin: 'bottom right',
  degrees: -90
});

// 自定义中心点
const customOrigin = rotate({ 
  origin: '25% 75%',
  degrees: 180
});
```

### 复合效果

```tsx
// 旋转 + 缩放
const rotateScale = rotate({ 
  degrees: 360,
  scale: true
});

// 旋转 + 淡入淡出
const rotateFade = rotate({ 
  degrees: 720,
  fade: true
});

// 旋转 + 缩放 + 淡入淡出
const rotateAll = rotate({ 
  degrees: 360,
  scale: true,
  fade: true,
  spring: { stiffness: 300, damping: 20 }
});
```

## 实用示例

### 加载旋转器

```tsx
function LoadingSpinner({ isLoading }) {
  return (
    <>
      {isLoading && (
        <div 
          ref={transition({ 
            key: 'spinner', 
            ...rotate({ 
              degrees: 360,
              spring: { stiffness: 100, damping: 10 }
            }) 
          })}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      )}
    </>
  );
}
```

### 卡片翻转

```tsx
function FlipCard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="relative w-64 h-96 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 正面 */}
      {!isFlipped && (
        <div 
          ref={transition({ 
            key: 'card-front', 
            ...rotate({ 
              axis: 'y',
              degrees: 180,
              perspective: 1000
            }) 
          })}
          className="absolute inset-0 bg-white rounded-lg shadow-lg p-6"
        >
          {front}
        </div>
      )}
      
      {/* 背面 */}
      {isFlipped && (
        <div 
          ref={transition({ 
            key: 'card-back', 
            ...rotate({ 
              axis: 'y',
              degrees: 180,
              perspective: 1000,
              clockwise: false
            }) 
          })}
          className="absolute inset-0 bg-gray-800 text-white rounded-lg shadow-lg p-6"
        >
          {back}
        </div>
      )}
    </div>
  );
}
```

### 刷新按钮

```tsx
function RefreshButton({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-2 rounded-full hover:bg-gray-100"
    >
      <svg 
        ref={isRefreshing ? transition({ 
          key: 'refresh-icon', 
          ...rotate({ 
            degrees: 360,
            spring: { stiffness: 200, damping: 20 }
          }) 
        }) : undefined}
        className="w-6 h-6"
        viewBox="0 0 24 24"
      >
        <path d="M4 12a8 8 0 0 1 8-8V2.5L16 6l-4 3.5V8a6 6 0 1 0 6 6h1.5a7.5 7.5 0 1 1-7.5-7.5z"/>
      </svg>
    </button>
  );
}
```

### 图标过渡

```tsx
function IconTransition({ isActive }) {
  return (
    <div className="relative w-8 h-8">
      {isActive ? (
        <CheckIcon 
          ref={transition({ 
            key: 'check-icon', 
            ...rotate({ 
              degrees: 360,
              scale: true,
              spring: { stiffness: 600, damping: 30 }
            }) 
          })}
          className="absolute inset-0"
        />
      ) : (
        <CloseIcon 
          ref={transition({ 
            key: 'close-icon', 
            ...rotate({ 
              degrees: -360,
              scale: true,
              spring: { stiffness: 600, damping: 30 }
            }) 
          })}
          className="absolute inset-0"
        />
      )}
    </div>
  );
}
```

## 高级用法

### 多阶段旋转

```tsx
function MultiStageRotate() {
  const [stage, setStage] = useState(0);
  
  const rotations = [
    { degrees: 90, origin: 'top left' },
    { degrees: 180, origin: 'center' },
    { degrees: 270, origin: 'bottom right' },
    { degrees: 360, origin: 'center' }
  ];
  
  return (
    <div>
      <div 
        ref={transition({ 
          key: `rotate-stage-${stage}`, 
          ...rotate(rotations[stage]) 
        })}
        className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"
      />
      
      <button onClick={() => setStage((s) => (s + 1) % 4)}>
        下一阶段
      </button>
    </div>
  );
}
```

### 鼠标跟踪旋转

```tsx
function MouseTrackingRotate() {
  const [rotation, setRotation] = useState(0);
  const elementRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    ) * (180 / Math.PI);
    
    setRotation(angle);
  };
  
  return (
    <div 
      className="relative w-full h-64"
      onMouseMove={handleMouseMove}
    >
      <div 
        ref={(el) => {
          elementRef.current = el;
          if (el) {
            transition({ 
              key: `mouse-rotate-${Math.floor(rotation / 10)}`, 
              ...rotate({ 
                degrees: rotation,
                spring: { stiffness: 300, damping: 30 }
              }) 
            })(el);
          }
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
      >
        →
      </div>
    </div>
  );
}
```

### 3D立方体旋转

```tsx
function RotatingCube() {
  const [face, setFace] = useState(0);
  const faces = ['front', 'right', 'back', 'left'];
  
  return (
    <div className="perspective-1000">
      <div 
        ref={transition({ 
          key: `cube-${face}`, 
          ...rotate({ 
            axis: 'y',
            degrees: face * 90,
            perspective: 1000,
            spring: { stiffness: 200, damping: 25 }
          }) 
        })}
        className="relative w-32 h-32 transform-style-preserve-3d"
      >
        {/* 立方体的每个面 */}
        <div className="absolute inset-0 bg-red-500">前</div>
        <div className="absolute inset-0 bg-blue-500 rotate-y-90">右</div>
        <div className="absolute inset-0 bg-green-500 rotate-y-180">后</div>
        <div className="absolute inset-0 bg-yellow-500 rotate-y-270">左</div>
      </div>
      
      <button onClick={() => setFace((f) => (f + 1) % 4)}>
        下一面
      </button>
    </div>
  );
}
```

## 性能优化

- `transform: rotate()`使用GPU加速
- 3D旋转时使用`will-change: transform`可以提升性能
- 同时旋转大量元素可能影响性能，需谨慎使用

## 无障碍考虑

```tsx
<div 
  ref={transition({ 
    key: 'accessible-rotate', 
    ...rotate() 
  })}
  role="img"
  aria-label="旋转的标志"
  aria-live="polite"
>
  <Logo />
</div>
```

## 推荐使用场景

- **加载指示器**：旋转器、进度显示
- **图标过渡**：状态改变时的图标旋转
- **卡片交互**：正反面翻转效果
- **刷新功能**：刷新按钮动画
- **游戏元素**：轮盘、骰子等游戏UI