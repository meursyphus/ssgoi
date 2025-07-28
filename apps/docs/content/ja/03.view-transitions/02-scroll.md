---
title: "スクロールトランジション"
description: "ページが上下にスクロールしながら切り替わる効果"
nav-title: "スクロール"
---

# スクロールトランジション

スクロールトランジションは、ページが上または下にスライドしながら切り替わる効果を作成します。モバイルアプリでよく見られる自然なページ遷移をWebで実現します。

## 基本的な使い方

```tsx
import { Ssgoi } from '@ssgoi/react';
import { scroll } from '@ssgoi/react/view-transitions';

const config = {
  defaultTransition: scroll()
};

export default function App() {
  return (
    <Ssgoi config={config}>
      {/* アプリケーションコンテンツ */}
    </Ssgoi>
  );
}
```

## オプション

### 方向の設定

```tsx
scroll({
  direction: 'up',    // 'up' | 'down' (デフォルト: 'up')
  spring: {
    stiffness: 300,   // スプリングの硬さ（デフォルト：300）
    damping: 30       // 減衰係数（デフォルト：30）
  }
})
```

### 方向別の動作

- **`direction: 'up'`** (デフォルト)
  - 入ってくるページ：下から上へスライド
  - 出ていくページ：上へ消える
  
- **`direction: 'down'`**
  - 入ってくるページ：上から下へスライド
  - 出ていくページ：下へ消える

## 使用例

### 上へスクロール（デフォルト）

```tsx
const config = {
  defaultTransition: scroll()
};
```

### 下へスクロール

```tsx
const config = {
  defaultTransition: scroll({ direction: 'down' })
};
```

### スムーズなスクロール

```tsx
const config = {
  defaultTransition: scroll({
    spring: {
      stiffness: 150,
      damping: 25
    }
  })
};
```

## ルート別の方向設定

階層構造に基づいて異なる方向を設定：

```tsx
const config = {
  transitions: [
    {
      from: '/list',
      to: '/detail/*',
      transition: scroll({ direction: 'up' }),
      symmetric: true  // 逆方向は自動的に'down'
    },
    {
      from: '/parent',
      to: '/child',
      transition: scroll({ direction: 'down' })
    }
  ]
};

<Ssgoi config={config}>
  {/* アプリケーションコンテンツ */}
</Ssgoi>
```

## 動作原理

```
方向: UP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
出ていくページ → 上へ移動 (translateY: 0 → -100%)
入ってくるページ → 下から上へ (translateY: 100% → 0)

方向: DOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
出ていくページ → 下へ移動 (translateY: 0 → 100%)
入ってくるページ → 上から下へ (translateY: -100% → 0)
```

## 利点

- ページ階層構造を表現する直感的な方向性
- モバイルアプリに似た自然なUX
- GPU加速を活用したスムーズなパフォーマンス
- スクロールジェスチャーと一貫した動作

## 推奨される使用ケース

### UP方向
- リスト → 詳細ページ
- ホーム → サブページ
- 一般的なフォワードナビゲーション

### DOWN方向
- 親 → 子関係
- メニュー → サブメニュー
- モーダルやオーバーレイの表示

## 注意事項

- ビューポートより長いページの場合、遷移開始位置が重要
- スクロール位置は自動的に保持されるため、追加処理不要
- 双方向ナビゲーションには`symmetric: true`の使用を推奨