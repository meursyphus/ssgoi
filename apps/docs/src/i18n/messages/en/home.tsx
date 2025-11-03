import { HomeMessages } from "../types/home";

export const home: HomeMessages = {
  title: "Beautiful page transitions\nfor modern web apps",
  getStarted: "Get Started",
  readMore: "Read the Docs",
  // Hero Section
  badge: {
    text: "SSR Ready",
  },
  heroTitle: {
    line1: "View",
    line2: "Transitions",
  },
  subtitle: (
    <>
      Build{" "}
      <span className="font-semibold text-white">
        native app-like page transitions
      </span>{" "}
      for the web.
    </>
  ),
  description:
    "Perfect compatibility with all SSR frameworks like Next.js, Nuxt, and SvelteKit. Create stunning animations without sacrificing SEO.",
  buttons: {
    getStarted: "Get Started",
    github: "GitHub",
    demo: "Try Demo",
  },
  quickInstall: {
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
    angular: "Angular",
    solidjs: "SolidJS (Coming Soon)",
    qwik: "Qwik (Coming Soon)",
  },
  floatingBadges: {
    performance: "60fps Always",
    stateMemory: "State Memory",
  },
  // Framework Support Section
  frameworks: {
    title: (
      <>
        Same experience across{" "}
        <span className="gradient-orange">all environments</span>
      </>
    ),
    subtitle: "Use consistent APIs regardless of framework",
    comingSoon: "(Coming Soon)",
  },
  // Why SSGOI Section
  whySSGOI: {
    title: (
      <>
        Why <span className="gradient-orange">SSGOI</span>?
      </>
    ),
    subtitle: "Just remember these 3 things",
    features: {
      ssr: {
        title: "Perfect SSR Support",
        description:
          "Works perfectly with SSR frameworks like Next.js, Nuxt, and SvelteKit. Create beautiful page transitions without sacrificing SEO.",
      },
      browserCompat: {
        title: "All Browsers Compatible",
        description:
          "Provides consistent experience across Chrome, Firefox, Safari and all modern browsers.",
      },
      zeroConfig: {
        title: "Zero Configuration",
        description:
          "Use your framework's routing as-is. Start immediately without complex setup.",
      },
    },
  },
  // Code Example Section
  codeExample: {
    title: (
      <>
        Amazingly <span className="gradient-orange">simple code</span>
      </>
    ),
    subtitle: "Implement page transition animations with just a few lines",
  },
  // CTA Section
  cta: {
    title: "Start Now",
    subtitle:
      "5 minutes is all you need. Add native app experience to the web with SSGOI.",
    buttons: {
      viewDocs: "View Documentation",
      github: "GitHub",
      demo: "Try Demo",
    },
  },
  // Transition Showcase Section
  transitionShowcase: {
    title: {
      line1: "Experience",
      line2: "Every Transition",
    },
    subtitle:
      "Preview our most popular transitions. Each one is optimized for performance and works across all browsers.",
    transitions: {
      fade: {
        title: "Fade Transition",
        description:
          "Smooth opacity transition perfect for context changes and top-level navigation",
      },
      hero: {
        title: "Hero Transition",
        description:
          "Shared element animation that creates seamless transitions for detail views",
      },
      scroll: {
        title: "Scroll Transition",
        description:
          "Vertical scrolling effect ideal for sequential content and storytelling",
      },
    },
    viewDocs: "View docs",
    viewDocumentation: "View documentation",
    exploreAllTransitions: "Explore All Transitions",
  },
  // Comparison Section
  comparison: {
    title: {
      line1: "Why Choose",
      line2: "SSGOI?",
    },
    subtitle: "The only transition library that works with your existing code",
    table: {
      feature: "Feature",
      browserAPI: "Browser API",
      browserAPISubtitle: "View Transitions",
      otherLibs: "Other Libraries",
      otherLibsSubtitle: "Framer, Auto-Animate, etc",
      ssgoi: "SSGOI",
      ssgoiSubtitle: "Universal solution",
    },
    features: {
      browserSupport: {
        name: "Browser Support",
        browserAPI: "Chrome only",
        otherLibs: "Varies",
        ssgoi: "All modern browsers",
      },
      frameworkSupport: {
        name: "Framework Support",
        browserAPI: "Any",
        otherLibs: "Framework specific",
        ssgoi: "React, Svelte, Vue, Solid",
      },
      ssrSupport: {
        name: "SSR/SSG Support",
        browserAPI: "Basic support",
        otherLibs: "Often broken",
        ssgoi: "Full support",
      },
      routingSystem: {
        name: "Routing System",
        browserAPI: "Any router",
        otherLibs: "Custom router required",
        ssgoi: "Keep your router",
      },
      physicsAnimations: {
        name: "Physics Animations",
        browserAPI: "CSS only",
        otherLibs: "Limited",
        ssgoi: "Spring physics",
      },
      customization: {
        name: "Customization",
        browserAPI: "CSS only",
        otherLibs: "Preset only",
        ssgoi: "Fully customizable",
      },
    },
    mobileTitle: "Feature Comparison",
    mobileDescription: "Swipe to see how SSGOI stands out",
    advantages: {
      keepStack: {
        title: "🚀 Keep Your Stack",
        description:
          "No need to change your router or framework. Works with Next.js, SvelteKit, Nuxt, and more.",
      },
      trueCustomization: {
        title: "🎨 True Customization",
        description:
          "Spring-based physics animations with full control over timing, easing, and behavior.",
      },
      universalSupport: {
        title: "🌍 Universal Support",
        description:
          "Works in all browsers, all frameworks, with SSR/SSG. One library for everything.",
      },
    },
  },
  // Stats Section
  stats: {
    title: {
      line1: "Trusted by Developers",
      line2: "Worldwide",
    },
    subtitle: "Join thousands of developers building better web experiences",
    items: {
      downloads: "Downloads",
      githubStars: "GitHub Stars",
      contributors: "Contributors",
      performance: "Performance",
    },
  },
  // Experience Difference Section
  experienceDifference: {
    title: {
      line1: "Experience",
      line2: "the Difference",
    },
    subtitle: "See how page transitions affect user experience",
    traditional: {
      title: "Traditional Web",
      uxPoints: {
        lossOfContext: {
          title: "Loss of Context",
          description: "White flash breaks user focus and orientation",
        },
        highCognitiveLoad: {
          title: "High Cognitive Load",
          description: "Brain must reprocess entire page layout",
        },
        jarringExperience: {
          title: "Jarring Experience",
          description: "Feels disconnected and unresponsive",
        },
      },
    },
    withSsgoi: {
      title: "With SSGOI",
      uxPoints: {
        maintainsContext: {
          title: "Maintains Context",
          description: "Smooth flow keeps user focus intact",
        },
        lowCognitiveLoad: {
          title: "Low Cognitive Load",
          description: "Natural, predictable motion patterns",
        },
        delightfulExperience: {
          title: "Delightful Experience",
          description: "Feels like a premium native app",
        },
      },
    },
    demo: {
      latestPosts: "Latest Posts",
      readTime: "min",
      likes: "likes",
      back: "← Back",
      blogPosts: {
        modernWeb: {
          title: "Building Modern Web Applications",
          excerpt: "Explore the latest features...",
        },
        aiDevelopment: {
          title: "The Future of AI Development",
          excerpt: "How AI is revolutionizing code...",
        },
        typescriptPatterns: {
          title: "Mastering TypeScript Patterns",
          excerpt: "Deep dive into advanced features...",
        },
      },
    },
  },
  // Features Timeline Section
  featuresTimeline: {
    title: {
      line1: "Everything You Need",
      line2: "in One Package",
    },
    subtitle: "Comprehensive features for modern web development",
    features: {
      oneLineSetup: {
        title: "One Line Setup",
        description:
          "Get started with a single line of code. No complex configuration needed",
      },
      frameworkAgnostic: {
        title: "Framework Agnostic",
        description:
          "Works with React, Svelte, Vue. Solid and Qwik coming soon",
      },
      sharedElements: {
        title: "Shared Element Transitions",
        description:
          "Create seamless animations between pages with shared elements",
      },
      ssrReady: {
        title: "SSR & SSG Ready",
        description:
          "Full support for Next.js, Nuxt, SvelteKit. No hydration issues, SEO friendly",
      },
      springPhysics: {
        title: "Spring Physics",
        description:
          "Natural motion with configurable spring physics for smooth animations",
      },
      typescriptFirst: {
        title: "TypeScript First",
        description:
          "Full TypeScript support with detailed types and intelligent autocomplete",
      },
    },
  },
  // Why Transitions Matter Section
  whyTransitionsMatter: {
    title: {
      line1: "Transitions are not just",
      line2: "Pretty Effects",
    },
    subtitle:
      "They're essential for creating intuitive, engaging web experiences",
    reasons: {
      nativeLike: {
        title: "Native-like Experience",
        description:
          "Deliver app-quality interactions on the web with seamless, responsive transitions that users expect",
      },
      brandIdentity: {
        title: "Brand Identity",
        description:
          "Create unique motion signatures that make your brand memorable and distinct",
      },
      visualContext: {
        title: "Visual Context",
        description:
          "Maintain spatial awareness as users navigate, showing clear relationships between pages",
      },
    },
    reasonBadge: "Reason #",
    previous: "Previous",
    next: "Next",
    youAreHere: "You are here",
    statCards: {
      userEngagement: {
        title: "User Engagement",
        percentage: "+40%",
        description: "Users stay longer with smooth transitions",
      },
      bounceRate: {
        title: "Bounce Rate",
        percentage: "-25%",
        description: "Fewer users leave immediately",
      },
      perceivedPerformance: {
        title: "Perceived Performance",
        percentage: "2x",
        description: "Apps feel faster with animations",
      },
      userSatisfaction: {
        title: "User Satisfaction",
        percentage: "+35%",
        description: "Higher ratings for animated apps",
      },
    },
    quotes: {
      quote1: (
        <>
          {`"Animations in the right places can `}
          <span className="text-white">
            make experiences more intuitive
          </span>{" "}
          {`and easier to navigate."`}
        </>
      ),
      quote2: (
        <>
          {`"Motion helps users `}
          <span className="text-white">understand navigation</span> and provides
          {`feedback that's both informative and delightful."`}
        </>
      ),
      author1: "— Google Material Design",
      author2: "— Apple Human Interface Guidelines",
    },
    bottomNote:
      "Based on studies from Nielsen Norman Group and Google Research",
  },
};
