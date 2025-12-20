/**
 * Jaemin Demo - Sandpack Version
 *
 * This is a self-contained version of the jaemin demo designed to run
 * in Sandpack's isolated iframe environment. All dependencies are inlined
 * and it only imports from React and @ssgoi/react.
 *
 * DO NOT use external components like BrowserMockup, DemoPage, etc.
 */

import React, { useState, createContext, useContext, memo } from "react";
import { Ssgoi, SsgoiTransition } from "@ssgoi/react";
import { jaemin } from "@ssgoi/react/view-transitions";

// ============================================
// Utility Functions (inlined)
// ============================================

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ============================================
// Routing Context
// ============================================

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouter must be used within RouterProvider");
  return context;
}

// ============================================
// Content Data
// ============================================

const content = {
  home: {
    badge: "WELCOME",
    title: "Stellar",
    subtitle: "Experience the Universe",
    description:
      "Discover cosmic wonders and explore the mysteries of space with our premium stargazing platform.",
    cta: "Start Journey",
    features: [
      {
        icon: "🌟",
        title: "Premium Experience",
        description: "Unlock exclusive content and premium features",
      },
      {
        icon: "🎯",
        title: "Special Moments",
        description: "Celebrate achievements with unique animations",
      },
      {
        icon: "🚀",
        title: "Brand Identity",
        description: "Express your unique personality and style",
      },
    ],
  },
  premium: {
    badge: "PREMIUM",
    title: "Cosmic Explorer",
    subtitle: "Premium Membership",
    description:
      "Access exclusive star maps, advanced telescope controls, and personalized constellation guides.",
    features: [
      {
        icon: "🔭",
        title: "Advanced Telescope",
        description: "Professional-grade virtual telescope with 360° view",
      },
      {
        icon: "⭐",
        title: "Star Catalog",
        description: "Complete database of 100,000+ celestial objects",
      },
      {
        icon: "🌌",
        title: "Deep Space",
        description: "Explore galaxies, nebulae, and cosmic phenomena",
      },
    ],
    cta: "Upgrade Now",
  },
  achievement: {
    badge: "ACHIEVEMENT UNLOCKED",
    title: "Stellar Navigator",
    subtitle: "Congratulations!",
    description:
      "You've successfully identified 100 constellations and earned the prestigious Stellar Navigator badge.",
    stats: [
      { value: "100", label: "Constellations" },
      { value: "50", label: "Deep Sky Objects" },
      { value: "25", label: "Planets Observed" },
    ],
    rewards: [
      {
        icon: "🏆",
        title: "Navigator Badge",
        description: "Exclusive badge for your profile",
      },
      {
        icon: "🎁",
        title: "Premium Month",
        description: "Free premium access for 30 days",
      },
      {
        icon: "⭐",
        title: "Special Title",
        description: "Unlock the 'Stellar Navigator' title",
      },
    ],
  },
  settings: {
    title: "Settings",
    sections: [
      {
        title: "Account",
        items: [
          {
            icon: "👤",
            title: "Profile",
            description: "Manage your account information",
          },
          {
            icon: "🔒",
            title: "Privacy",
            description: "Control your privacy settings",
          },
        ],
      },
      {
        title: "Preferences",
        items: [
          {
            icon: "🌙",
            title: "Dark Mode",
            description: "Toggle dark/light theme",
          },
          {
            icon: "🔔",
            title: "Notifications",
            description: "Manage notification preferences",
          },
        ],
      },
    ],
  },
  nav: {
    home: "Home",
    premium: "Premium",
    achievement: "Achievement",
    settings: "Settings",
  },
};

// ============================================
// Route Configuration
// ============================================

const routes = [
  { path: "/", label: "home" },
  { path: "/premium", label: "premium" },
  { path: "/achievement", label: "achievement" },
  { path: "/settings", label: "settings" },
];

// ============================================
// Page Components
// ============================================

