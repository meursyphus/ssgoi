import { ReactNode } from "react";

export type Messages = {
  header: {
    home: string;
    blog: string;
    github: string;
    docs: string;
    tutorial: string;
    contributing: string;
    showcase: string;
  };
  home: {
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
    };
    quickInstall: {
      react: string;
      svelte: string;
      vue: string;
      solidjs: string;
      qwik: string;
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
      };
    };
  };
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    og: {
      title: string;
      description: string;
      siteName: string;
      imageAlt: string;
    };
    twitter: {
      title: string;
      description: string;
      imageAlt: string;
    };
  };
  sidebar: {
    categories: {
      "getting-started": string;
      "core-concepts": string;
      "view-transitions": string;
      "transitions": string;
    };
  };
};
