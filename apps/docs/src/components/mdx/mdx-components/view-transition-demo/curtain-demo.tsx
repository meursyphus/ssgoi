"use client";

import React, { memo } from "react";
import { curtain } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Theater Stage - Opening Scene
function TheaterPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/"
      className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-center min-h-full",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12"
        )}
      >
        <div className="text-center space-y-6">
          <div className="inline-block p-3 bg-red-500/10 rounded-full mb-4">
            <span className="text-red-400 text-sm font-semibold">
              NOW SHOWING
            </span>
          </div>
          <h1
            className={cn(
              "font-bold text-white",
              isMobile ? "text-3xl" : "text-5xl sm:text-7xl"
            )}
          >
            <span className="text-gradient bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              CURTAIN
            </span>
          </h1>
          <p
            className={cn(
              "text-gray-300 max-w-2xl mx-auto",
              isMobile ? "text-base" : "text-xl sm:text-2xl"
            )}
          >
            Experience dramatic transitions that create anticipation and focus
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Watch Demo
            </button>
            <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">🎭</div>
            <p className="text-gray-400 text-sm">Theater Mode</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-gray-400 text-sm">Cinematic Feel</p>
          </div>
          <div>
            <div className="text-4xl mb-2">✨</div>
            <p className="text-gray-400 text-sm">Dramatic Effect</p>
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
    <DemoPage
      path="/act1"
      className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12"
        )}
      >
        <div className="text-center mb-12">
          <h1
            className={cn(
              "font-bold text-white mb-4",
              isMobile ? "text-3xl" : "text-5xl"
            )}
          >
            Act I: The Beginning
          </h1>
          <p className="text-gray-300 text-lg">
            When the curtain rises, a new story unfolds
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              🎯 Perfect For
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Onboarding flows where each step builds anticipation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Result reveals that need dramatic presentation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Gallery or presentation modes with theatrical feel</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Story-driven experiences and narratives</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              ⚙️ Customization Options
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`curtain({
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
    <DemoPage
      path="/act2"
      className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12"
        )}
      >
        <div className="text-center mb-12">
          <h1
            className={cn(
              "font-bold text-white mb-4",
              isMobile ? "text-3xl" : "text-5xl"
            )}
          >
            Act II: The Reveal
          </h1>
          <p className="text-gray-300 text-lg">
            Building tension before the grand reveal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">🎪</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Stage Performance
            </h3>
            <p className="text-gray-400">
              Like a theater curtain, the transition creates a clear separation
              between scenes, perfect for storytelling experiences.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Focus Attention
            </h3>
            <p className="text-gray-400">
              The sequential blind animation naturally draws the user's eye,
              creating anticipation for what's coming next.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Timing Control
            </h3>
            <p className="text-gray-400">
              Fine-tune the speed and stagger of each blind to create the
              perfect dramatic timing for your content.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Visual Impact
            </h3>
            <p className="text-gray-400">
              The curtain effect adds a premium, polished feel to transitions,
              elevating the perceived quality of your application.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Create Your Own Drama
          </h3>
          <p className="text-gray-100 mb-6">
            Transform ordinary page transitions into memorable experiences
          </p>
          <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started with Curtain
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
    <DemoPage
      path="/finale"
      className="bg-gradient-to-br from-gray-900 via-yellow-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-center min-h-full",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4"
        )}
      >
        <div className="text-center space-y-6">
          <h1
            className={cn(
              "font-bold text-white mb-6",
              isMobile ? "text-3xl" : "text-5xl sm:text-6xl"
            )}
          >
            <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              The Grand Finale
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Every great show deserves an unforgettable ending
          </p>

          <div className="space-y-4 max-w-xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg text-left">
              <code className="text-sm text-gray-300">
                <span className="text-blue-400">import</span>{" "}
                <span className="text-yellow-400">{"{ curtain }"}</span>{" "}
                <span className="text-blue-400">from</span>{" "}
                <span className="text-green-400">'@ssgoi/react/view-transitions'</span>;
              </code>
            </div>

            <div className="bg-gray-800/50 backdrop-blur p-4 rounded-lg text-left">
              <code className="text-sm text-gray-300">
                <span className="text-blue-400">const</span> config = {"{"}
                <br />
                {"  "}defaultTransition: <span className="text-yellow-400">curtain</span>()
                <br />
                {"}"};
              </code>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex justify-center gap-8 mb-8">
              {["🎭", "🎪", "🎨", "✨", "🎬"].map((emoji, idx) => (
                <div
                  key={idx}
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            
            <p className="text-gray-400 text-sm">
              Thank you for watching the Curtain Transition Demo
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const curtainRoutes: RouteConfig[] = [
  { path: "/", component: TheaterPage, label: "Opening" },
  { path: "/act1", component: Act1Page, label: "Act I" },
  { path: "/act2", component: Act2Page, label: "Act II" },
  { path: "/finale", component: FinalePage, label: "Finale" },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <span className="text-gray-400 text-sm">Curtain Transition</span>
    </>
  );
}

export function CurtainDemo() {
  const config = {
    defaultTransition: curtain({
      blindCount: 10,
      staggerDelay: 30,
      direction: 'horizontal'
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
    <BrowserMockup routes={curtainRoutes} config={config} layout={TheaterLayout} />
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
        <header className="bg-gray-900 border-b border-gray-700">
          <div className={cn("mx-auto", isMobile ? "px-3" : "max-w-6xl px-4")}>
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-4">
                <h1
                  className={cn(
                    "font-bold text-white flex items-center gap-2",
                    isMobile ? "text-base" : "text-xl"
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
                        "rounded-md font-medium transition-all",
                        isMobile ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm",
                        currentPath === route.path
                          ? "bg-red-900/50 text-white border border-red-700"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
  }
);

DemoLayout.displayName = "DemoLayout";