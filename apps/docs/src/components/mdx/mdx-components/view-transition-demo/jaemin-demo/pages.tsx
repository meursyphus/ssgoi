"use client";

import React from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { cn } from "../../../../../lib/utils";
import { useMobile } from "../../../../../lib/use-mobile";
import { content } from "./content";

// DemoPage wrapper with SsgoiTransition
interface DemoPageProps {
  children: React.ReactNode;
  className?: string;
  path: string;
}

export const DemoPage = React.memo(
  ({ children, className, path }: DemoPageProps) => {
    return (
      <SsgoiTransition id={path} className={cn("min-h-full pt-16", className)}>
        {children}
      </SsgoiTransition>
    );
  },
);

DemoPage.displayName = "DemoPage";

// Home Page - Brand identity use case
export function HomePage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/jaemin" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12 sm:py-20",
        )}
      >
        <div className="text-center space-y-5">
          <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
            <span className="text-neutral-400 text-xs font-medium tracking-wider">
              {content.home.badge}
            </span>
          </div>
          <h1
            className={cn(
              "font-medium text-neutral-100",
              isMobile ? "text-3xl" : "text-5xl sm:text-6xl",
            )}
          >
            {content.home.title}
          </h1>
          <h2
            className={cn(
              "text-neutral-300",
              isMobile ? "text-base" : "text-lg",
            )}
          >
            {content.home.subtitle}
          </h2>
          <p
            className={cn(
              "text-neutral-500 max-w-2xl mx-auto",
              isMobile ? "text-sm" : "text-sm",
            )}
          >
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
              <p className="text-neutral-500 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Premium Page - Premium experience use case
export function PremiumPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/jaemin/premium" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
            <span className="text-neutral-400 text-xs font-medium tracking-wider">
              {content.premium.badge}
            </span>
          </div>
          <h1
            className={cn(
              "font-medium text-neutral-100 mb-3",
              isMobile ? "text-2xl" : "text-3xl",
            )}
          >
            {content.premium.title}
          </h1>
          <h2
            className={cn(
              "text-neutral-300 mb-3",
              isMobile ? "text-sm" : "text-base",
            )}
          >
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
              <p className="text-neutral-500 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-6 py-2.5 bg-white text-neutral-900 text-sm rounded-lg hover:bg-neutral-200 transition-colors">
            {content.premium.cta}
          </button>
        </div>
      </div>
    </DemoPage>
  );
}

// Achievement Page - Special moments use case
export function AchievementPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/jaemin/achievement" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto text-center",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="mb-8">
          <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
            <span className="text-neutral-400 text-xs font-medium tracking-wider">
              {content.achievement.badge}
            </span>
          </div>
          <div className="text-4xl mb-4">🏆</div>
          <h1
            className={cn(
              "font-medium text-neutral-100 mb-2",
              isMobile ? "text-2xl" : "text-3xl",
            )}
          >
            {content.achievement.title}
          </h1>
          <h2
            className={cn(
              "text-neutral-300 mb-3",
              isMobile ? "text-sm" : "text-base",
            )}
          >
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
    </DemoPage>
  );
}

// Settings Page - Standard navigation (non-special use case)
export function SettingsPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/jaemin/settings" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <h1
          className={cn(
            "font-medium text-neutral-100 mb-8",
            isMobile ? "text-xl" : "text-2xl",
          )}
        >
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
    </DemoPage>
  );
}
