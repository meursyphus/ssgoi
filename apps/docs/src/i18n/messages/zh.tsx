import { Messages } from "./types";

const zh: Messages = {
  header: {
    home: "首页",
    blog: "博客",
    demo: "演示",
    github: "Github",
    docs: "文档",
    tutorial: "教程",
    contributing: "贡献",
    showcase: "展示",
    openMenu: "打开菜单",
    githubRepository: "GitHub仓库",
  },
  mobileMenu: {
    documentToc: "文档目录",
    menu: "菜单",
    closeDrawer: "关闭",
    noDocumentPage: "请导航到文档页面。",
    navigation: "导航",
    documents: "文档",
    blog: "博客",
    demo: "演示",
    language: "语言 / Language",
  },
  home: {
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
        为网页构建<span className="font-semibold text-white">原生应用般的页面过渡效果</span>。
      </>
    ),
    description: "与Next.js、Nuxt、SvelteKit等所有SSR框架完美兼容。创建令人惊叹的动画效果，同时不影响SEO。",
    buttons: {
      getStarted: "开始使用",
      github: "GitHub",
    },
    quickInstall: {
      react: "React",
      svelte: "Svelte",
      vue: "Vue (即将推出)",
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
          description: "与Next.js、Nuxt、SvelteKit等SSR框架完美配合。创建优美的页面过渡效果而不牺牲SEO。",
        },
        browserCompat: {
          title: "全浏览器兼容",
          description: "在Chrome、Firefox、Safari和所有现代浏览器中提供一致的体验。",
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
      },
    },
  },
  metadata: {
    title: "SSGOI - 为现代网页应用打造优美的页面过渡效果",
    description:
      "SSGOI是一个强大的页面过渡库，为网页带来原生应用般的动画效果。创建流畅的基于弹簧的过渡效果，在所有框架中保持状态。",
    keywords: [
      "页面过渡",
      "动画库",
      "react过渡",
      "vue过渡",
      "svelte过渡",
      "弹簧动画",
      "视图过渡",
      "网页动画",
      "ssgoi",
    ],
    og: {
      title: "SSGOI - 为现代网页应用打造优美的页面过渡效果",
      description:
        "使用SSGOI创建令人惊叹的页面过渡效果。原生应用般的动画、状态保持和框架无关设计。支持React、Vue、Svelte等。",
      siteName: "SSGOI",
      imageAlt: "SSGOI - 页面过渡库",
    },
    twitter: {
      title: "SSGOI - 为现代网页应用打造优美的页面过渡效果",
      description:
        "使用SSGOI创建令人惊叹的页面过渡效果。原生应用般的动画、状态保持和框架无关设计。",
      imageAlt: "SSGOI - 页面过渡库",
    },
  },
  sidebar: {
    categories: {
      "getting-started": "入门指南",
      "core-concepts": "核心概念",
      "view-transitions": "视图过渡",
      "transitions": "过渡效果",
    },
  },
  console: {
    welcome: "欢迎使用SSGOI！",
    subtitle: "为现代网页应用打造优美的页面过渡效果",
    supports: "支持React、Svelte等多种框架！",
    visit: "访问: https://github.com/meursyphus/ssgoi",
  },
  blog: {
    title: "SSGOI博客",
    description: "查看SSGOI的最新消息、开发故事和教程。",
    pageTitle: "SSGOI博客",
    pageDescription: "最新消息和开发故事",
    noPostsYet: "暂无文章。",
    backToBlog: "← 返回博客",
    metadata: {
      title: "SSGOI博客 - 网页过渡的全新体验",
      description: "查看SSGOI的最新消息、开发故事和教程。",
    },
  },
};

export default zh;