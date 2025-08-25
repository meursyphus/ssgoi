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
      为网页构建<span className="font-semibold text-white">原生应用般的页面过渡效果</span>。
    </>
  ),
  description: "与Next.js、Nuxt、SvelteKit等所有SSR框架完美兼容。创建令人惊叹的动画效果，同时不影响SEO。",
  buttons: {
    getStarted: "开始使用",
    github: "GitHub",
    demo: "试用演示",
  },
  quickInstall: {
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
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
      demo: "试用演示",
    },
  },
};