import { HomeMessages } from "../types/home";

export const home: HomeMessages = {
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
    demo: "데모 체험",
  },
  quickInstall: {
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
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
      demo: "데모 체험",
    },
  },
};