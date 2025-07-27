---
title: "ヒーロートランジション"
description: "共有要素がページ間で自然に移動するトランジション効果"
nav-title: "ヒーロー"
---

# ヒーロートランジション

ヒーロートランジションは、2つのページ間で共有される要素が自然に移動し、変形する効果を作成します。リストから詳細ビューに画像やカードが拡大するような、没入感のあるトランジション体験を提供します。

## コアコンセプト

ヒーロートランジションを使用するには、アニメーションさせたい要素に`data-hero-key`属性を追加します。同じキーを持つ要素同士が接続され、ページ間でアニメーションします。

```
ページ A                    ページ B
┌─────────────┐            ┌─────────────┐
│ ┌─────────┐ │            │             │
│ │ key="1" │ │ ══════════>│   key="1"   │
│ └─────────┘ │            │             │
└─────────────┘            └─────────────┘
```

## 基本的な使い方

### 1. トランジション設定

```tsx
import { Ssgoi } from '@ssgoi/react';
import { hero } from '@ssgoi/react/view-transitions';

const config = {
  transitions: [
    {
      from: '/products',
      to: '/products/*',
      transition: hero(),
      symmetric: true
    }
  ]
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* アプリケーションコンテンツ */}
    </Ssgoi>
  );
}
```

### 2. 要素にキーを追加

**リストページ：**
```tsx
export function ProductList() {
  return (
    <div className="grid">
      {products.map(product => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <img 
            data-hero-key={`product-image-${product.id}`}
            src={product.thumbnail}
            alt={product.name}
          />
          <h3 data-hero-key={`product-title-${product.id}`}>
            {product.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}
```

**詳細ページ：**
```tsx
export function ProductDetail({ product }) {
  return (
    <div>
      <img 
        data-hero-key={`product-image-${product.id}`}
        src={product.fullImage}
        alt={product.name}
      />
      <h1 data-hero-key={`product-title-${product.id}`}>
        {product.name}
      </h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## オプション

```tsx
hero({
  spring: {
    stiffness: 300,  // スプリングの硬さ（デフォルト：300）
    damping: 30      // 減衰係数（デフォルト：30）
  },
  timeout: 300       // ページマッチングタイムアウト（デフォルト：300ms）
})
```

## 高度な使用例

### 複数要素の同時トランジション

```tsx
// 画像、タイトル、価格がすべてヒーロートランジション
<article>
  <img data-hero-key={`hero-img-${id}`} src={image} />
  <h2 data-hero-key={`hero-title-${id}`}>{title}</h2>
  <span data-hero-key={`hero-price-${id}`}>¥{price}</span>
</article>
```

### 動的キー生成

```tsx
// カテゴリー別に異なるヒーローグループ
<div data-hero-key={`${category}-item-${id}`}>
  {content}
</div>
```

## 動作原理

1. **マッチング**: 出ていくページと入ってくるページで同じ`data-hero-key`を探す
2. **計算**: 要素の開始位置と終了位置、サイズの差を計算
3. **変形**: 位置（translate）とサイズ（scale）を同時にアニメーション
4. **クリーンアップ**: アニメーション完了後にスタイルをリセット

```
開始状態          中間状態          最終状態
┌──┐              ┌────┐            ┌──────┐
│  │ ──────────> │    │ ────────> │      │
└──┘              └────┘            └──────┘
位置 A            移動中            位置 B
サイズ S          変形中            サイズ L
```

## 注意事項

### 1. キーの一意性
- ページ内で`data-hero-key`は一意である必要があります
- 動的データの場合はIDを含むキーを推奨

### 2. 要素のマッチング
- 同じキーを持つ要素がない場合は通常のトランジションにフォールバック
- 複数の要素が同じキーを持つ場合は最初の要素のみアニメーション

### 3. スタイルの考慮事項
- トランジション中は`position: relative`が一時的に適用
- `transform-origin`は`top left`に設定
- アニメーション後は元のスタイルに復元

## 推奨される使用ケース

- 📸 画像ギャラリー → 画像詳細表示
- 🛍️ 商品リスト → 商品詳細ページ
- 📝 カードレイアウト → フルスクリーンビュー
- 👤 プロフィールサムネイル → プロフィールページ
- 🎵 アルバムカバー → プレイヤー画面

## パフォーマンス最適化

- 過多な要素にヒーローキーを使用しない
- 複雑なDOM構造より単純な要素に適用
- 画像は適切なサイズに最適化
- `will-change: transform`はSsgoiが自動処理