---
title: "スライドアニメーション"
description: "要素を特定の方向にスライドさせて動的な移動効果を作成します"
nav-title: "スライド"
---

# スライドアニメーション

スライド（Slide）アニメーションは、要素を特定の方向から滑らかに表示または非表示にします。方向性のある遷移が必要な場合に効果的です。

## 基本的な使い方

```tsx
import { transition } from '@ssgoi/react';
import { slide } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'slide-element', ...slide() })}>
          スライドアニメーションが適用された要素
        </div>
      )}
    </div>
  );
}
```

## オプション

```typescript
interface SlideOptions {
  direction?: 'left' | 'right' | 'up' | 'down';  // スライド方向（デフォルト: 'left'）
  distance?: number | string;   // 移動距離（デフォルト: 100）
  opacity?: number;            // 開始時の不透明度（デフォルト: 0）
  fade?: boolean;              // フェード効果の追加（デフォルト: true）
  axis?: 'x' | 'y';          // 移動軸（directionの代替）
  spring?: {
    stiffness?: number;        // スプリングの硬さ（デフォルト: 400）
    damping?: number;          // 減衰係数（デフォルト: 35）
  };
}
```

### オプション説明

- **direction**: スライド方向
  - `'left'`: 左から登場
  - `'right'`: 右から登場
  - `'up'`: 上から登場
  - `'down'`: 下から登場
- **distance**: 移動距離（ピクセルまたはCSS単位）
- **opacity**: 開始時の不透明度（0-1）
- **fade**: スライドと同時にフェード効果を使用
- **axis**: シンプルな軸指定（'x' または 'y'）
- **spring**: スプリング物理設定

## 使用例

### 方向別スライド

```tsx
// 左からスライド
const slideLeft = slide({ 
  direction: 'left' 
});

// 右からスライド
const slideRight = slide({ 
  direction: 'right' 
});

// 上からスライド
const slideUp = slide({ 
  direction: 'up' 
});

// 下からスライド
const slideDown = slide({ 
  direction: 'down' 
});
```

### 距離の調整

```tsx
// 短い距離
const shortSlide = slide({
  direction: 'left',
  distance: 50  // 50pxのみ移動
});

// 長い距離
const longSlide = slide({
  direction: 'right',
  distance: '100vw'  // 画面幅分移動
});

// rem単位の使用
const remSlide = slide({
  direction: 'up',
  distance: '5rem'
});
```

### フェードなしのスライド

```tsx
const slideNoFade = slide({
  direction: 'left',
  fade: false,      // フェード効果を削除
  opacity: 1        // 完全不透明な状態を維持
});
```

## 実用的な活用例

### サイドバーメニュー

```tsx
function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <>
          {/* 背景オーバーレイ */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* サイドバー */}
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
              <h2>メニュー</h2>
              {/* メニューアイテム */}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
```

### 通知トースト

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

### タブコンテンツの切り替え

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
          タブ1の内容
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
          タブ2の内容
        </div>
      )}
    </div>
  );
}
```

### カルーセルスライド

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
            alt={`スライド ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ))}
    </div>
  );
}
```

## 高度な活用

### 軸ベースのスライド

```tsx
// X軸スライド（左右）
const slideX = slide({
  axis: 'x',  // directionの代わりにaxisを使用
  distance: 200
});

// Y軸スライド（上下）
const slideY = slide({
  axis: 'y',
  distance: 150
});
```

### 連続アニメーション

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
          ステップ1
        </div>
      )}
      
      {step >= 1 && (
        <div 
          ref={transition({ 
            key: 'step-2', 
            ...slide({ direction: 'right', distance: 50 }) 
          })}
        >
          ステップ2
        </div>
      )}
      
      <button onClick={() => setStep(step + 1)}>次へ</button>
    </div>
  );
}
```

### レスポンシブスライド

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
      レスポンシブスライド
    </div>
  );
}
```

## パフォーマンス最適化

- `transform: translate()`はGPUアクセラレーションを使用するため、パフォーマンスが優れています
- レイアウトを変更しないため、リフローが発生しません
- 多数の要素に同時に適用してもスムーズなアニメーションを維持

### パフォーマンスのヒント

```tsx
// 良い例: transformを使用
const goodSlide = slide(); // transform: translateX/Yを使用

// 避けるべき例: positionを直接変更
const badSlide = {
  in: (element) => ({
    tick: (progress) => {
      // リフローが発生！
      element.style.left = `${(1 - progress) * -100}px`;
    }
  })
};
```

## アクセシビリティの考慮事項

```tsx
<div 
  ref={transition({ 
    key: 'accessible-slide', 
    ...slide() 
  })}
  role="region"
  aria-live="polite"
  aria-label="スライドコンテンツ"
>
  アクセシブルなスライドコンテンツ
</div>
```

## 推奨される使用例

- **ナビゲーションメニュー**: サイドバー、ドロップダウン
- **通知/トースト**: 画面端からの表示
- **タブ/ステップ切り替え**: 方向性のあるコンテンツ遷移
- **画像ギャラリー**: スライドショー、カルーセル
- **フォームステップ**: 多段階フォームのステップ間遷移