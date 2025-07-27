---
title: "ブラーアニメーション"
description: "ブラー効果で要素を滑らかにフォーカスしたりぼかしたりします"
nav-title: "ブラー"
---

# ブラーアニメーション

ブラー（Blur）アニメーションは、要素にぼかし効果を適用してフォーカスを切り替えたり、背景を滑らかに処理する際に使用します。視覚的な奥行き感と優雅な遷移効果を提供します。

## 基本的な使い方

```tsx
import { transition } from '@ssgoi/react';
import { blur } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'blur-element', ...blur() })}>
          ブラーアニメーションが適用された要素
        </div>
      )}
    </div>
  );
}
```

## オプション

```typescript
interface BlurOptions {
  amount?: number | string;  // ブラー強度（デフォルト：10）
  opacity?: number;          // 開始透明度（デフォルト：0）
  scale?: boolean;           // スケール効果追加（デフォルト：false）
  fade?: boolean;            // フェード効果追加（デフォルト：true）
  spring?: {
    stiffness?: number;      // スプリング強度（デフォルト：300）
    damping?: number;        // 減衰係数（デフォルト：30）
  };
}
```

### オプション説明

- **amount**: ブラーの強度（ピクセル単位またはCSS値）
- **opacity**: 開始透明度（0-1）
- **scale**: ブラーと一緒にスケール効果を適用するか
- **fade**: ブラーと一緒にフェード効果を適用するか
- **spring**: スプリング物理設定

## 使用例

### 強いブラー効果

```tsx
const heavyBlur = blur({
  amount: 20,  // 強いブラー
  spring: { stiffness: 200, damping: 25 }
});

<div ref={transition({ key: 'heavy-blur', ...heavyBlur })}>
  強くぼかされる要素
</div>
```

### ブラー + スケールの組み合わせ

```tsx
const blurScale = blur({
  amount: 15,
  scale: true,  // スケール効果追加
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'blur-scale', ...blurScale })}>
  ぼかしながら縮小する効果
</div>
```

### ブラーのみ（フェードなし）

```tsx
const blurOnly = blur({
  fade: false,     // フェード効果を削除
  opacity: 1,      // 完全不透明状態を維持
  amount: '2rem'   // rem単位使用
});

<div ref={transition({ key: 'blur-only', ...blurOnly })}>
  透明度変化なしでブラーのみ適用
</div>
```

## 実用的な活用例

### 背景ブラー効果

```tsx
function BlurredBackground() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* 背景コンテンツ */}
      <div className="p-8">
        <h1>メインコンテンツ</h1>
        <button onClick={() => setIsModalOpen(true)}>
          モーダルを開く
        </button>
      </div>
      
      {/* ブラーオーバーレイ */}
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

### 画像ローディング効果

```tsx
function BlurredImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative">
      {/* プレースホルダー */}
      {!isLoaded && (
        <div 
          ref={transition({ 
            key: 'image-placeholder', 
            ...blur({ amount: 20 }) 
          })}
          className="absolute inset-0 bg-gray-200"
        />
      )}
      
      {/* 実際の画像 */}
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

### フォーカス切り替え効果

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
          {/* ブラー効果 */}
          {focusedId && focusedId !== id && (
            <div 
              ref={transition({ 
                key: `blur-${id}`, 
                ...blur({ amount: 5, opacity: 0.7 }) 
              })}
              className="absolute inset-0 z-10"
            />
          )}
          
          {/* カード内容 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h3>カード {id}</h3>
            <p>クリックしてフォーカス</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 高度な活用

### 動的ブラー強度

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
        ブラー強度: {blurAmount}px
      </div>
    </div>
  );
}
```

### テキストスポイラー

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

## パフォーマンスに関する考慮事項

- ブラー効果はGPUアクセラレーションを使用しますが、他の効果より演算が多いです
- 大きな領域や多くの要素に同時適用するとパフォーマンスが低下する可能性があります
- モバイルデバイスではブラー強度を下げることを推奨します

### パフォーマンス最適化のヒント

```tsx
// モバイル対応
const isMobile = window.innerWidth < 768;
const optimizedBlur = blur({
  amount: isMobile ? 5 : 15,  // モバイルでブラー強度を減少
  spring: { 
    stiffness: isMobile ? 400 : 300,  // モバイルで高速アニメーション
    damping: 35 
  }
});
```

## ブラウザ互換性

- すべてのモダンブラウザでサポート
- Safariでは`-webkit-backdrop-filter`が必要な場合があります
- IE11はCSSフィルターをサポートしていません

## 推奨される使用例

- **モーダル/ダイアログ**: 背景コンテンツのぼかし
- **画像ローディング**: プレースホルダーから実際の画像への遷移
- **フォーカス効果**: 重要な要素の強調
- **スポイラーテキスト**: クリック前のコンテンツ非表示
- **奥行き感の表現**: UIレイヤーの区別