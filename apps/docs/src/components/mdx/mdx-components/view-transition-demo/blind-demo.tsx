"use client";

import React, { memo } from "react";
import { blind } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Theater Stage - Opening Scene
function TheaterPage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-center min-h-full",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12",
        )}
      >
        <div className="text-center space-y-6">
          <div className="inline-block px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-4">
            <span className="text-neutral-400 text-xs font-medium tracking-wider">
              NOW SHOWING
            </span>
          </div>
          <h1
            className={cn(
              "font-medium text-neutral-100",
              isMobile ? "text-3xl" : "text-5xl sm:text-7xl",
            )}
          >
            blind
          </h1>
          <p
            className={cn(
              "text-neutral-400 max-w-2xl mx-auto",
              isMobile ? "text-sm" : "text-base",
            )}
          >
            Experience dramatic transitions that create anticipation and focus
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-8">
            <button className="px-6 py-2.5 bg-white text-neutral-900 text-sm rounded-lg hover:bg-neutral-200 transition-colors">
              Watch Demo
            </button>
            <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-neutral-300 text-sm rounded-lg hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-2">🎭</div>
            <p className="text-neutral-500 text-xs">Theater Mode</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🎬</div>
            <p className="text-neutral-500 text-xs">Cinematic Feel</p>
          </div>
          <div>
            <div className="text-2xl mb-2">✨</div>
            <p className="text-neutral-500 text-xs">Dramatic Effect</p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Act 1 - Introduction
function Act1Page() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind/act1" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="text-center mb-10">
          <h1
            className={cn(
              "font-medium text-neutral-100 mb-3",
              isMobile ? "text-2xl" : "text-4xl",
            )}
          >
            Act I: The Beginning
          </h1>
          <p className="text-neutral-400 text-sm">
            When the blind rises, a new story unfolds
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-lg">
            <h2 className="text-base font-medium text-neutral-200 mb-4">
              Perfect For
            </h2>
            <ul className="space-y-2.5 text-neutral-400 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-neutral-500 mt-0.5">✓</span>
                <span>
                  Onboarding flows where each step builds anticipation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-500 mt-0.5">✓</span>
                <span>Result reveals that need dramatic presentation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-500 mt-0.5">✓</span>
                <span>Gallery or presentation modes with theatrical feel</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neutral-500 mt-0.5">✓</span>
                <span>Story-driven experiences and narratives</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-lg">
            <h2 className="text-base font-medium text-neutral-200 mb-4">
              Customization Options
            </h2>
            <pre className="bg-[#111] border border-white/5 p-4 rounded overflow-x-auto">
              <code className="text-neutral-400 text-xs">{`blind({
  blindCount: 12,      // Number of blind strips
  direction: 'horizontal', // or 'vertical'
  staggerDelay: 30,    // Delay between each blind
  transitionDelay: 100 // Pause between out and in
})`}</code>
            </pre>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Act 2 - The Reveal
function Act2Page() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind/act2" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="text-center mb-10">
          <h1
            className={cn(
              "font-medium text-neutral-100 mb-3",
              isMobile ? "text-2xl" : "text-4xl",
            )}
          >
            Act II: The Reveal
          </h1>
          <p className="text-neutral-400 text-sm">
            Building tension before the grand reveal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-lg">
            <div className="text-2xl mb-3">🎪</div>
            <h3 className="text-sm font-medium text-neutral-200 mb-2">
              Stage Performance
            </h3>
            <p className="text-neutral-500 text-xs">
              Like a theater blind, the transition creates a clear separation
              between scenes, perfect for storytelling experiences.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-lg">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="text-sm font-medium text-neutral-200 mb-2">
              Focus Attention
            </h3>
            <p className="text-neutral-500 text-xs">
              The sequential blind animation naturally draws the user&apos;s
              eye, creating anticipation for what&apos;s coming next.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-lg">
            <div className="text-2xl mb-3">⏱️</div>
            <h3 className="text-sm font-medium text-neutral-200 mb-2">
              Timing Control
            </h3>
            <p className="text-neutral-500 text-xs">
              Fine-tune the speed and stagger of each blind to create the
              perfect dramatic timing for your content.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-5 rounded-lg">
            <div className="text-2xl mb-3">🎨</div>
            <h3 className="text-sm font-medium text-neutral-200 mb-2">
              Visual Impact
            </h3>
            <p className="text-neutral-500 text-xs">
              The blind effect adds a premium, polished feel to transitions,
              elevating the perceived quality of your application.
            </p>
          </div>
        </div>

        <div className="mt-10 bg-white/[0.02] border border-white/10 p-6 rounded-lg text-center">
          <h3 className="text-base font-medium text-neutral-100 mb-2">
            Create Your Own Drama
          </h3>
          <p className="text-neutral-400 text-sm mb-5">
            Transform ordinary page transitions into memorable experiences
          </p>
          <button className="px-5 py-2 bg-white text-neutral-900 text-sm rounded-lg hover:bg-neutral-200 transition-colors">
            Get Started with blind
          </button>
        </div>
      </div>
    </DemoPage>
  );
}

