---
title: "バウンスアニメーション"
description: "要素が弾むような生き生きとした効果を作ります"
nav-title: "バウンス"
---

# バウンスアニメーション

バウンス（Bounce）アニメーションは、要素が弾み跳ねるような効果を作り出し、楽しく生き生きとしたインタラクションを提供します。注目を集めたり、楽しいユーザー体験を作る際に効果的です。

## 基本的な使い方

```tsx
import { transition } from '@ssgoi/react';
import { bounce } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'bounce-element', ...bounce() })}>
          バウンスアニメーションが適用された要素
        </div>
      )}
    </div>
  );
}
```

## オプション

```typescript
interface BounceOptions {
  height?: number;         // バウンスの高さ（デフォルト：20）
  intensity?: number;      // バウンスの強度（デフォルト：1）
  scale?: boolean;         // スケール効果追加（デフォルト：true）
  fade?: boolean;          // フェード効果追加（デフォルト：false）
  direction?: 'up' | 'down';  // バウンス方向（デフォルト：'up'）
  spring?: {
    stiffness?: number;    // スプリング強度（デフォルト：800）
    damping?: number;      // 減衰係数（デフォルト：15）
  };
}
```

### オプション説明

- **height**: バウンス最大高さ（ピクセル）
- **intensity**: バウンス回数と強度（1 = 基本、2 = 倍）
- **scale**: バウンスと一緒にサイズ変化効果
- **fade**: バウンスと一緒にフェード効果
- **direction**: バウンス方向
  - `'up'`: 上に弾む
  - `'down'`: 下に落ちる
- **spring**: スプリング物理設定（高いstiffness = 速いバウンス）

## 使用例

### バウンス強度の調整

```tsx
// ソフトなバウンス
const softBounce = bounce({ 
  height: 10,
  intensity: 0.5,
  spring: { stiffness: 600, damping: 20 }
});

// 強いバウンス
const strongBounce = bounce({ 
  height: 30,
  intensity: 2,
  spring: { stiffness: 1000, damping: 10 }
});

// 微細なバウンス
const subtleBounce = bounce({ 
  height: 5,
  intensity: 0.3
});
```

### 方向変更

```tsx
// 上にバウンス（デフォルト）
const bounceUp = bounce({ 
  direction: 'up' 
});

// 下にバウンス（落下効果）
const bounceDown = bounce({ 
  direction: 'down',
  height: 25
});
```

### 複合効果

```tsx
// バウンス + フェード
const bounceFade = bounce({ 
  fade: true,
  height: 20
});

// バウンスのみ（スケールなし）
const bounceOnly = bounce({ 
  scale: false,
  height: 15
});

// すべての効果を組み合わせ
const bounceAll = bounce({ 
  height: 25,
  intensity: 1.5,
  scale: true,
  fade: true,
  spring: { stiffness: 700, damping: 12 }
});
```

## 実用的な活用例

### いいねボタン

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
      
      {/* いいねカウントアニメーション */}
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

### 通知ベル

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

### 成功メッセージ

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

### ドロップアニメーション

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
          {item.name} (ドロップ済み!)
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

## 高度な活用

### 連続バウンス

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

### 弾性メニュー

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
                  height: 20 - index * 3,  // 段階的に減少
                  intensity: 1,
                  spring: { 
                    stiffness: 800 - index * 50,  // 順次効果
                    damping: 15 
                  }
                }) 
              })}
              className="block w-full px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
              style={{ 
                transitionDelay: `${index * 50}ms`  // スタガー効果
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

### ボール弾みシミュレーション

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

## パフォーマンス最適化

- バウンスは`transform: translateY()`を使用してGPUアクセラレーションされます
- 高い`intensity`値はより多くの計算を必要とします
- 複数要素の同時バウンスはパフォーマンスを考慮する必要があります

### パフォーマンスのヒント

```tsx
// モバイル最適化
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

## アクセシビリティの考慮事項

```tsx
<button
  ref={transition({ 
    key: 'accessible-bounce', 
    ...bounce() 
  })}
  aria-label="新しい通知があります"
  aria-live="polite"
  aria-atomic="true"
>
  <NotificationIcon />
</button>
```

## 推奨される使用例

- **インタラクションフィードバック**: ボタンクリック、いいね
- **通知**: 新着メッセージ、アップデート通知
- **成功/完了状態**: タスク完了表示
- **ゲーム要素**: スコア獲得、アイテム収集
- **チュートリアル**: 注目すべき要素の強調