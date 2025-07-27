---
title: "フェードアニメーション"
description: "滑らかなフェードイン/アウト効果で要素をアニメーションします"
nav-title: "フェード"
---

# フェードアニメーション

フェード（Fade）アニメーションは、要素の透明度を調整して滑らかに表示/非表示にする効果を作ります。最も基本的で広く使用されているアニメーションです。

## 基本的な使い方

```tsx
import { transition } from '@ssgoi/react';
import { fade } from '@ssgoi/react/transitions';

function Component() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible && (
        <div ref={transition({ key: 'fade-element', ...fade() })}>
          フェードアニメーションが適用された要素
        </div>
      )}
    </div>
  );
}
```

## オプション

```typescript
interface FadeOptions {
  from?: number;    // 開始透明度（デフォルト：0）
  to?: number;      // 終了透明度（デフォルト：1）
  spring?: {
    stiffness?: number;  // スプリング強度（デフォルト：300）
    damping?: number;    // 減衰係数（デフォルト：30）
  };
}
```

### オプション説明

- **from**: アニメーション開始時の透明度値（0-1）
- **to**: アニメーション終了時の透明度値（0-1）
- **spring**: スプリング物理設定
  - `stiffness`: 値が大きいほど速いアニメーション
  - `damping`: 値が大きいほど滑らかなアニメーション

## 使用例

### 部分フェード

半透明から始まり、やや透明な状態で終わるフェード：

```tsx
const partialFade = fade({
  from: 0.2,  // 20%の透明度から開始
  to: 0.8,    // 80%の透明度で終了
  spring: { stiffness: 300, damping: 30 }
});

<div ref={transition({ key: 'partial-fade', ...partialFade })}>
  部分フェード効果
</div>
```

### ゆっくりフェード

ゆっくりと滑らかに表示される効果：

```tsx
const slowFade = fade({
  spring: { 
    stiffness: 100,  // 低い強度
    damping: 20      // 低い減衰
  }
});

<div ref={transition({ key: 'slow-fade', ...slowFade })}>
  ゆっくりフェード効果
</div>
```

### 高速フェード

素早く表示される効果：

```tsx
const fastFade = fade({
  spring: { 
    stiffness: 500,  // 高い強度
    damping: 40      // 高い減衰
  }
});

<div ref={transition({ key: 'fast-fade', ...fastFade })}>
  高速フェード効果
</div>
```

## 他のアニメーションとの組み合わせ

フェードは他のアニメーションと組み合わせることで、より豊かな効果を作ることができます：

```tsx
// カスタム組み合わせアニメーション
const fadeAndScale = {
  in: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  }),
  out: (element) => ({
    spring: { stiffness: 300, damping: 30 },
    tick: (progress) => {
      element.style.opacity = progress.toString();
      element.style.transform = `scale(${0.8 + progress * 0.2})`;
    }
  })
};
```

## パフォーマンスに関する考慮事項

- フェードはGPUアクセラレーションを活用し、優れたパフォーマンスを発揮します
- `opacity`の変更はリフローを発生させないため効率的です
- 多くの要素に同時に適用しても滑らかなアニメーションを維持します

## アクセシビリティ

フェードアニメーション使用時はアクセシビリティを考慮してください：

```tsx
<div 
  ref={transition({ key: 'accessible-fade', ...fade() })}
  role="status"
  aria-live="polite"
>
  スクリーンリーダーに通知されるフェード要素
</div>
```

## 推奨される使用例

- **通知メッセージ**: ユーザーへのフィードバック提供時
- **モーダル/ポップアップ**: オーバーレイの表示/非表示
- **画像ギャラリー**: 画像の切り替え効果
- **ローディング状態**: コンテンツの読み込み表示
- **ツールチップ**: ホバー時の情報表示