---
title: "スケールアニメーション"
description: "要素のサイズを調整して拡大/縮小効果を作ります"
nav-title: "スケール"
---

# スケールアニメーション

スケール（Scale）アニメーションは、要素のサイズを変更して拡大または縮小する効果を作ります。注目度を高めたり、視覚的な階層を表現する際に効果的です。

## 基本的な使い方

```tsx
import { transition } from '@ssgoi/react';
import { scale } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'scale-element', ...scale() })}>
          スケールアニメーションが適用された要素
        </div>
      )}
    </div>
  );
}
```

## オプション

```typescript
interface ScaleOptions {
  start?: number;      // 開始サイズ倍率（デフォルト：0）
  opacity?: number;    // 開始透明度（デフォルト：0）
  axis?: 'x' | 'y' | 'both';  // スケール方向（デフォルト：'both'）
  spring?: {
    stiffness?: number;  // スプリング強度（デフォルト：300）
    damping?: number;    // 減衰係数（デフォルト：30）
  };
}
```

### オプション説明

- **start**: アニメーション開始時のサイズ（0 = 0%、1 = 100%）
- **opacity**: 開始透明度（0-1）
- **axis**: スケールが適用される軸
  - `'both'`: X軸とY軸の両方（デフォルト）
  - `'x'`: 横方向のみ
  - `'y'`: 縦方向のみ
- **spring**: スプリング物理設定

## 使用例

### 軸方向のスケール

#### X軸スケール（横方向拡張）

```tsx
const scaleX = scale({
  axis: 'x',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-x', ...scaleX })}>
  横方向にのみ拡張する要素
</div>
```

#### Y軸スケール（縦方向拡張）

```tsx
const scaleY = scale({
  axis: 'y',
  spring: { stiffness: 400, damping: 35 }
});

<div ref={transition({ key: 'scale-y', ...scaleY })}>
  縦方向にのみ拡張する要素
</div>
```

### 部分スケール

小さいサイズから始まる効果：

```tsx
const partialScale = scale({
  start: 0.5,     // 50%のサイズから開始
  opacity: 0.3,   // 30%の透明度から開始
});

<div ref={transition({ key: 'partial-scale', ...partialScale })}>
  半分のサイズから始まる要素
</div>
```

### バウンス効果付きスケール

スプリング設定でバウンス効果を追加：

```tsx
const bounceScale = scale({
  spring: { 
    stiffness: 200,  // 低い強度でバウンス
    damping: 15      // 低い減衰で振動を増加
  }
});

<div ref={transition({ key: 'bounce-scale', ...bounceScale })}>
  弾むようなスケール効果
</div>
```

## 実用的な活用例

### カードホバー効果

```tsx
function Card() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div 
          ref={transition({ 
            key: 'card-hover', 
            ...scale({ start: 0.95, opacity: 0.8 }) 
          })}
          className="absolute inset-0 bg-blue-500/20 rounded-lg"
        />
      )}
      <div className="p-4">カード内容</div>
    </div>
  );
}
```

### モーダル表示効果

```tsx
function Modal({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div 
            ref={transition({ 
              key: 'modal', 
              ...scale({ start: 0.8, opacity: 0 }) 
            })}
            className="bg-white rounded-lg p-6 shadow-xl"
          >
            <h2>モーダルタイトル</h2>
            <p>モーダル内容</p>
            <button onClick={onClose}>閉じる</button>
          </div>
        </div>
      )}
    </>
  );
}
```

### アイコンアニメーション

```tsx
function AnimatedIcon() {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button onClick={() => setIsActive(!isActive)}>
      {isActive ? (
        <HeartFilledIcon 
          ref={transition({ 
            key: 'heart-icon', 
            ...scale({ start: 0, spring: { stiffness: 600, damping: 20 } }) 
          })} 
        />
      ) : (
        <HeartOutlineIcon />
      )}
    </button>
  );
}
```

## パフォーマンス最適化

- `transform: scale()`はGPUアクセラレーションを使用し、優れたパフォーマンスを発揮します
- レイアウト変更を起こさないため、リフローが発生しません
- 多くの要素に同時適用してもスムーズなアニメーションを維持します

### パフォーマンスのヒント

```tsx
// 良い例：transform使用
const goodScale = scale(); // transform: scale() 使用

// 避けるべき例：width/height直接変更
const badScale = {
  in: (element) => ({
    tick: (progress) => {
      // リフロー発生！
      element.style.width = `${progress * 100}px`;
      element.style.height = `${progress * 100}px`;
    }
  })
};
```

## アクセシビリティの考慮事項

```tsx
<button
  ref={transition({ 
    key: 'accessible-button', 
    ...scale({ start: 0.9 }) 
  })}
  aria-label="拡大するボタン"
  className="focus:outline-none focus:ring-2"
>
  クリックしてください
</button>
```

## 推奨される使用例

- **ボタン/アイコン**: クリックフィードバックやホバー効果
- **カード/タイル**: 選択状態やフォーカス表示
- **モーダル/ポップアップ**: 登場と退場のアニメーション
- **画像ギャラリー**: サムネイル拡大効果
- **チャート/グラフ**: データ視覚化要素の強調