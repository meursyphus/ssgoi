import { ReactNode } from "react";

export type HomeMessages = {
  title: string;
  getStarted: string;
  readMore: string;
  // Hero Section
  badge: {
    text: string;
  };
  heroTitle: {
    line1: string;
    line2: string;
  };
  subtitle: ReactNode;
  description: string;
  buttons: {
    getStarted: string;
    github: string;
    demo: string;
  };
  quickInstall: {
    react: string;
    svelte: string;
    vue: string;
    solidjs: string;
    qwik: string;
    angular: string;
  };
  floatingBadges: {
    performance: string;
    stateMemory: string;
  };
  // Framework Support Section
  frameworks: {
    title: ReactNode;
    subtitle: string;
    comingSoon: string;
  };
  // Why SSGOI Section
  whySSGOI: {
    title: ReactNode;
    subtitle: string;
    features: {
      ssr: {
        title: string;
        description: string;
      };
      browserCompat: {
        title: string;
        description: string;
      };
      zeroConfig: {
        title: string;
        description: string;
      };
    };
  };
  // Code Example Section
  codeExample: {
    title: ReactNode;
    subtitle: string;
  };
  // CTA Section
  cta: {
    title: string;
    subtitle: string;
    buttons: {
      viewDocs: string;
      github: string;
      demo: string;
    };
  };
  // Transition Showcase Section
  transitionShowcase: {
    title: {
      line1: string;
      line2: string;
    };
    subtitle: string;
    transitions: {
      fade: {
        title: string;
        description: string;
      };
      hero: {
        title: string;
        description: string;
      };
      scroll: {
        title: string;
        description: string;
      };
    };
    viewDocs: string;
    viewDocumentation: string;
    exploreAllTransitions: string;
  };
  // Comparison Section
  comparison: {
    title: {
      line1: string;
      line2: string;
    };
    subtitle: string;
    table: {
      feature: string;
      browserAPI: string;
      browserAPISubtitle: string;
      otherLibs: string;
      otherLibsSubtitle: string;
      ssgoi: string;
      ssgoiSubtitle: string;
    };
    features: {
      browserSupport: {
        name: string;
        browserAPI: string;
        otherLibs: string;
        ssgoi: string;
      };
      frameworkSupport: {
        name: string;
        browserAPI: string;
        otherLibs: string;
        ssgoi: string;
      };
      ssrSupport: {
        name: string;
        browserAPI: string;
        otherLibs: string;
        ssgoi: string;
      };
      routingSystem: {
        name: string;
        browserAPI: string;
        otherLibs: string;
        ssgoi: string;
      };
      physicsAnimations: {
        name: string;
        browserAPI: string;
        otherLibs: string;
        ssgoi: string;
      };
      customization: {
        name: string;
        browserAPI: string;
        otherLibs: string;
        ssgoi: string;
      };
    };
    mobileTitle: string;
    mobileDescription: string;
    advantages: {
      keepStack: {
        title: string;
        description: string;
      };
      trueCustomization: {
        title: string;
        description: string;
      };
      universalSupport: {
        title: string;
        description: string;
      };
    };
  };
  // Stats Section
  stats: {
    title: {
      line1: string;
      line2: string;
    };
    subtitle: string;
    items: {
      downloads: string;
      githubStars: string;
      contributors: string;
      performance: string;
    };
  };
  // Experience Difference Section
  experienceDifference: {
    title: {
      line1: string;
      line2: string;
    };
    subtitle: string;
    traditional: {
      title: string;
      uxPoints: {
        lossOfContext: {
          title: string;
          description: string;
        };
        highCognitiveLoad: {
          title: string;
          description: string;
        };
        jarringExperience: {
          title: string;
          description: string;
        };
      };
    };
    withSsgoi: {
      title: string;
      uxPoints: {
        maintainsContext: {
          title: string;
          description: string;
        };
        lowCognitiveLoad: {
          title: string;
          description: string;
        };
        delightfulExperience: {
          title: string;
          description: string;
        };
      };
    };
    demo: {
      latestPosts: string;
      readTime: string;
      likes: string;
      back: string;
      blogPosts: {
        modernWeb: {
          title: string;
          excerpt: string;
        };
        aiDevelopment: {
          title: string;
          excerpt: string;
        };
        typescriptPatterns: {
          title: string;
          excerpt: string;
        };
      };
    };
  };
  // Features Timeline Section
  featuresTimeline: {
    title: {
      line1: string;
      line2: string;
    };
    subtitle: string;
    features: {
      oneLineSetup: {
        title: string;
        description: string;
      };
      frameworkAgnostic: {
        title: string;
        description: string;
      };
      sharedElements: {
        title: string;
        description: string;
      };
      ssrReady: {
        title: string;
        description: string;
      };
      springPhysics: {
        title: string;
        description: string;
      };
      typescriptFirst: {
        title: string;
        description: string;
      };
    };
  };
  // Why Transitions Matter Section
  whyTransitionsMatter: {
    title: {
      line1: string;
      line2: string;
    };
    subtitle: string;
    reasons: {
      nativeLike: {
        title: string;
        description: string;
      };
      brandIdentity: {
        title: string;
        description: string;
      };
      visualContext: {
        title: string;
        description: string;
      };
    };
    reasonBadge: string; // "Reason #1", "Reason #2", etc.
    previous: string;
    next: string;
    youAreHere: string;
    statCards: {
      userEngagement: {
        title: string;
        percentage: string;
        description: string;
      };
      bounceRate: {
        title: string;
        percentage: string;
        description: string;
      };
      perceivedPerformance: {
        title: string;
        percentage: string;
        description: string;
      };
      userSatisfaction: {
        title: string;
        percentage: string;
        description: string;
      };
    };
    quotes: {
      quote1: ReactNode;
      quote2: ReactNode;
      author1: string;
      author2: string;
    };
    bottomNote: string;
  };
};
