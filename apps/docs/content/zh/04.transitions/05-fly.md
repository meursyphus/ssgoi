---
title: "飞入动画"
description: "创建元素从特定位置飞入的效果"
nav-title: "飞入"
---

# 飞入动画

飞入（Fly）动画创建元素从特定坐标飞入的效果。可以控制X、Y坐标，实现对角线移动或复杂的进入效果。

## 基本用法

```tsx
import { transition } from '@ssgoi/react';
import { fly } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fly-element', ...fly() })}>
          应用了飞入动画的元素
        </div>
      )}
    </div>
  );
}
```

## 选项

```typescript
interface FlyOptions {
  x?: number | string;    // X轴移动距离（默认：0）
  y?: number | string;    // Y轴移动距离（默认：-100）
  opacity?: number;       // 起始透明度（默认：0）
  spring?: {
    stiffness?: number;   // 弹簧刚度（默认：400）
    damping?: number;     // 阻尼系数（默认：35）
  };
}
```

### 选项说明

- **x**: 水平方向起始位置（正数：右侧，负数：左侧）
- **y**: 垂直方向起始位置（正数：下方，负数：上方）
- **opacity**: 起始透明度（0-1）
- **spring**: 弹簧物理设置

## 使用示例

### 从各个方向飞入

```tsx
// 从上方飞入（默认）
const flyFromTop = fly();

// 从下方飞入
const flyFromBottom = fly({ 
  y: 100 
});

// 从左侧飞入
const flyFromLeft = fly({ 
  x: -200, 
  y: 0 
});

// 从右侧飞入
const flyFromRight = fly({ 
  x: 200, 
  y: 0 
});

// 对角线（左上）
const flyDiagonal = fly({ 
  x: -150, 
  y: -150 
});
```

### 单位指定

```tsx
// 像素单位（默认）
const flyPixels = fly({ 
  x: 100, 
  y: -50 
});

// rem单位
const flyRem = fly({ 
  x: '5rem', 
  y: '-3rem' 
});

// 视口单位
const flyViewport = fly({ 
  x: '50vw', 
  y: '-100vh' 
});

// 百分比单位
const flyPercent = fly({ 
  x: '200%', 
  y: '0%' 
});
```

### 透明度调节

```tsx
// 从半透明开始
const flyWithOpacity = fly({ 
  x: 0, 
  y: -100, 
  opacity: 0.2  // 从20%透明度开始
});

// 完全不透明（仅飞入）
const flyNoFade = fly({ 
  x: -100, 
  y: 0, 
  opacity: 1  // 无淡入淡出效果
});
```

## 实用示例

### 浮动操作按钮（FAB）

```tsx
function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4">
      {/* 主按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg"
      >
        +
      </button>
      
      {/* 子按钮 */}
      {isExpanded && (
        <>
          <button
            ref={transition({ 
              key: 'fab-1', 
              ...fly({ x: -60, y: -10 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-green-500"
          >
            📝
          </button>
          
          <button
            ref={transition({ 
              key: 'fab-2', 
              ...fly({ x: -45, y: -45 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-red-500"
          >
            📸
          </button>
          
          <button
            ref={transition({ 
              key: 'fab-3', 
              ...fly({ x: -10, y: -60 }) 
            })}
            className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-yellow-500"
          >
            📎
          </button>
        </>
      )}
    </div>
  );
}
```

### 卡片网格动画

```tsx
function CardGrid({ cards }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, index) => {
        // 每张卡片从不同方向飞入
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        return (
          <div
            key={card.id}
            ref={transition({ 
              key: `card-${card.id}`, 
              ...fly({ 
                x: (col - 1) * 100,  // 中间列为0，左右为±100
                y: row * 50,         // 下方行从更下面开始
                spring: { 
                  stiffness: 300, 
                  damping: 30 + index * 2  // 序列效果
                }
              }) 
            })}
            className="p-4 bg-white rounded-lg shadow"
          >
            {card.content}
          </div>
        );
      })}
    </div>
  );
}
```

### 工具提示动画

```tsx
function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPosition({
            x: rect.width / 2,
            y: -10
          });
          setIsVisible(true);
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={transition({ 
            key: 'tooltip', 
            ...fly({ 
              x: 0, 
              y: 10,  // 从下方轻微上升
              opacity: 0.1 
            }) 
          })}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded"
          style={{ left: position.x }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
```

### 通知堆栈

```tsx
function NotificationStack({ notifications }) {
  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          ref={transition({ 
            key: `notification-${notification.id}`, 
            ...fly({ 
              x: 300,  // 从右侧飞入
              y: 0,
              spring: { 
                stiffness: 400, 
                damping: 35 
              }
            }) 
          })}
          className="bg-white rounded-lg shadow-lg p-4 min-w-[300px]"
        >
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## 高级用法

### 基于鼠标位置的飞入

```tsx
function MouseBasedFly() {
  const [items, setItems] = useState([]);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const newItem = {
      id: Date.now(),
      x,
      y
    };
    
    setItems([...items, newItem]);
  };
  
  return (
    <div 
      className="relative w-full h-96 bg-gray-100 overflow-hidden"
      onClick={handleClick}
    >
      {items.map(item => (
        <div
          key={item.id}
          ref={transition({ 
            key: `item-${item.id}`, 
            ...fly({ 
              x: -item.x,  // 从点击位置飞向中心
              y: -item.y,
              spring: { stiffness: 200, damping: 25 }
            }) 
          })}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full"
        />
      ))}
    </div>
  );
}
```

### 交错飞入动画

```tsx
function StaggeredFly({ items }) {
  const [visibleItems, setVisibleItems] = useState([]);
  
  useEffect(() => {
    // 依次显示项目
    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, item]);
      }, index * 100);
    });
  }, [items]);
  
  return (
    <div className="space-y-2">
      {visibleItems.map((item, index) => (
        <div
          key={item.id}
          ref={transition({ 
            key: `stagger-${item.id}`, 
            ...fly({ 
              x: -50 - index * 10,  // 逐渐从更远处
              y: 0,
              spring: { 
                stiffness: 300, 
                damping: 30 
              }
            }) 
          })}
          className="p-3 bg-white rounded shadow"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

## 性能优化

- `transform: translate()`使用GPU加速
- X和Y同时动画也只用单个transform处理
- 复杂路径使用弹簧物理比CSS动画更自然

## 无障碍考虑

```tsx
<div 
  ref={transition({ 
    key: 'accessible-fly', 
    ...fly({ x: -100, y: -50 }) 
  })}
  role="status"
  aria-live="polite"
  aria-label="飞入的内容"
>
  重要通知内容
</div>
```

## 推荐使用场景

- **浮动按钮**：FAB菜单展开
- **工具提示/弹出框**：基于鼠标位置显示
- **通知**：从屏幕边缘进入
- **卡片布局**：网格项目动画
- **仪表板小部件**：动态内容添加