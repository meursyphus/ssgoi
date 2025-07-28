---
title: "ピンタレストトランジション"
description: "ギャラリーから詳細画面へ展開するPinterestスタイルの遷移"
nav-title: "ピンタレスト"
---

# ピンタレストトランジション

ピンタレストトランジションは、ギャラリーの小さなアイテムが全画面に展開する効果を作成します。PinterestアプリのシグネチャートランジションエフェクトをWebで実現し、視覚的に魅力的で直感的なユーザー体験を提供します。

## コアコンセプト

ピンタレストトランジションは2つのキー属性を使用します：

- **`data-pinterest-gallery-key`**: ギャラリーページのアイテム
- **`data-pinterest-detail-key`**: 詳細ページのコンテナ

同じキー値を持つ要素同士が接続され、展開/縮小アニメーションが発生します。

```
ギャラリーページ                    詳細ページ
┌─────────────────┐            ┌─────────────────┐
│ ┌──┐ ┌──┐ ┌──┐ │            │                 │
│ │▣ │ │  │ │  │ │ ═════════> │       ▣         │
│ └──┘ └──┘ └──┘ │            │                 │
│ gallery-key="1" │            │ detail-key="1"  │
└─────────────────┘            └─────────────────┘
```

## 基本的な使い方

### 1. トランジション設定

```tsx
import { Ssgoi } from '@ssgoi/react';
import { pinterest } from '@ssgoi/react/view-transitions';

const config = {
  transitions: [
    {
      from: '/gallery',
      to: '/gallery/*',
      transition: pinterest(),
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

### 2. ギャラリーページ

```tsx
export function Gallery() {
  return (
    <div className="masonry-grid">
      {items.map(item => (
        <Link 
          key={item.id} 
          href={`/gallery/${item.id}`}
          data-pinterest-gallery-key={item.id}
          className="gallery-item"
        >
          <img src={item.thumbnail} alt={item.title} />
          <h3>{item.title}</h3>
        </Link>
      ))}
    </div>
  );
}
```

### 3. 詳細ページ

```tsx
export function GalleryDetail({ item }) {
  return (
    <div 
      data-pinterest-detail-key={item.id}
      className="detail-container"
    >
      <img src={item.fullImage} alt={item.title} />
      <h1>{item.title}</h1>
      <p>{item.description}</p>
    </div>
  );
}
```

## オプション

```tsx
pinterest({
  spring: {
    stiffness: 50,   // スプリングの硬さ（デフォルト：50）
    damping: 10      // 減衰係数（デフォルト：10）
  },
  timeout: 300       // ページマッチングタイムアウト（デフォルト：300ms）
})
```

## 動作原理

### ギャラリー → 詳細（エンターモード）

1. ギャラリーアイテムの位置とサイズを計算
2. clip-pathを使用してアイテムエリアから開始
3. 全画面に展開しながらclip-pathアニメーション
4. 同時にscaleとtranslateを適用

```
開始: 小さなカード      中間: 展開中          完了: 全画面
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│┌──┐         │        │ ┌────────┐  │        │             │
││▣ │         │   =>   │ │   ▣    │  │   =>   │      ▣      │
│└──┘         │        │ └────────┘  │        │             │
└─────────────┘        └─────────────┘        └─────────────┘
```

### 詳細 → ギャラリー（エグジットモード）

1. 詳細画面からギャラリーアイテム位置を計算
2. clip-pathでギャラリーアイテムサイズに縮小
3. 元の位置に移動しながらフェードアウト

## 高度な使用例

### メーソンリーレイアウトと組み合わせ

```tsx
// ギャラリーページ
<div className="masonry-grid">
  {items.map((item, index) => (
    <div 
      key={item.id}
      data-pinterest-gallery-key={item.id}
      className="masonry-item"
      style={{ 
        gridRowEnd: `span ${item.height}`,
        animationDelay: `${index * 50}ms` 
      }}
    >
      <Link href={`/gallery/${item.id}`}>
        <img src={item.thumbnail} alt={item.title} />
      </Link>
    </div>
  ))}
</div>
```

### 画像のプリロード

```tsx
// 詳細ページ - スムーズなトランジションのための画像プリロード
export function GalleryDetail({ item }) {
  useEffect(() => {
    // 高解像度画像をプリロード
    const img = new Image();
    img.src = item.fullImage;
  }, [item.fullImage]);

  return (
    <div data-pinterest-detail-key={item.id}>
      {/* コンテンツ */}
    </div>
  );
}
```

## スタイリングの考慮事項

### ギャラリーアイテム

```css
.gallery-item {
  /* Pinterest効果のための基本スタイル */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.gallery-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

### 詳細コンテナ

```css
.detail-container {
  /* 全画面活用 */
  min-height: 100vh;
  width: 100%;
  
  /* コンテンツ配置 */
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

## 注意事項

### 1. キールール
- ページあたり1つの`data-pinterest-detail-key`のみ使用
- ギャラリーキーと詳細キーは正確に一致する必要がある
- 数値と文字列の両方をキーとして使用可能

### 2. レイアウト要件
- ギャラリーアイテムには明確な境界が必要
- 詳細ページは全画面レイアウトが効果的
- レスポンシブデザインを考慮

### 3. パフォーマンス最適化
- 画像は適切なサイズに最適化
- サムネイルとフル画像を分けて使用
- 遅延読み込みの適用を推奨

## 推奨される使用ケース

- 📷 画像ギャラリー
- 🛍️ ECサイトの商品リスト
- 📌 ピンボードスタイルのレイアウト
- 🎨 ポートフォリオギャラリー
- 📰 カードベースのコンテンツリスト

## ヒーロー vs ピンタレスト

| 特徴 | ヒーロートランジション | ピンタレストトランジション |
|------|---------------------|--------------------------|
| 用途 | 個別要素の移動 | 全画面展開 |
| アニメーション | 位置とサイズの変形 | Clip-path展開 |
| 複雑さ | 複数要素可能 | 単一コンテナ |
| 効果 | 要素間の接続性 | 没入感のある展開 |