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
      <span className="font-semibold text-white">
        네이티브 앱 같은 페이지 전환
      </span>
      을 웹에서 구현하세요.
    </>
  ),
  description:
    "Next.js, Nuxt, SvelteKit 등 모든 SSR 프레임워크와 완벽 호환. SEO를 포기하지 않고도 멋진 애니메이션을 만들 수 있습니다.",
  buttons: {
    getStarted: "시작하기",
    github: "GitHub",
    demo: "데모 체험",
  },
  quickInstall: {
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
    angular: "Angular",
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
        description:
          "Next.js, Nuxt, SvelteKit 같은 SSR 프레임워크에서 완벽하게 작동. SEO를 포기하지 않고도 멋진 페이지 전환을 구현하세요.",
      },
      browserCompat: {
        title: "모든 브라우저 호환",
        description:
          "Chrome, Firefox, Safari 모든 브라우저에서 일관된 경험을 제공합니다.",
      },
      zeroConfig: {
        title: "제로 설정",
        description:
          "프레임워크의 라우팅을 그대로 이용하세요. 복잡한 설정 없이 바로 시작할 수 있습니다.",
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
  // Transition Showcase Section
  transitionShowcase: {
    title: {
      line1: "모든 전환을",
      line2: "경험해보세요",
    },
    subtitle:
      "가장 인기 있는 전환 효과들을 미리보세요. 실제 앱에서 어떻게 동작하는지 확인해보세요.",
    transitions: {
      fade: {
        title: "페이드",
        description: "부드러운 불투명도 전환으로 우아한 페이지 전환을 만듭니다",
      },
      hero: {
        title: "히어로",
        description: "공유 요소가 페이지 간에 자연스럽게 변형됩니다",
      },
      scroll: {
        title: "스크롤",
        description: "수직 스크롤 효과로 콘텐츠 간 흐름을 만듭니다",
      },
    },
    viewDocs: "문서 보기",
    viewDocumentation: "문서 보기",
    exploreAllTransitions: "모든 전환 효과 살펴보기",
  },
  // Comparison Section
  comparison: {
    title: {
      line1: "더 나은 선택",
      line2: "SSGOI",
    },
    subtitle: "브라우저 API와 다른 라이브러리들과 비교해보세요",
    table: {
      feature: "기능",
      browserAPI: "브라우저 API",
      browserAPISubtitle: "View Transitions API",
      otherLibs: "다른 라이브러리",
      otherLibsSubtitle: "Framer Motion 등",
      ssgoi: "SSGOI",
      ssgoiSubtitle: "우리의 솔루션",
    },
    features: {
      browserSupport: {
        name: "브라우저 지원",
        browserAPI: "Chrome만",
        otherLibs: "제한적",
        ssgoi: "모든 브라우저",
      },
      frameworkSupport: {
        name: "프레임워크 지원",
        browserAPI: "제한적",
        otherLibs: "특정 프레임워크만",
        ssgoi: "모든 프레임워크",
      },
      ssrSupport: {
        name: "SSR 지원",
        browserAPI: "부분적",
        otherLibs: "문제 있음",
        ssgoi: "완벽 지원",
      },
      routingSystem: {
        name: "라우팅 시스템",
        browserAPI: "기본 라우팅 사용",
        otherLibs: "자체 라우터 필요",
        ssgoi: "기존 라우터 사용",
      },
      physicsAnimations: {
        name: "물리 기반 애니메이션",
        browserAPI: "없음",
        otherLibs: "제한적",
        ssgoi: "스프링 물리",
      },
      customization: {
        name: "커스터마이징",
        browserAPI: "제한적",
        otherLibs: "보통",
        ssgoi: "완전 커스터마이징",
      },
    },
    mobileTitle: "기능 비교",
    mobileDescription: "SSGOI가 다른 솔루션보다 나은 이유",
    advantages: {
      keepStack: {
        title: "기존 스택 유지",
        description:
          "현재 라우터와 프레임워크를 그대로 사용하세요. 추가 의존성이 필요 없습니다.",
      },
      trueCustomization: {
        title: "진정한 커스터마이징",
        description:
          "스프링 물리와 타이밍을 완전히 제어하여 브랜드만의 독특한 경험을 만드세요.",
      },
      universalSupport: {
        title: "범용 지원",
        description:
          "모든 브라우저, 모든 프레임워크, 모든 환경에서 동일하게 작동합니다.",
      },
    },
  },
  // Stats Section
  stats: {
    title: {
      line1: "개발자들이",
      line2: "사랑하는 라이브러리",
    },
    subtitle: "숫자로 보는 SSGOI의 성장",
    items: {
      downloads: "주간 다운로드",
      githubStars: "GitHub 스타",
      contributors: "기여자",
      performance: "성능 점수",
    },
  },
  // Experience Difference Section
  experienceDifference: {
    title: {
      line1: "경험의 차이를",
      line2: "느껴보세요",
    },
    subtitle: "전환 효과가 사용자 경험을 어떻게 변화시키는지 직접 확인하세요",
    traditional: {
      title: "기존 웹",
      uxPoints: {
        lossOfContext: {
          title: "컨텍스트 손실",
          description: "페이지 간 연결이 없어 사용자가 길을 잃습니다",
        },
        highCognitiveLoad: {
          title: "높은 인지 부하",
          description: "갑작스러운 변화로 사용자가 혼란을 느낍니다",
        },
        jarringExperience: {
          title: "불편한 경험",
          description: "화면이 깜빡이고 끊어지는 느낌을 줍니다",
        },
      },
    },
    withSsgoi: {
      title: "SSGOI와 함께",
      uxPoints: {
        maintainsContext: {
          title: "컨텍스트 유지",
          description: "자연스러운 흐름으로 사용자가 위치를 알 수 있습니다",
        },
        lowCognitiveLoad: {
          title: "낮은 인지 부하",
          description: "부드러운 전환으로 이해하기 쉽습니다",
        },
        delightfulExperience: {
          title: "즐거운 경험",
          description: "매끄럽고 반응성 있는 인터랙션을 제공합니다",
        },
      },
    },
    demo: {
      latestPosts: "최신 포스트",
      readTime: "읽기 시간",
      likes: "좋아요",
      back: "뒤로",
      blogPosts: {
        modernWeb: {
          title: "모던 웹 개발의 미래",
          excerpt: "웹 기술이 어떻게 진화하고 있는지...",
        },
        aiDevelopment: {
          title: "AI 개발의 미래",
          excerpt: "AI가 코드를 어떻게 혁신하고 있는지...",
        },
        typescriptPatterns: {
          title: "TypeScript 패턴 마스터하기",
          excerpt: "고급 기능들을 깊이 있게 다뤄봅니다...",
        },
      },
    },
  },
  // Features Timeline Section
  featuresTimeline: {
    title: {
      line1: "필요한 모든 것을",
      line2: "하나의 패키지에",
    },
    subtitle: "모던 웹 개발을 위한 포괄적인 기능들",
    features: {
      oneLineSetup: {
        title: "한 줄 설정",
        description:
          "단 한 줄의 코드로 시작하세요. 복잡한 설정이 필요 없습니다",
      },
      frameworkAgnostic: {
        title: "프레임워크 독립적",
        description: "React, Svelte, Vue와 작동. Solid와 Qwik 지원 예정",
      },
      sharedElements: {
        title: "공유 요소 전환",
        description: "페이지 간 공유 요소로 매끄러운 애니메이션을 만드세요",
      },
      ssrReady: {
        title: "SSR & SSG 지원",
        description:
          "Next.js, Nuxt, SvelteKit 완벽 지원. 하이드레이션 문제 없음, SEO 친화적",
      },
      springPhysics: {
        title: "스프링 물리",
        description: "설정 가능한 스프링 물리로 자연스러운 모션 구현",
      },
      typescriptFirst: {
        title: "TypeScript 우선",
        description: "상세한 타입과 지능형 자동완성으로 완벽한 TypeScript 지원",
      },
    },
  },
  // Why Transitions Matter Section
  whyTransitionsMatter: {
    title: {
      line1: "전환 효과는 단순한",
      line2: "예쁜 효과가 아닙니다",
    },
    subtitle: "직관적이고 매력적인 웹 경험을 만드는 데 필수적입니다",
    reasons: {
      nativeLike: {
        title: "네이티브 같은 경험",
        description:
          "사용자가 기대하는 매끄럽고 반응성 있는 전환으로 웹에서 앱 수준의 인터랙션을 제공하세요",
      },
      brandIdentity: {
        title: "브랜드 아이덴티티",
        description:
          "브랜드를 기억에 남고 독특하게 만드는 고유한 모션 시그니처를 만드세요",
      },
      visualContext: {
        title: "시각적 컨텍스트",
        description:
          "사용자가 탐색할 때 공간 인식을 유지하고 페이지 간 명확한 관계를 보여주세요",
      },
    },
    reasonBadge: "이유 #",
    previous: "이전",
    next: "다음",
    youAreHere: "현재 위치",
    statCards: {
      userEngagement: {
        title: "사용자 참여도",
        percentage: "+40%",
        description: "부드러운 전환으로 사용자가 더 오래 머뭅니다",
      },
      bounceRate: {
        title: "이탈율",
        percentage: "-25%",
        description: "즉시 떠나는 사용자가 줄어듭니다",
      },
      perceivedPerformance: {
        title: "체감 성능",
        percentage: "2배",
        description: "애니메이션으로 앱이 더 빠르게 느껴집니다",
      },
      userSatisfaction: {
        title: "사용자 만족도",
        percentage: "+35%",
        description: "애니메이션이 있는 앱의 평점이 더 높습니다",
      },
    },
    quotes: {
      quote1: (
        <>
          {`"적절한 위치의 애니메이션은 `}
          <span className="text-white">경험을 더 직관적으로 만들고</span> 탐색을
          {`쉽게 합니다."`}
        </>
      ),
      quote2: (
        <>
          {`"모션은 사용자가 `}
          <span className="text-white">내비게이션을 이해하도록 돕고</span>{" "}
          {`유익하면서도 즐거운 피드백을 제공합니다."`}
        </>
      ),
      author1: "— Google Material Design",
      author2: "— Apple Human Interface Guidelines",
    },
    bottomNote: "Nielsen Norman Group과 Google Research의 연구 기반",
  },
};
