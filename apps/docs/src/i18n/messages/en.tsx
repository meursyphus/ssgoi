import { Messages } from "./types";

const en: Messages = {
  header: {
    home: "Home",
    blog: "Blog",
    github: "Github",
    docs: "Docs",
    tutorial: "Tutorial",
    contributing: "Contributing",
    showcase: "Showcase",
    openMenu: "Open menu",
    githubRepository: "GitHub Repository",
  },
  home: {
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
        Build <span className="font-semibold text-white">native app-like page transitions</span> for the web.
      </>
    ),
    description: "Perfect compatibility with all SSR frameworks like Next.js, Nuxt, and SvelteKit. Create stunning animations without sacrificing SEO.",
    buttons: {
      getStarted: "Get Started",
      github: "GitHub",
    },
    quickInstall: {
      react: "React",
      svelte: "Svelte",
      vue: "Vue (Coming Soon)",
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
          Same experience across <span className="gradient-orange">all environments</span>
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
          description: "Works perfectly with SSR frameworks like Next.js, Nuxt, and SvelteKit. Create beautiful page transitions without sacrificing SEO.",
        },
        browserCompat: {
          title: "All Browsers Compatible",
          description: "Provides consistent experience across Chrome, Firefox, Safari and all modern browsers.",
        },
        zeroConfig: {
          title: "Zero Configuration",
          description: "Use your framework's routing as-is. Start immediately without complex setup.",
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
      subtitle: "5 minutes is all you need. Add native app experience to the web with SSGOI.",
      buttons: {
        viewDocs: "View Documentation",
        github: "GitHub",
      },
    },
  },
  metadata: {
    title: "SSGOI - Beautiful Page Transitions for Modern Web Apps",
    description:
      "SSGOI is a powerful page transition library that brings native app-like animations to the web. Create smooth, spring-based transitions with state preservation across all frameworks.",
    keywords: [
      "page transitions",
      "animation library",
      "react transitions",
      "vue transitions",
      "svelte transitions",
      "spring animations",
      "view transitions",
      "web animations",
      "ssgoi",
    ],
    og: {
      title: "SSGOI - Beautiful Page Transitions for Modern Web Apps",
      description:
        "Create stunning page transitions with SSGOI. Native app-like animations, state preservation, and framework-agnostic design. Works with React, Vue, Svelte, and more.",
      siteName: "SSGOI",
      imageAlt: "SSGOI - Page Transition Library",
    },
    twitter: {
      title: "SSGOI - Beautiful Page Transitions for Modern Web Apps",
      description:
        "Create stunning page transitions with SSGOI. Native app-like animations, state preservation, and framework-agnostic design.",
      imageAlt: "SSGOI - Page Transition Library",
    },
  },
  sidebar: {
    categories: {
      "getting-started": "Getting Started",
      "core-concepts": "Core Concepts",
      "view-transitions": "View Transitions",
      "transitions": "Transitions",
    },
  },
};

export default en;
