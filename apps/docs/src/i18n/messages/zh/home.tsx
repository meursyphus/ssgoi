import { HomeMessages } from "../types/home";

export const home: HomeMessages = {
  title: "为现代网页应用打造\n优美的页面过渡效果",
  getStarted: "开始使用",
  readMore: "阅读文档",
  // Hero Section
  badge: {
    text: "SSR就绪",
  },
  heroTitle: {
    line1: "视图",
    line2: "过渡",
  },
  subtitle: (
    <>
      为网页构建
      <span className="font-semibold text-white">原生应用般的页面过渡效果</span>
      。
    </>
  ),
  description:
    "与Next.js、Nuxt、SvelteKit等所有SSR框架完美兼容。创建令人惊叹的动画效果，同时不影响SEO。",
  buttons: {
    getStarted: "开始使用",
    github: "GitHub",
    demo: "试用演示",
  },
  quickInstall: {
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
    angular: "Angular",
    solidjs: "SolidJS (即将推出)",
    qwik: "Qwik (即将推出)",
  },
  floatingBadges: {
    performance: "始终60fps",
    stateMemory: "状态记忆",
  },
  // Framework Support Section
  frameworks: {
    title: (
      <>
        在<span className="gradient-orange">所有环境</span>中提供相同体验
      </>
    ),
    subtitle: "无论使用哪种框架都能使用一致的API",
    comingSoon: "(即将推出)",
  },
  // Why SSGOI Section
  whySSGOI: {
    title: (
      <>
        为什么选择<span className="gradient-orange">SSGOI</span>？
      </>
    ),
    subtitle: "只需记住这3点",
    features: {
      ssr: {
        title: "完美的SSR支持",
        description:
          "与Next.js、Nuxt、SvelteKit等SSR框架完美配合。创建优美的页面过渡效果而不牺牲SEO。",
      },
      browserCompat: {
        title: "全浏览器兼容",
        description:
          "在Chrome、Firefox、Safari和所有现代浏览器中提供一致的体验。",
      },
      zeroConfig: {
        title: "零配置",
        description: "直接使用您框架的路由。无需复杂设置即可立即开始。",
      },
    },
  },
  // Code Example Section
  codeExample: {
    title: (
      <>
        惊人的<span className="gradient-orange">简洁代码</span>
      </>
    ),
    subtitle: "只需几行代码即可实现页面过渡动画",
  },
  // CTA Section
  cta: {
    title: "立即开始",
    subtitle: "只需5分钟。使用SSGOI为网页添加原生应用体验。",
    buttons: {
      viewDocs: "查看文档",
      github: "GitHub",
      demo: "试用演示",
    },
  },
  // Transition Showcase Section
  transitionShowcase: {
    title: {
      line1: "体验",
      line2: "每一种过渡",
    },
    subtitle: "预览我们最受欢迎的过渡效果。查看它们在实际应用中的表现。",
    transitions: {
      fade: {
        title: "淡入淡出",
        description: "通过平滑的不透明度过渡创建优雅的页面切换",
      },
      hero: {
        title: "英雄过渡",
        description: "共享元素在页面之间自然变形",
      },
      scroll: {
        title: "滚动",
        description: "垂直滚动效果创建内容之间的流动",
      },
    },
    viewDocs: "查看文档",
    viewDocumentation: "查看文档",
    exploreAllTransitions: "探索所有过渡效果",
  },
  // Comparison Section
  comparison: {
    title: {
      line1: "更好的选择",
      line2: "SSGOI",
    },
    subtitle: "与浏览器API和其他库进行比较",
    table: {
      feature: "功能",
      browserAPI: "浏览器API",
      browserAPISubtitle: "View Transitions API",
      otherLibs: "其他库",
      otherLibsSubtitle: "Framer Motion等",
      ssgoi: "SSGOI",
      ssgoiSubtitle: "我们的解决方案",
    },
    features: {
      browserSupport: {
        name: "浏览器支持",
        browserAPI: "仅Chrome",
        otherLibs: "有限",
        ssgoi: "所有浏览器",
      },
      frameworkSupport: {
        name: "框架支持",
        browserAPI: "有限",
        otherLibs: "特定框架",
        ssgoi: "所有框架",
      },
      ssrSupport: {
        name: "SSR支持",
        browserAPI: "部分",
        otherLibs: "有问题",
        ssgoi: "完全支持",
      },
      routingSystem: {
        name: "路由系统",
        browserAPI: "使用原生路由",
        otherLibs: "需要自定义路由",
        ssgoi: "使用现有路由",
      },
      physicsAnimations: {
        name: "物理动画",
        browserAPI: "无",
        otherLibs: "有限",
        ssgoi: "弹簧物理",
      },
      customization: {
        name: "自定义",
        browserAPI: "有限",
        otherLibs: "一般",
        ssgoi: "完全自定义",
      },
    },
    mobileTitle: "功能比较",
    mobileDescription: "SSGOI优于其他解决方案的原因",
    advantages: {
      keepStack: {
        title: "保持现有技术栈",
        description: "继续使用您当前的路由器和框架。无需额外依赖。",
      },
      trueCustomization: {
        title: "真正的自定义",
        description: "完全控制弹簧物理和时序，创建独特的品牌体验。",
      },
      universalSupport: {
        title: "通用支持",
        description: "在所有浏览器、所有框架、所有环境中都能一致工作。",
      },
    },
  },
  // Stats Section
  stats: {
    title: {
      line1: "开发者",
      line2: "喜爱的库",
    },
    subtitle: "SSGOI增长的数字证明",
    items: {
      downloads: "每周下载",
      githubStars: "GitHub星标",
      contributors: "贡献者",
      performance: "性能评分",
    },
  },
  // Experience Difference Section
  experienceDifference: {
    title: {
      line1: "感受",
      line2: "体验差异",
    },
    subtitle: "亲自体验过渡效果如何改变用户体验",
    traditional: {
      title: "传统网页",
      uxPoints: {
        lossOfContext: {
          title: "上下文丢失",
          description: "页面之间没有连接，用户容易迷失",
        },
        highCognitiveLoad: {
          title: "高认知负荷",
          description: "突然的变化让用户感到困惑",
        },
        jarringExperience: {
          title: "不适的体验",
          description: "屏幕闪烁和断断续续的感觉",
        },
      },
    },
    withSsgoi: {
      title: "使用SSGOI",
      uxPoints: {
        maintainsContext: {
          title: "保持上下文",
          description: "自然的流动让用户知道自己的位置",
        },
        lowCognitiveLoad: {
          title: "低认知负荷",
          description: "平滑的过渡易于理解",
        },
        delightfulExperience: {
          title: "愉悦的体验",
          description: "流畅且响应迅速的交互",
        },
      },
    },
    demo: {
      latestPosts: "最新文章",
      readTime: "阅读时间",
      likes: "点赞",
      back: "返回",
      blogPosts: {
        modernWeb: {
          title: "现代网页开发的未来",
          excerpt: "网页技术如何演进...",
        },
        aiDevelopment: {
          title: "AI开发的未来",
          excerpt: "AI如何革新代码...",
        },
        typescriptPatterns: {
          title: "掌握TypeScript模式",
          excerpt: "深入探讨高级特性...",
        },
      },
    },
  },
  // Features Timeline Section
  featuresTimeline: {
    title: {
      line1: "您需要的一切",
      line2: "尽在一个包中",
    },
    subtitle: "为现代网页开发提供全面的功能",
    features: {
      oneLineSetup: {
        title: "一行设置",
        description: "只需一行代码即可开始。无需复杂配置",
      },
      frameworkAgnostic: {
        title: "框架无关",
        description: "适用于React、Svelte、Vue。Solid和Qwik即将推出",
      },
      sharedElements: {
        title: "共享元素过渡",
        description: "使用共享元素在页面之间创建无缝动画",
      },
      ssrReady: {
        title: "SSR & SSG就绪",
        description:
          "完全支持Next.js、Nuxt、SvelteKit。无hydration问题，SEO友好",
      },
      springPhysics: {
        title: "弹簧物理",
        description: "可配置的弹簧物理实现自然运动",
      },
      typescriptFirst: {
        title: "TypeScript优先",
        description: "完整的TypeScript支持，详细类型和智能自动完成",
      },
    },
  },
  // Why Transitions Matter Section
  whyTransitionsMatter: {
    title: {
      line1: "过渡不仅仅是",
      line2: "漂亮的效果",
    },
    subtitle: "它们对于创建直观、引人入胜的网页体验至关重要",
    reasons: {
      nativeLike: {
        title: "原生般的体验",
        description:
          "通过无缝、响应迅速的过渡，在网页上提供用户期望的应用级交互",
      },
      brandIdentity: {
        title: "品牌识别",
        description: "创建独特的动作特征，让您的品牌令人难忘且与众不同",
      },
      visualContext: {
        title: "视觉上下文",
        description: "在用户导航时保持空间感知，显示页面之间的清晰关系",
      },
    },
    reasonBadge: "原因 #",
    previous: "上一页",
    next: "下一页",
    youAreHere: "您在这里",
    statCards: {
      userEngagement: {
        title: "用户参与度",
        percentage: "+40%",
        description: "流畅的过渡让用户停留更久",
      },
      bounceRate: {
        title: "跳出率",
        percentage: "-25%",
        description: "立即离开的用户减少",
      },
      perceivedPerformance: {
        title: "感知性能",
        percentage: "2倍",
        description: "动画让应用感觉更快",
      },
      userSatisfaction: {
        title: "用户满意度",
        percentage: "+35%",
        description: "有动画的应用评分更高",
      },
    },
    quotes: {
      quote1: (
        <>
          {`"恰当位置的动画可以`}
          <span className="text-white">让体验更直观</span>
          {`，导航更容易。"`}
        </>
      ),
      quote2: (
        <>
          {`"动作帮助用户`}
          <span className="text-white">理解导航</span>
          {`，并提供既有信息又令人愉快的反馈。"`}
        </>
      ),
      author1: "— Google Material Design",
      author2: "— Apple Human Interface Guidelines",
    },
    bottomNote: "基于Nielsen Norman Group和Google Research的研究",
  },
};
