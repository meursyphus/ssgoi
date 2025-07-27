---
title: "弹跳动画"
description: "创建元素弹跳的生动效果"
nav-title: "弹跳"
---

# 弹跳动画

弹跳（Bounce）动画创建元素弹跳的效果，提供有趣且生动的交互。在吸引注意力或创造愉快的用户体验时非常有效。

## 基本用法

```tsx
import { transition } from '@ssgoi/react';
import { bounce } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'bounce-element', ...bounce() })}>
          应用了弹跳动画的元素
        </div>
      )}
    </div>
  );
}
```

## 选项

```typescript
interface BounceOptions {
  height?: number;         // 弹跳高度（默认：20）
  intensity?: number;      // 弹跳强度（默认：1）
  scale?: boolean;         // 添加缩放效果（默认：true）
  fade?: boolean;          // 添加淡入淡出效果（默认：false）
  direction?: 'up' | 'down';  // 弹跳方向（默认：'up'）
  spring?: {
    stiffness?: number;    // 弹簧刚度（默认：800）
    damping?: number;      // 阻尼系数（默认：15）
  };
}
```

### 选项说明

- **height**: 弹跳最大高度（像素）
- **intensity**: 弹跳次数和强度（1 = 默认，2 = 双倍）
- **scale**: 弹跳时添加大小变化效果
- **fade**: 弹跳时添加淡入淡出效果
- **direction**: 弹跳方向
  - `'up'`: 向上弹跳
  - `'down'`: 向下坠落
- **spring**: 弹簧物理设置（高stiffness = 快速弹跳）

## 使用示例

### 弹跳强度调节

```tsx
// 柔和弹跳
const softBounce = bounce({ 
  height: 10,
  intensity: 0.5,
  spring: { stiffness: 600, damping: 20 }
});

// 强烈弹跳
const strongBounce = bounce({ 
  height: 30,
  intensity: 2,
  spring: { stiffness: 1000, damping: 10 }
});

// 细微弹跳
const subtleBounce = bounce({ 
  height: 5,
  intensity: 0.3
});
```

### 方向变更

```tsx
// 向上弹跳（默认）
const bounceUp = bounce({ 
  direction: 'up' 
});

// 向下弹跳（坠落效果）
const bounceDown = bounce({ 
  direction: 'down',
  height: 25
});
```

### 复合效果

```tsx
// 弹跳 + 淡入淡出
const bounceFade = bounce({ 
  fade: true,
  height: 20
});

// 仅弹跳（无缩放）
const bounceOnly = bounce({ 
  scale: false,
  height: 15
});

// 所有效果组合
const bounceAll = bounce({ 
  height: 25,
  intensity: 1.5,
  scale: true,
  fade: true,
  spring: { stiffness: 700, damping: 12 }
});
```

## 实用示例

### 点赞按钮

```tsx
function LikeButton() {
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <button
      onClick={() => setIsLiked(!isLiked)}
      className="relative p-2"
    >
      {isLiked ? (
        <HeartIcon 
          ref={transition({ 
            key: 'heart-filled', 
            ...bounce({ 
              height: 15,
              intensity: 1.2,
              spring: { stiffness: 900, damping: 15 }
            }) 
          })}
          className="w-8 h-8 text-red-500"
        />
      ) : (
        <HeartOutlineIcon className="w-8 h-8 text-gray-400" />
      )}
      
      {/* 点赞计数动画 */}
      {isLiked && (
        <span 
          ref={transition({ 
            key: 'like-count', 
            ...bounce({ 
              height: 10,
              direction: 'up',
              fade: true
            }) 
          })}
          className="absolute -top-2 -right-2 text-xs text-red-500"
        >
          +1
        </span>
      )}
    </button>
  );
}
```

### 通知铃铛

```tsx
function NotificationBell({ hasNew }) {
  return (
    <div className="relative">
      <BellIcon 
        ref={hasNew ? transition({ 
          key: 'bell-bounce', 
          ...bounce({ 
            height: 8,
            intensity: 2,
            spring: { stiffness: 1200, damping: 20 }
          }) 
        }) : undefined}
        className="w-6 h-6"
      />
      
      {hasNew && (
        <div 
          ref={transition({ 
            key: 'notification-dot', 
            ...bounce({ 
              height: 5,
              scale: true
            }) 
          })}
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
        />
      )}
    </div>
  );
}
```

