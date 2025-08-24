import { HomeMessages } from "../types/home";

export const home: HomeMessages = {
  title: "モダンウェブアプリのための\n美しいページトランジション",
  getStarted: "はじめる",
  readMore: "ドキュメントを読む",
  // Hero Section
  badge: {
    text: "SSR対応",
  },
  heroTitle: {
    line1: "ビュー",
    line2: "トランジション",
  },
  subtitle: (
    <>
      ウェブに<span className="font-semibold text-white">ネイティブアプリのようなページトランジション</span>を構築。
    </>
  ),
  description: "Next.js、Nuxt、SvelteKitなどのすべてのSSRフレームワークと完全に互換性があります。SEOを犠牲にすることなく、素晴らしいアニメーションを作成できます。",
  buttons: {
    getStarted: "はじめる",
    github: "GitHub",
    demo: "デモを試す",
  },
  quickInstall: {
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
    solidjs: "SolidJS (近日公開)",
    qwik: "Qwik (近日公開)",
  },
  floatingBadges: {
    performance: "常に60fps",
    stateMemory: "状態記憶",
  },
  // Framework Support Section
  frameworks: {
    title: (
      <>
        <span className="gradient-orange">すべての環境</span>で同じ体験
      </>
    ),
    subtitle: "フレームワークに関係なく一貫したAPIを使用",
    comingSoon: "(近日公開)",
  },
  // Why SSGOI Section
  whySSGOI: {
    title: (
      <>
        なぜ<span className="gradient-orange">SSGOI</span>？
      </>
    ),
    subtitle: "この3つを覚えるだけ",
    features: {
      ssr: {
        title: "完璧なSSRサポート",
        description: "Next.js、Nuxt、SvelteKitなどのSSRフレームワークで完璧に動作します。SEOを犠牲にすることなく、美しいページトランジションを作成できます。",
      },
      browserCompat: {
        title: "すべてのブラウザ対応",
        description: "Chrome、Firefox、Safari、すべての最新ブラウザで一貫した体験を提供します。",
      },
      zeroConfig: {
        title: "ゼロ設定",
        description: "フレームワークのルーティングをそのまま使用。複雑な設定なしにすぐに開始できます。",
      },
    },
  },
  // Code Example Section
  codeExample: {
    title: (
      <>
        驚くほど<span className="gradient-orange">シンプルなコード</span>
      </>
    ),
    subtitle: "わずか数行でページトランジションアニメーションを実装",
  },
  // CTA Section
  cta: {
    title: "今すぐ始める",
    subtitle: "必要なのは5分だけ。SSGOIでウェブにネイティブアプリ体験を追加しましょう。",
    buttons: {
      viewDocs: "ドキュメントを見る",
      github: "GitHub",
      demo: "デモを試す",
    },
  },
};