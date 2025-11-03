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
      ウェブに
      <span className="font-semibold text-white">
        ネイティブアプリのようなページトランジション
      </span>
      を構築。
    </>
  ),
  description:
    "Next.js、Nuxt、SvelteKitなどのすべてのSSRフレームワークと完全に互換性があります。SEOを犠牲にすることなく、素晴らしいアニメーションを作成できます。",
  buttons: {
    getStarted: "はじめる",
    github: "GitHub",
    demo: "デモを試す",
  },
  quickInstall: {
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
    angular: "Angular",
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
        description:
          "Next.js、Nuxt、SvelteKitなどのSSRフレームワークで完璧に動作します。SEOを犠牲にすることなく、美しいページトランジションを作成できます。",
      },
      browserCompat: {
        title: "すべてのブラウザ対応",
        description:
          "Chrome、Firefox、Safari、すべての最新ブラウザで一貫した体験を提供します。",
      },
      zeroConfig: {
        title: "ゼロ設定",
        description:
          "フレームワークのルーティングをそのまま使用。複雑な設定なしにすぐに開始できます。",
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
    subtitle:
      "必要なのは5分だけ。SSGOIでウェブにネイティブアプリ体験を追加しましょう。",
    buttons: {
      viewDocs: "ドキュメントを見る",
      github: "GitHub",
      demo: "デモを試す",
    },
  },
  // Transition Showcase Section
  transitionShowcase: {
    title: {
      line1: "すべてのトランジションを",
      line2: "体験する",
    },
    subtitle:
      "最も人気のあるトランジション効果をプレビューします。実際のアプリでどのように動作するか確認してください。",
    transitions: {
      fade: {
        title: "フェード",
        description:
          "スムーズな不透明度トランジションでエレガントなページ切り替えを作成",
      },
      hero: {
        title: "ヒーロー",
        description: "共有要素がページ間で自然に変形します",
      },
      scroll: {
        title: "スクロール",
        description: "垂直スクロール効果でコンテンツ間の流れを作成",
      },
    },
    viewDocs: "ドキュメントを見る",
    viewDocumentation: "ドキュメントを見る",
    exploreAllTransitions: "すべてのトランジション効果を探索",
  },
  // Comparison Section
  comparison: {
    title: {
      line1: "より良い選択",
      line2: "SSGOI",
    },
    subtitle: "ブラウザAPIや他のライブラリと比較してください",
    table: {
      feature: "機能",
      browserAPI: "ブラウザAPI",
      browserAPISubtitle: "View Transitions API",
      otherLibs: "他のライブラリ",
      otherLibsSubtitle: "Framer Motionなど",
      ssgoi: "SSGOI",
      ssgoiSubtitle: "私たちのソリューション",
    },
    features: {
      browserSupport: {
        name: "ブラウザサポート",
        browserAPI: "Chromeのみ",
        otherLibs: "限定的",
        ssgoi: "すべてのブラウザ",
      },
      frameworkSupport: {
        name: "フレームワークサポート",
        browserAPI: "限定的",
        otherLibs: "特定のフレームワーク",
        ssgoi: "すべてのフレームワーク",
      },
      ssrSupport: {
        name: "SSRサポート",
        browserAPI: "部分的",
        otherLibs: "問題あり",
        ssgoi: "完全サポート",
      },
      routingSystem: {
        name: "ルーティングシステム",
        browserAPI: "ネイティブルーティング使用",
        otherLibs: "カスタムルーター必要",
        ssgoi: "既存のルーター使用",
      },
      physicsAnimations: {
        name: "物理アニメーション",
        browserAPI: "なし",
        otherLibs: "限定的",
        ssgoi: "スプリング物理",
      },
      customization: {
        name: "カスタマイズ",
        browserAPI: "限定的",
        otherLibs: "普通",
        ssgoi: "完全カスタマイズ",
      },
    },
    mobileTitle: "機能比較",
    mobileDescription: "SSGOIが他のソリューションより優れている理由",
    advantages: {
      keepStack: {
        title: "既存のスタックを維持",
        description:
          "現在のルーターとフレームワークをそのまま使用。追加の依存関係は不要です。",
      },
      trueCustomization: {
        title: "真のカスタマイズ",
        description:
          "スプリング物理とタイミングを完全に制御し、ユニークなブランド体験を作成。",
      },
      universalSupport: {
        title: "ユニバーサルサポート",
        description:
          "すべてのブラウザ、すべてのフレームワーク、すべての環境で同じように動作します。",
      },
    },
  },
  // Stats Section
  stats: {
    title: {
      line1: "開発者に",
      line2: "愛されるライブラリ",
    },
    subtitle: "数字で見るSSGOIの成長",
    items: {
      downloads: "週間ダウンロード",
      githubStars: "GitHubスター",
      contributors: "貢献者",
      performance: "パフォーマンススコア",
    },
  },
  // Experience Difference Section
  experienceDifference: {
    title: {
      line1: "体験の違いを",
      line2: "感じてください",
    },
    subtitle:
      "トランジション効果がユーザー体験をどのように変えるか直接確認してください",
    traditional: {
      title: "従来のウェブ",
      uxPoints: {
        lossOfContext: {
          title: "コンテキストの喪失",
          description: "ページ間に接続がなく、ユーザーが迷いやすい",
        },
        highCognitiveLoad: {
          title: "高い認知負荷",
          description: "突然の変化でユーザーが混乱します",
        },
        jarringExperience: {
          title: "不快な体験",
          description: "画面がちらつき、途切れる感じがします",
        },
      },
    },
    withSsgoi: {
      title: "SSGOIと共に",
      uxPoints: {
        maintainsContext: {
          title: "コンテキストを維持",
          description: "自然な流れでユーザーが自分の位置を把握できます",
        },
        lowCognitiveLoad: {
          title: "低い認知負荷",
          description: "スムーズなトランジションで理解しやすい",
        },
        delightfulExperience: {
          title: "楽しい体験",
          description: "滑らかでレスポンシブなインタラクション",
        },
      },
    },
    demo: {
      latestPosts: "最新の投稿",
      readTime: "読了時間",
      likes: "いいね",
      back: "戻る",
      blogPosts: {
        modernWeb: {
          title: "モダンウェブ開発の未来",
          excerpt: "ウェブ技術がどのように進化しているか...",
        },
        aiDevelopment: {
          title: "AI開発の未来",
          excerpt: "AIがコードをどのように革新しているか...",
        },
        typescriptPatterns: {
          title: "TypeScriptパターンをマスターする",
          excerpt: "高度な機能を深く掘り下げます...",
        },
      },
    },
  },
  // Features Timeline Section
  featuresTimeline: {
    title: {
      line1: "必要なすべてを",
      line2: "1つのパッケージに",
    },
    subtitle: "モダンウェブ開発のための包括的な機能",
    features: {
      oneLineSetup: {
        title: "ワンラインセットアップ",
        description: "たった1行のコードで開始。複雑な設定は不要",
      },
      frameworkAgnostic: {
        title: "フレームワーク非依存",
        description: "React、Svelte、Vueで動作。SolidとQwikは近日公開",
      },
      sharedElements: {
        title: "共有要素トランジション",
        description:
          "ページ間で共有要素を使用してシームレスなアニメーションを作成",
      },
      ssrReady: {
        title: "SSR & SSG対応",
        description:
          "Next.js、Nuxt、SvelteKitを完全サポート。ハイドレーション問題なし、SEOフレンドリー",
      },
      springPhysics: {
        title: "スプリング物理",
        description: "設定可能なスプリング物理で自然なモーションを実現",
      },
      typescriptFirst: {
        title: "TypeScriptファースト",
        description:
          "詳細な型とインテリジェントな自動補完で完全なTypeScriptサポート",
      },
    },
  },
  // Why Transitions Matter Section
  whyTransitionsMatter: {
    title: {
      line1: "トランジションは単なる",
      line2: "きれいな効果ではありません",
    },
    subtitle: "直感的で魅力的なウェブ体験を作成するために不可欠です",
    reasons: {
      nativeLike: {
        title: "ネイティブのような体験",
        description:
          "シームレスで応答性の高いトランジションで、ユーザーが期待するアプリレベルのインタラクションをウェブで提供",
      },
      brandIdentity: {
        title: "ブランドアイデンティティ",
        description:
          "ブランドを記憶に残り、独特にする独自のモーションシグネチャーを作成",
      },
      visualContext: {
        title: "視覚的コンテキスト",
        description:
          "ユーザーがナビゲートする際に空間認識を維持し、ページ間の明確な関係を表示",
      },
    },
    reasonBadge: "理由 #",
    previous: "前へ",
    next: "次へ",
    youAreHere: "現在地",
    statCards: {
      userEngagement: {
        title: "ユーザーエンゲージメント",
        percentage: "+40%",
        description: "スムーズなトランジションでユーザーが長く滞在",
      },
      bounceRate: {
        title: "直帰率",
        percentage: "-25%",
        description: "すぐに離れるユーザーが減少",
      },
      perceivedPerformance: {
        title: "体感パフォーマンス",
        percentage: "2倍",
        description: "アニメーションでアプリがより速く感じられる",
      },
      userSatisfaction: {
        title: "ユーザー満足度",
        percentage: "+35%",
        description: "アニメーション付きアプリの評価が高い",
      },
    },
    quotes: {
      quote1: (
        <>
          {`"適切な場所のアニメーションは`}
          <span className="text-white">体験をより直感的にし</span>
          {`、ナビゲーションを容易にします。"`}
        </>
      ),
      quote2: (
        <>
          {`"モーションはユーザーが`}
          <span className="text-white">ナビゲーションを理解</span>
          {`するのを助け、有益で楽しいフィードバックを提供します。"`}
        </>
      ),
      author1: "— Google Material Design",
      author2: "— Apple Human Interface Guidelines",
    },
    bottomNote: "Nielsen Norman GroupとGoogle Researchの研究に基づく",
  },
};
