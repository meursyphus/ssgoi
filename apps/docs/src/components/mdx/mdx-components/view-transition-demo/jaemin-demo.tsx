"use client";

import React, { memo } from "react";
import { jaeminInternal } from "@ssgoi/core";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// English content
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
  layout: {
    home: "Home",
    premium: "Premium",
    achievement: "Achievement",
    settings: "Settings",
    creator: "by Jaemin Cheon",
  },
};

// Home Page - Brand identity use case
function HomePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin"
      className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12 sm:py-20",
        )}
      >
        <div className="text-center space-y-6">
          <div className="inline-block p-3 bg-purple-500/10 rounded-full mb-4">
            <span className="text-purple-400 text-sm font-semibold">
              {content.home.badge}
            </span>
          </div>
          <h1
            className={cn(
              "font-bold text-white",
              isMobile ? "text-3xl" : "text-5xl sm:text-7xl",
            )}
          >
            <span className="text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              {content.home.title}
            </span>
          </h1>
          <h2
            className={cn(
              "text-gray-200 font-semibold",
              isMobile ? "text-lg" : "text-2xl sm:text-3xl",
            )}
          >
            {content.home.subtitle}
          </h2>
          <p
            className={cn(
              "text-gray-300 max-w-2xl mx-auto",
              isMobile ? "text-base" : "text-xl",
            )}
          >
            {content.home.description}
          </p>
          <div className="pt-8">
            <button className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-lg font-semibold">
              {content.home.cta}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          {content.home.features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-800/50 p-6 rounded-lg backdrop-blur"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Premium Page - Premium experience use case
function PremiumPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin/premium"
      className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-indigo-500/10 rounded-full mb-4">
            <span className="text-indigo-400 text-sm font-semibold">
              {content.premium.badge}
            </span>
          </div>
          <h1
            className={cn(
              "font-bold text-white mb-4",
              isMobile ? "text-2xl" : "text-4xl",
            )}
          >
            {content.premium.title}
          </h1>
          <h2
            className={cn(
              "text-indigo-300 mb-4",
              isMobile ? "text-lg" : "text-xl",
            )}
          >
            {content.premium.subtitle}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {content.premium.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {content.premium.features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-lg backdrop-blur border border-indigo-500/20"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all text-lg font-semibold">
            {content.premium.cta}
          </button>
        </div>
      </div>
    </DemoPage>
  );
}

// Achievement Page - Special moments use case
function AchievementPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin/achievement"
      className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto text-center",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="mb-8">
          <div className="inline-block p-3 bg-emerald-500/10 rounded-full mb-4">
            <span className="text-emerald-400 text-sm font-semibold">
              {content.achievement.badge}
            </span>
          </div>
          <div className="text-6xl mb-4">🏆</div>
          <h1
            className={cn(
              "font-bold text-white mb-2",
              isMobile ? "text-2xl" : "text-4xl",
            )}
          >
            {content.achievement.title}
          </h1>
          <h2
            className={cn(
              "text-emerald-300 mb-4",
              isMobile ? "text-lg" : "text-xl",
            )}
          >
            {content.achievement.subtitle}
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {content.achievement.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {content.achievement.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20"
            >
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.achievement.rewards.map((reward, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 rounded-lg backdrop-blur border border-emerald-500/20"
            >
              <div className="text-3xl mb-3">{reward.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {reward.title}
              </h3>
              <p className="text-gray-300 text-sm">{reward.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Settings Page - Standard navigation (non-special use case)
function SettingsPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/jaemin/settings"
      className="bg-gradient-to-br from-slate-900 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <h1
          className={cn(
            "font-bold text-white mb-8",
            isMobile ? "text-2xl" : "text-4xl",
          )}
        >
          {content.settings.title}
        </h1>

        <div className="space-y-8">
          {content.settings.sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="bg-gray-800/50 p-4 rounded-lg backdrop-blur border border-gray-700/50 hover:border-gray-600/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
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
    </DemoPage>
  );
}

// Route configuration
const jaeminRoutes: RouteConfig[] = [
  { path: "/jaemin", component: HomePage, label: "home" },
  { path: "/jaemin/premium", component: PremiumPage, label: "premium" },
  {
    path: "/jaemin/achievement",
    component: AchievementPage,
    label: "achievement",
  },
  { path: "/jaemin/settings", component: SettingsPage, label: "settings" },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <a
        href="https://github.com/elrion018"
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        title="Jaemin Cheon GitHub"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </a>
      <a
        href="https://github.com/elrion018"
        className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
        target="_blank"
        rel="noopener noreferrer"
        title="Jaemin Cheon GitHub"
      >
        {content.layout.creator}
      </a>
    </>
  );
}

export function JaeminDemo() {
  const config = {
    transitions: [
      // Use jaemin transition for all special pages (excluding settings)
      {
        from: "/jaemin",
        to: "/jaemin/premium",
        transition: jaeminInternal({ containerMode: "positioned-parent" }),
        symmetric: true,
      },
      {
        from: "/jaemin",
        to: "/jaemin/achievement",
        transition: jaeminInternal({ containerMode: "positioned-parent" }),
        symmetric: true,
      },
      {
        from: "/jaemin/premium",
        to: "/jaemin/achievement",
        transition: jaeminInternal({ containerMode: "positioned-parent" }),
        symmetric: true,
      },
      // Settings uses standard browser navigation (not special)
      // No transition defined = uses browser default navigation
    ],
  };

  // Custom layout with Jaemin branding
  function JaeminLayout({ children }: { children: React.ReactNode }) {
    return <DemoLayout>{children}</DemoLayout>;
  }

  return (
    <BrowserMockup
      routes={jaeminRoutes}
      config={config}
      layout={JaeminLayout}
    />
  );
}

// Default Demo Layout Component
interface DemoLayoutProps {
  children: React.ReactNode;
}

const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  const context = React.useContext(BrowserContext);
  const isMobile = useMobile();

  if (!context) return <>{children}</>;

  const { currentPath, navigate, routes } = context;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className={cn("mx-auto", isMobile ? "px-3" : "max-w-6xl px-4")}>
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <h1
                className={cn(
                  "font-bold text-white flex items-center gap-2",
                  isMobile ? "text-base" : "text-xl",
                )}
              >
                <span>⭐</span>
                <span>Stellar</span>
              </h1>
              <nav className="flex items-center gap-1">
                {routes.map((route) => (
                  <button
                    key={route.path}
                    onClick={() => navigate(route.path)}
                    className={cn(
                      "rounded-md font-medium transition-all",
                      isMobile ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm",
                      currentPath === route.path
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    )}
                  >
                    {content.layout[
                      route.label as keyof typeof content.layout
                    ] || route.label}
                  </button>
                ))}
              </nav>
            </div>
            {!isMobile && (
              <div className="flex items-center gap-4">
                <HeaderActions />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-0">{children}</main>
    </div>
  );
});

DemoLayout.displayName = "JaeminDemoLayout";
