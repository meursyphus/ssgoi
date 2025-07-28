---
title: "フライアニメーション"
description: "要素が特定の位置から飛んでくるような効果を作ります"
nav-title: "フライ"
---

# フライアニメーション

フライ（Fly）アニメーションは、要素が特定の座標から飛んでくる効果を作ります。X、Y座標の両方を制御できるため、対角線の移動や複雑な進入効果を実装できます。

## 基本的な使い方

```tsx
import { transition } from '@ssgoi/react';
import { fly } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fly-element', ...fly() })}>
          フライアニメーションが適用された要素
        </div>
      )}
    </div>
  );
}
```

## オプション

```typescript
interface FlyOptions {
  x?: number | string;    // X軸移動距離（デフォルト：0）
  y?: number | string;    // Y軸移動距離（デフォルト：-100）
  opacity?: number;       // 開始透明度（デフォルト：0）
  spring?: {
    stiffness?: number;   // スプリング強度（デフォルト：400）
    damping?: number;     // 減衰係数（デフォルト：35）
  };
}
```

### オプション説明

- **x**: 横方向の開始位置（正：右、負：左）
- **y**: 縦方向の開始位置（正：下、負：上）
- **opacity**: 開始透明度（0-1）
- **spring**: スプリング物理設定

## 使用例

### 様々な方向から飛んでくる

```tsx
// 上から飛んでくる（デフォルト）
const flyFromTop = fly();

// 下から飛んでくる
const flyFromBottom = fly({ 
  y: 100 
});

// 左から飛んでくる
const flyFromLeft = fly({ 
  x: -200, 
  y: 0 
});

// 右から飛んでくる
const flyFromRight = fly({ 
  x: 200, 
  y: 0 
});

// 対角線（左上）
const flyDiagonal = fly({ 
  x: -150, 
  y: -150 
});
```

### 単位指定

```tsx
// ピクセル単位（デフォルト）
const flyPixels = fly({ 
  x: 100, 
  y: -50 
});

// rem単位
const flyRem = fly({ 
  x: '5rem', 
  y: '-3rem' 
});

// ビューポート単位
const flyViewport = fly({ 
  x: '50vw', 
  y: '-100vh' 
});

// パーセント単位
const flyPercent = fly({ 
  x: '200%', 
  y: '0%' 
});
```

### 透明度調整

```tsx
// 半透明から開始
const flyWithOpacity = fly({ 
  x: 0, 
  y: -100, 
  opacity: 0.2  // 20%透明度から開始
});

// 完全不透明（フライのみ）
const flyNoFade = fly({ 
  x: -100, 
  y: 0, 
  opacity: 1  // フェード効果なし
});
```

## 実用的な活用例

### フローティングアクションボタン（FAB）

```tsx
function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4">
      {/* メインボタン */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg"
      >
        +
      </button>
      
      {/* サブボタン */}
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

### カードグリッドアニメーション

```tsx
function CardGrid({ cards }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, index) => {
        // 各カードが異なる方向から飛んでくる
        const row = Math.floor(index / 3);
        const col = index % 3;
        
        return (
          <div
            key={card.id}
            ref={transition({ 
              key: `card-${card.id}`, 
              ...fly({ 
                x: (col - 1) * 100,  // 中央列は0、左右は±100
                y: row * 50,         // 下の行ほど下から
                spring: { 
                  stiffness: 300, 
                  damping: 30 + index * 2  // 順次的効果
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

### ツールチップアニメーション

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
              y: 10,  // 下から少し上がる
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

### 通知スタック

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
              x: 300,  // 右から飛んでくる
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

## 高度な活用

### マウス位置ベースのフライ

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
              x: -item.x,  // クリック位置から中央へ
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

### スタガードフライアニメーション

```tsx
function StaggeredFly({ items }) {
  const [visibleItems, setVisibleItems] = useState([]);
  
  useEffect(() => {
    // 順次的にアイテムを表示
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
              x: -50 - index * 10,  // 徐々に遠くから
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

## パフォーマンス最適化

- `transform: translate()`はGPUアクセラレーションを使用します
- XとYを同時にアニメーションしても単一のtransformで処理されます
- 複雑な経路はCSSアニメーションよりスプリング物理の方が自然です

## アクセシビリティの考慮事項

```tsx
<div 
  ref={transition({ 
    key: 'accessible-fly', 
    ...fly({ x: -100, y: -50 }) 
  })}
  role="status"
  aria-live="polite"
  aria-label="飛んでくるコンテンツ"
>
  重要な通知内容
</div>
```

## 推奨される使用例

- **フローティングボタン**: FABメニューの展開
- **ツールチップ/ポップオーバー**: マウス位置ベースの表示
- **通知**: 画面端からの進入
- **カードレイアウト**: グリッドアイテムのアニメーション
- **ダッシュボードウィジェット**: 動的コンテンツの追加