// Finale Page
function FinalePage() {
  const isMobile = useMobile();

  return (
    <DemoPage path="/blind/finale" className="bg-[#121212] min-h-full">
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-center min-h-full",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4",
        )}
      >
        <div className="text-center space-y-6">
          <h1
            className={cn(
              "font-medium text-neutral-100 mb-4",
              isMobile ? "text-2xl" : "text-4xl",
            )}
          >
            The Grand Finale
          </h1>

          <p className="text-sm text-neutral-400 max-w-2xl mx-auto mb-6">
            Every great show deserves an unforgettable ending
          </p>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="bg-[#111] border border-white/5 p-4 rounded-lg text-left">
              <code className="text-xs text-neutral-400">
                <span className="text-neutral-300">import</span>{" "}
                <span className="text-neutral-200">{"{ blind }"}</span>{" "}
                <span className="text-neutral-300">from</span>{" "}
                <span className="text-neutral-400">
                  &apos;@ssgoi/react/view-transitions&apos;
                </span>
                ;
              </code>
            </div>

            <div className="bg-[#111] border border-white/5 p-4 rounded-lg text-left">
              <code className="text-xs text-neutral-400">
                <span className="text-neutral-300">const</span> config = {"{"}
                <br />
                {"  "}defaultTransition:{" "}
                <span className="text-neutral-200">blind</span>()
                <br />
                {"}"};
              </code>
            </div>
          </div>

          <div className="pt-6">
            <div className="flex justify-center gap-6 mb-6">
              {["🎭", "🎪", "🎨", "✨", "🎬"].map((emoji, idx) => (
                <div key={idx} className="text-2xl">
                  {emoji}
                </div>
              ))}
            </div>

            <p className="text-neutral-500 text-xs">
              Thank you for watching the blind Transition Demo
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const blindRoutes: RouteConfig[] = [
  { path: "/blind", component: TheaterPage, label: "Opening" },
  { path: "/blind/act1", component: Act1Page, label: "Act I" },
  { path: "/blind/act2", component: Act2Page, label: "Act II" },
  { path: "/blind/finale", component: FinalePage, label: "Finale" },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <span className="text-gray-400 text-sm">blind Transition</span>
    </>
  );
}

export function BlindDemo() {
  const config = {
    defaultTransition: blind({
      blindCount: 10,
      inSpring: { stiffness: 200, damping: 20 },
      outSpring: { stiffness: 200, damping: 20 },
      direction: "horizontal",
      blindColor: "#131313",
    }),
  };

  // Custom layout with theater theme
  function TheaterLayout({ children }: { children: React.ReactNode }) {
    return (
      <DemoLayout logo="🎭" title="Theater" headerActions={<HeaderActions />}>
        {children}
      </DemoLayout>
    );
  }

  return (
    <BrowserMockup
      routes={blindRoutes}
      config={config}
      layout={TheaterLayout}
    />
  );
}

// Demo Layout Component
interface DemoLayoutProps {
  children: React.ReactNode;
  logo?: string;
  title?: string;
  headerActions?: React.ReactNode;
}

const DemoLayout = memo(
  ({
    children,
    logo = "🎭",
    title = "Theater Demo",
    headerActions,
  }: DemoLayoutProps) => {
    const context = React.useContext(BrowserContext);
    const isMobile = useMobile();

    if (!context) return <>{children}</>;

    const { currentPath, navigate, routes } = context;

    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-[#121212] border-b border-white/5">
          <div className={cn("mx-auto", isMobile ? "px-3" : "max-w-6xl px-4")}>
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center gap-4">
                <h1
                  className={cn(
                    "font-medium text-neutral-200 flex items-center gap-2",
                    isMobile ? "text-sm" : "text-base",
                  )}
                >
                  <span>{logo}</span>
                  <span>{title}</span>
                </h1>
                <nav className="flex items-center gap-1">
                  {routes.map((route) => (
                    <button
                      key={route.path}
                      onClick={() => navigate(route.path)}
                      className={cn(
                        "rounded-md transition-all",
                        isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs",
                        currentPath === route.path
                          ? "bg-white/5 text-neutral-100"
                          : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300",
                      )}
                    >
                      {route.label}
                    </button>
                  ))}
                </nav>
              </div>
              {!isMobile && headerActions && (
                <div className="flex items-center gap-4">{headerActions}</div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative z-0">{children}</main>
      </div>
    );
  },
);

DemoLayout.displayName = "DemoLayout";