function HomePage() {
  return (
    <SsgoiTransition id="/" className="min-h-full">
      <div className="bg-[#121212] min-h-full">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
          <div className="text-center space-y-5">
            <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
              <span className="text-neutral-400 text-xs font-medium tracking-wider">
                {content.home.badge}
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-medium text-neutral-100">
              {content.home.title}
            </h1>
            <h2 className="text-lg text-neutral-300">
              {content.home.subtitle}
            </h2>
            <p className="text-sm text-neutral-500 max-w-2xl mx-auto">
              {content.home.description}
            </p>
            <div className="pt-6">
              <button className="px-6 py-2.5 bg-white text-neutral-900 text-sm rounded-lg hover:bg-neutral-200 transition-colors">
                {content.home.cta}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
            {content.home.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/[0.02] border border-white/5 p-5 rounded-lg"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-sm font-medium text-neutral-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}

function PremiumPage() {
  return (
    <SsgoiTransition id="/premium" className="min-h-full">
      <div className="bg-[#121212] min-h-full">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
              <span className="text-neutral-400 text-xs font-medium tracking-wider">
                {content.premium.badge}
              </span>
            </div>
            <h1 className="text-3xl font-medium text-neutral-100 mb-3">
              {content.premium.title}
            </h1>
            <h2 className="text-base text-neutral-300 mb-3">
              {content.premium.subtitle}
            </h2>
            <p className="text-neutral-500 text-sm max-w-2xl mx-auto">
              {content.premium.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {content.premium.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/[0.02] p-5 rounded-lg border border-white/5"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="text-sm font-medium text-neutral-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-xs">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="px-6 py-2.5 bg-white text-neutral-900 text-sm rounded-lg hover:bg-neutral-200 transition-colors">
              {content.premium.cta}
            </button>
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}

function AchievementPage() {
  return (
    <SsgoiTransition id="/achievement" className="min-h-full">
      <div className="bg-[#121212] min-h-full">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="mb-8">
            <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
              <span className="text-neutral-400 text-xs font-medium tracking-wider">
                {content.achievement.badge}
              </span>
            </div>
            <div className="text-4xl mb-4">🏆</div>
            <h1 className="text-3xl font-medium text-neutral-100 mb-2">
              {content.achievement.title}
            </h1>
            <h2 className="text-base text-neutral-300 mb-3">
              {content.achievement.subtitle}
            </h2>
            <p className="text-neutral-500 text-sm max-w-2xl mx-auto">
              {content.achievement.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {content.achievement.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/[0.02] p-4 rounded-lg border border-white/5"
              >
                <div className="text-lg font-medium text-neutral-200 mb-1">
                  {stat.value}
                </div>
                <div className="text-neutral-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.achievement.rewards.map((reward, idx) => (
              <div
                key={idx}
                className="bg-white/[0.02] p-5 rounded-lg border border-white/5"
              >
                <div className="text-2xl mb-3">{reward.icon}</div>
                <h3 className="text-sm font-medium text-neutral-200 mb-2">
                  {reward.title}
                </h3>
                <p className="text-neutral-500 text-xs">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}

function SettingsPage() {
  return (
    <SsgoiTransition id="/settings" className="min-h-full">
      <div className="bg-[#121212] min-h-full">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-medium text-neutral-100 mb-8">
            {content.settings.title}
          </h1>

          <div className="space-y-6">
            {content.settings.sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h2 className="text-sm font-medium text-neutral-300 mb-3">
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="bg-white/[0.02] p-4 rounded-lg border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-xl">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-neutral-200 text-sm mb-0.5">
                            {item.title}
                          </h3>
                          <p className="text-neutral-500 text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SsgoiTransition>
  );
}

// ============================================
// Layout Component
// ============================================

const AppLayout = memo(({ children }: { children: React.ReactNode }) => {
  const { currentPath, navigate } = useRouter();

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-[#121212] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <h1 className="text-base font-medium text-neutral-200 flex items-center gap-2">
                <span>⭐</span>
                <span>Stellar</span>
              </h1>
              <nav className="flex items-center gap-1">
                {routes.map((route) => (
                  <button
                    key={route.path}
                    onClick={() => navigate(route.path)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-md transition-all",
                      currentPath === route.path
                        ? "bg-white/5 text-neutral-100"
                        : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300",
                    )}
                  >
                    {content.nav[route.label as keyof typeof content.nav]}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/elrion018"
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <span className="text-gray-500 text-sm">by Jaemin Cheon</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-0">{children}</main>
    </div>
  );
});

AppLayout.displayName = "AppLayout";

// ============================================
// Route Renderer
// ============================================

function RouteRenderer({ path }: { path: string }) {
  switch (path) {
    case "/":
      return <HomePage />;
    case "/premium":
      return <PremiumPage />;
    case "/achievement":
      return <AchievementPage />;
    case "/settings":
      return <SettingsPage />;
    default:
      return <HomePage />;
  }
}

// ============================================
// Main App Component
// ============================================

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");

  const navigate = (path: string) => {
    if (path !== currentPath) {
      setCurrentPath(path);
      // Notify parent window of navigation (for address bar sync)
      window.parent?.postMessage({ type: "SSGOI_NAVIGATION", path }, "*");
    }
  };

  const config = {
    transitions: [
      {
        from: "/",
        to: "/premium",
        transition: jaemin(),
        symmetric: true,
      },
      {
        from: "/",
        to: "/achievement",
        transition: jaemin(),
        symmetric: true,
      },
      {
        from: "/premium",
        to: "/achievement",
        transition: jaemin(),
        symmetric: true,
      },
    ],
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      <Ssgoi config={config}>
        <AppLayout>
          <RouteRenderer path={currentPath} />
        </AppLayout>
      </Ssgoi>
    </RouterContext.Provider>
  );
}