### 成功消息

```tsx
function SuccessMessage({ show, message }) {
  return (
    <>
      {show && (
        <div 
          ref={transition({ 
            key: 'success-message', 
            ...bounce({ 
              height: 20,
              direction: 'down',
              fade: true,
              spring: { stiffness: 600, damping: 18 }
            }) 
          })}
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <CheckCircleIcon className="w-5 h-5" />
          {message}
        </div>
      )}
    </>
  );
}
```

### 拖放动画

```tsx
function DroppableItem({ item, onDrop }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  
  const handleDrop = () => {
    setIsDropped(true);
    onDrop(item);
  };
  
  return (
    <div
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => {
        setIsDragging(false);
        handleDrop();
      }}
      className={isDragging ? 'opacity-50' : ''}
    >
      {isDropped ? (
        <div 
          ref={transition({ 
            key: 'dropped-item', 
            ...bounce({ 
              height: 30,
              direction: 'down',
              intensity: 1.5,
              spring: { stiffness: 500, damping: 12 }
            }) 
          })}
          className="p-4 bg-blue-100 rounded-lg"
        >
          {item.name} (已放置！)
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg cursor-move">
          {item.name}
        </div>
      )}
    </div>
  );
}
```

## 高级用法

### 连续弹跳

```tsx
function ContinuousBounce() {
  const [bounceCount, setBounceCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBounceCount(c => c + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div 
      ref={transition({ 
        key: `bounce-${bounceCount}`, 
        ...bounce({ 
          height: 15,
          intensity: 0.8
        }) 
      })}
      className="w-20 h-20 bg-purple-500 rounded-full"
    />
  );
}
```

### 弹性菜单

```tsx
function ElasticMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-500 text-white rounded-full"
      >
        <MenuIcon />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 space-y-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={transition({ 
                key: `menu-item-${item.id}`, 
                ...bounce({ 
                  height: 20 - index * 3,  // 逐渐减少
                  intensity: 1,
                  spring: { 
                    stiffness: 800 - index * 50,  // 序列效果
                    damping: 15 
                  }
                }) 
              })}
              className="block w-full px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
              style={{ 
                transitionDelay: `${index * 50}ms`  // 交错效果
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 弹球模拟

```tsx
function BouncingBall() {
  const [position, setPosition] = useState({ x: 50, y: 0 });
  const [bounceKey, setBounceKey] = useState(0);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setBounceKey(k => k + 1);
  };
  
  return (
    <div 
      className="relative w-full h-96 bg-gray-100 overflow-hidden"
      onClick={handleClick}
    >
      <div
        ref={transition({ 
          key: `ball-${bounceKey}`, 
          ...bounce({ 
            height: 150,
            direction: 'down',
            intensity: 2,
            scale: true,
            spring: { stiffness: 400, damping: 10 }
          }) 
        })}
        className="absolute w-12 h-12 bg-red-500 rounded-full"
        style={{ 
          left: position.x - 24,
          top: position.y - 24
        }}
      />
    </div>
  );
}
```

## 性能优化

- 弹跳使用`transform: translateY()`进行GPU加速
- 高`intensity`值需要更多计算
- 多个元素同时弹跳需要考虑性能

### 性能提示

```tsx
// 移动端优化
const isMobile = window.innerWidth < 768;
const optimizedBounce = bounce({
  height: isMobile ? 10 : 20,
  intensity: isMobile ? 0.8 : 1,
  spring: { 
    stiffness: isMobile ? 900 : 800,
    damping: 15 
  }
});
```

## 无障碍考虑

```tsx
<button
  ref={transition({ 
    key: 'accessible-bounce', 
    ...bounce() 
  })}
  aria-label="有新通知"
  aria-live="polite"
  aria-atomic="true"
>
  <NotificationIcon />
</button>
```

## 推荐使用场景

- **交互反馈**：按钮点击、点赞
- **通知**：新消息、更新提醒
- **成功/完成状态**：任务完成显示
- **游戏元素**：得分、收集物品
- **教程**：强调重要元素