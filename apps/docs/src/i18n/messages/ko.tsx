import { Messages } from "./types";

const ko: Messages = {
  header: {
    home: "홈",
    blog: "블로그",
    github: "깃허브",
    docs: "문서",
    tutorial: "튜토리얼",
    contributing: "기여하기",
    showcase: "쇼케이스",
    openMenu: "메뉴 열기",
    githubRepository: "GitHub 저장소",
  },
  mobileMenu: {
    documentToc: "문서 목차",
    menu: "메뉴",
    closeDrawer: "닫기",
    noDocumentPage: "문서 페이지로 이동해주세요.",
    navigation: "네비게이션",
    documents: "문서",
    language: "언어 / Language",
  },
  home: {
    title: "아름다운 페이지 전환\n모던 웹을 위한",
    getStarted: "시작하기",
    readMore: "문서보기",
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
        <span className="font-semibold text-white">네이티브 앱 같은 페이지 전환</span>을 웹에서 구현하세요.
      </>
    ),
    description: "Next.js, Nuxt, SvelteKit 등 모든 SSR 프레임워크와 완벽 호환. SEO를 포기하지 않고도 멋진 애니메이션을 만들 수 있습니다.",
    buttons: {
      getStarted: "시작하기",
      github: "GitHub",
    },
    quickInstall: {
      react: "React",
      svelte: "Svelte",
      vue: "Vue (지원 예정)",
      solidjs: "SolidJS (지원 예정)",
      qwik: "Qwik (지원 예정)",
    },
    floatingBadges: {
      performance: "60fps 유지",
      stateMemory: "상태 기억",
    },
    // Framework Support Section
    frameworks: {
      title: (
        <>
          모든 환경에서 <span className="gradient-orange">동일한 경험</span>
        </>
      ),
      subtitle: "프레임워크에 관계없이 일관된 API로 사용하세요",
      comingSoon: "(지원 예정)",
    },
    // Why SSGOI Section
    whySSGOI: {
      title: (
        <>
          왜 <span className="gradient-orange">SSGOI</span>인가?
        </>
      ),
      subtitle: "단 3가지만 기억하세요",
      features: {
        ssr: {
          title: "SSR 완벽 지원",
          description: "Next.js, Nuxt, SvelteKit 같은 SSR 프레임워크에서 완벽하게 작동. SEO를 포기하지 않고도 멋진 페이지 전환을 구현하세요.",
        },
        browserCompat: {
          title: "모든 브라우저 호환",
          description: "Chrome, Firefox, Safari 모든 브라우저에서 일관된 경험을 제공합니다.",
        },
        zeroConfig: {
          title: "제로 설정",
          description: "프레임워크의 라우팅을 그대로 이용하세요. 복잡한 설정 없이 바로 시작할 수 있습니다.",
        },
      },
    },
    // Code Example Section
    codeExample: {
      title: (
        <>
          놀랍도록 <span className="gradient-orange">간단한 코드</span>
        </>
      ),
      subtitle: "단 몇 줄로 페이지 전환 애니메이션을 구현하세요",
    },
    // CTA Section
    cta: {
      title: "지금 바로 시작하세요",
      subtitle: "5분이면 충분합니다. SSGOI로 웹에 네이티브 앱 경험을 더하세요.",
      buttons: {
        viewDocs: "문서 보기",
        github: "GitHub",
      },
    },
  },
  metadata: {
    title: "SSGOI - 모던 웹을 위한 아름다운 페이지 전환 라이브러리",
    description:
      "SSGOI는 네이티브 앱과 같은 애니메이션을 웹에 구현하는 강력한 페이지 전환 라이브러리입니다. 상태 보존과 함께 부드러운 스프링 기반 전환을 모든 프레임워크에서 사용하세요.",
    keywords: ["페이지 전환", "애니메이션 라이브러리", "리액트 전환", "뷰 전환", "스벨트 전환", "스프링 애니메이션", "뷰 트랜지션", "웹 애니메이션", "ssgoi"],
    og: {
      title: "SSGOI - 모던 웹을 위한 아름다운 페이지 전환 라이브러리",
      description: "SSGOI로 멋진 페이지 전환을 만드세요. 네이티브 앱과 같은 애니메이션, 상태 보존, 프레임워크 독립적인 설계. React, Vue, Svelte 등 모든 프레임워크에서 작동합니다.",
      siteName: "SSGOI",
      imageAlt: "SSGOI - 페이지 전환 라이브러리",
    },
    twitter: {
      title: "SSGOI - 모던 웹을 위한 아름다운 페이지 전환 라이브러리",
      description: "SSGOI로 멋진 페이지 전환을 만드세요. 네이티브 앱과 같은 애니메이션, 상태 보존, 프레임워크 독립적인 설계.",
      imageAlt: "SSGOI - 페이지 전환 라이브러리",
    },
  },
  sidebar: {
    categories: {
      "getting-started": "시작하기",
      "core-concepts": "핵심 개념",
      "view-transitions": "페이지 전환",
      "transitions": "요소 전환",
    },
  },
  console: {
    welcome: "SSGOI - 쓱오이에 오신 것을 환영합니다!",
    subtitle: "모던 웹을 위한 아름다운 페이지 전환",
    supports: "React, Svelte 등 다양한 프레임워크 지원!",
    visit: "방문: https://github.com/meursyphus/ssgoi",
  },
};

export default ko;
