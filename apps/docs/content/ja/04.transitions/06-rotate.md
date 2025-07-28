---
title: "回転アニメーション"
description: "要素を回転させて動的で活気のある効果を作ります"
nav-title: "回転"
---

# 回転アニメーション

回転（Rotate）アニメーションは、要素を2Dまたは3D空間で回転させる効果を作ります。楽しくて目を引くアニメーションで、ユーザーの注目を集めることができます。

## 基本的な使い方

```tsx
import { transition } from '@ssgoi/react';
import { rotate } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'rotate-element', ...rotate() })}>
          回転アニメーションが適用された要素
        </div>
      )}
    </div>
  );
}
```

## オプション

```typescript
interface RotateOptions {
  degrees?: number;        // 回転角度（デフォルト：360）
  clockwise?: boolean;     // 時計回りかどうか（デフォルト：true）
  scale?: boolean;         // スケール効果追加（デフォルト：false）
  fade?: boolean;          // フェード効果追加（デフォルト：false）
  origin?: string;         // 回転中心点（デフォルト：'center'）
  axis?: '2d' | 'x' | 'y' | 'z';  // 回転軸（デフォルト：'2d'）
  perspective?: number;    // 3D遠近感（デフォルト：800）
  spring?: {
    stiffness?: number;    // スプリング強度（デフォルト：500）
    damping?: number;      // 減衰係数（デフォルト：25）
  };
}
```

### オプション説明

- **degrees**: 回転角度（360 = 一回転）
- **clockwise**: trueで時計回り、falseで反時計回り
- **scale**: 回転と一緒にサイズ変化効果
- **fade**: 回転と一緒にフェード効果
- **origin**: 回転中心点（CSS transform-origin値）
- **axis**: 回転軸
  - `'2d'`: 平面回転（デフォルト）
  - `'x'`: X軸回転（上下に反転）
  - `'y'`: Y軸回転（左右に反転）
  - `'z'`: Z軸回転（平面回転と同じ）
- **perspective**: 3D回転時の遠近感距離
- **spring**: スプリング物理設定

## 使用例

### 基本的な回転バリエーション

```tsx
// 半回転
const halfRotate = rotate({ 
  degrees: 180 
});

// 反時計回り回転
const counterClockwise = rotate({ 
  clockwise: false 
});

// 二回転
const doubleRotate = rotate({ 
  degrees: 720 
});

// 小さい回転
const smallRotate = rotate({ 
  degrees: 45 
});
```

### 3D回転

```tsx
// X軸回転（カード反転効果）
const flipX = rotate({ 
  axis: 'x',
  degrees: 180,
  perspective: 1000
});

// Y軸回転（ドア開き効果）
const flipY = rotate({ 
  axis: 'y',
  degrees: 90,
  perspective: 800
});

// Z軸回転（平面回転）
const rotateZ = rotate({ 
  axis: 'z',
  degrees: 360
});
```

### 回転中心点の変更

```tsx
// 左上基準の回転
const topLeftRotate = rotate({ 
  origin: 'top left',
  degrees: 90
});

// 右下基準の回転
const bottomRightRotate = rotate({ 
  origin: 'bottom right',
  degrees: -90
});

// カスタム中心点
const customOrigin = rotate({ 
  origin: '25% 75%',
  degrees: 180
});
```

### 複合効果

```tsx
// 回転 + スケール
const rotateScale = rotate({ 
  degrees: 360,
  scale: true
});

// 回転 + フェード
const rotateFade = rotate({ 
  degrees: 720,
  fade: true
});

// 回転 + スケール + フェード
const rotateAll = rotate({ 
  degrees: 360,
  scale: true,
  fade: true,
  spring: { stiffness: 300, damping: 20 }
});
```

## 実用的な活用例

### ローディングスピナー

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

### カード反転

```tsx
function FlipCard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="relative w-64 h-96 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 表面 */}
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
      
      {/* 裏面 */}
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

### リフレッシュボタン

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

### アイコントランジション

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

## 高度な活用

### 多段階回転

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
        次の段階
      </button>
    </div>
  );
}
```

### マウス追跡回転

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

### 3Dキューブ回転

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
        {/* キューブの各面 */}
        <div className="absolute inset-0 bg-red-500">前</div>
        <div className="absolute inset-0 bg-blue-500 rotate-y-90">右</div>
        <div className="absolute inset-0 bg-green-500 rotate-y-180">後</div>
        <div className="absolute inset-0 bg-yellow-500 rotate-y-270">左</div>
      </div>
      
      <button onClick={() => setFace((f) => (f + 1) % 4)}>
        次の面
      </button>
    </div>
  );
}
```

## パフォーマンス最適化

- `transform: rotate()`はGPUアクセラレーションを使用します
- 3D回転時に`will-change: transform`を使用するとパフォーマンスが向上
- 多くの要素の同時回転はパフォーマンスに影響を与える可能性があるため注意

## アクセシビリティの考慮事項

```tsx
<div 
  ref={transition({ 
    key: 'accessible-rotate', 
    ...rotate() 
  })}
  role="img"
  aria-label="回転するロゴ"
  aria-live="polite"
>
  <Logo />
</div>
```

## 推奨される使用例

- **ローディングインジケーター**: スピナー、進行表示
- **アイコン切り替え**: 状態変更時のアイコン回転
- **カードインタラクション**: 表裏反転効果
- **リフレッシュ**: 更新ボタンアニメーション
- **ゲーム要素**: ルーレット、サイコロなどのゲームUI