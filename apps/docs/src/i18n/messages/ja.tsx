import { Messages } from "./types";

const ja: Messages = {
  header: {
    home: "ホーム",
    blog: "ブログ",
    github: "Github",
    docs: "ドキュメント",
    tutorial: "チュートリアル",
    contributing: "貢献",
    showcase: "ショーケース",
    openMenu: "メニューを開く",
    githubRepository: "GitHubリポジトリ",
  },
  mobileMenu: {
    documentToc: "目次",
    menu: "メニュー",
    closeDrawer: "閉じる",
    noDocumentPage: "ドキュメントページに移動してください。",
    navigation: "ナビゲーション",
    documents: "ドキュメント",
    blog: "ブログ",
    language: "言語 / Language",
  },
  home: {
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
    },
    quickInstall: {
      react: "React",
      svelte: "Svelte",
      vue: "Vue (近日公開)",
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
      },
    },
  },
  metadata: {
    title: "SSGOI - モダンウェブアプリのための美しいページトランジション",
    description:
      "SSGOIは、ウェブにネイティブアプリのようなアニメーションをもたらす強力なページトランジションライブラリです。すべてのフレームワークで状態保持を備えたスムーズなスプリングベースのトランジションを作成します。",
    keywords: [
      "ページトランジション",
      "アニメーションライブラリ",
      "reactトランジション",
      "vueトランジション",
      "svelteトランジション",
      "スプリングアニメーション",
      "ビュートランジション",
      "ウェブアニメーション",
      "ssgoi",
    ],
    og: {
      title: "SSGOI - モダンウェブアプリのための美しいページトランジション",
      description:
        "SSGOIで素晴らしいページトランジションを作成。ネイティブアプリのようなアニメーション、状態保持、フレームワーク非依存設計。React、Vue、Svelteなどで動作します。",
      siteName: "SSGOI",
      imageAlt: "SSGOI - ページトランジションライブラリ",
    },
    twitter: {
      title: "SSGOI - モダンウェブアプリのための美しいページトランジション",
      description:
        "SSGOIで素晴らしいページトランジションを作成。ネイティブアプリのようなアニメーション、状態保持、フレームワーク非依存設計。",
      imageAlt: "SSGOI - ページトランジションライブラリ",
    },
  },
  sidebar: {
    categories: {
      "getting-started": "はじめに",
      "core-concepts": "コアコンセプト",
      "view-transitions": "ビュートランジション",
      "transitions": "トランジション",
    },
  },
  console: {
    welcome: "SSGOIへようこそ！",
    subtitle: "モダンウェブアプリのための美しいページトランジション",
    supports: "React、Svelteなど多様なフレームワークをサポート！",
    visit: "訪問: https://github.com/meursyphus/ssgoi",
  },
  blog: {
    title: "SSGOIブログ",
    description: "SSGOIの最新ニュース、開発ストーリー、チュートリアルをご覧ください。",
    pageTitle: "SSGOIブログ",
    pageDescription: "最新ニュースと開発ストーリー",
    noPostsYet: "まだ投稿がありません。",
    backToBlog: "← ブログに戻る",
    metadata: {
      title: "SSGOIブログ - ウェブページトランジションの新しい体験",
      description: "SSGOIの最新ニュース、開発ストーリー、チュートリアルをご覧ください。",
    },
  },
};

export default ja;