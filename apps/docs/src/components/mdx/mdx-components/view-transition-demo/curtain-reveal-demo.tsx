"use client";

import React, { memo } from "react";
import { curtainReveal } from "@ssgoi/react/view-transitions";
import { BrowserContext, BrowserMockup, DemoPage } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Brand Story - Home Page
function HomePage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/curtain-reveal"
      className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-center min-h-full",
          isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12",
        )}
      >
        <div className="text-center space-y-6">
          <div className="inline-block p-3 bg-indigo-500/10 rounded-full mb-4">
            <span className="text-indigo-400 text-sm font-semibold">
              EXPERIENCE
            </span>
          </div>
          <h1
            className={cn(
              "font-bold text-white",
              isMobile ? "text-3xl" : "text-5xl sm:text-7xl",
            )}
          >
            <span className="text-gradient bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              curtain reveal
            </span>
          </h1>
          <p
            className={cn(
              "text-gray-300 max-w-2xl mx-auto",
              isMobile ? "text-base" : "text-xl sm:text-2xl",
            )}
          >
            Tell your brand story with dramatic text sequences and animated
            shapes
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Explore Demo
            </button>
            <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Documentation
            </button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">✨</div>
            <p className="text-gray-400 text-sm">Text Sequences</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-gray-400 text-sm">Shape Animations</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-gray-400 text-sm">Brand Storytelling</p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Features Page
function FeaturesPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/curtain-reveal/features"
      className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="text-center mb-12">
          <h1
            className={cn(
              "font-bold text-white mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Key Features
          </h1>
          <p className="text-gray-300 text-lg">
            Powerful options for crafting memorable transitions
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              📝 Text Sequences
            </h2>
            <p className="text-gray-300 mb-4">
              Display a sequence of text messages that appear one by one,
              perfect for brand messaging, slogans, or storytelling.
            </p>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`curtainReveal({
  texts: ['Welcome', 'To The Future', 'SSGOI']
})`}</code>
            </pre>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              🔷 Shape Options
            </h2>
            <p className="text-gray-300 mb-4">
              Choose from circle, square, or triangle shapes to reveal the next
              page with your preferred visual style.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-900 p-4 rounded text-center">
                <div className="text-3xl mb-2">⚪</div>
                <p className="text-gray-400 text-sm">Circle</p>
              </div>
              <div className="bg-gray-900 p-4 rounded text-center">
                <div className="text-3xl mb-2">⬜</div>
                <p className="text-gray-400 text-sm">Square</p>
              </div>
              <div className="bg-gray-900 p-4 rounded text-center">
                <div className="text-3xl mb-2">🔺</div>
                <p className="text-gray-400 text-sm">Triangle</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">
              🎨 Background Styles
            </h2>
            <p className="text-gray-300 mb-4">
              Support for solid colors and CSS gradients to match your brand
              identity.
            </p>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`// Solid color
background: '#000000'

// Gradient
background: 'linear-gradient(135deg, #667eea, #764ba2)'`}</code>
            </pre>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Use Cases Page
function UseCasesPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/curtain-reveal/use-cases"
      className="bg-gradient-to-br from-gray-900 via-pink-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12",
        )}
      >
        <div className="text-center mb-12">
          <h1
            className={cn(
              "font-bold text-white mb-4",
              isMobile ? "text-3xl" : "text-5xl",
            )}
          >
            Perfect For
          </h1>
          <p className="text-gray-300 text-lg">
            When to use curtain reveal transitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Brand Landing Pages
            </h3>
            <p className="text-gray-400">
              Make a powerful first impression with your brand message, logo, or
              tagline displayed during the transition.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Product Launches
            </h3>
            <p className="text-gray-400">
              Build anticipation for new products with a dramatic reveal that
              captures attention and generates excitement.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Portfolio Showcases
            </h3>
            <p className="text-gray-400">
              Present your work with style, using text to introduce each project
              before revealing the content.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Story-Driven Experiences
            </h3>
            <p className="text-gray-400">
              Guide users through a narrative with sequential text that builds
              context and engagement.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-pink-600 to-purple-600 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-white mb-3 text-center">
            ⚠️ When Not to Use
          </h3>
          <ul className="space-y-2 text-gray-100">
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">✗</span>
              <span>Frequent navigation - can become repetitive</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">✗</span>
              <span>Quick user tasks - may slow down workflow</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">✗</span>
              <span>Information-seeking users - can be distracting</span>
            </li>
          </ul>
        </div>
      </div>
    </DemoPage>
  );
}

// Customization Page
function CustomizationPage() {
  const isMobile = useMobile();

  return (
    <DemoPage
      path="/curtain-reveal/customization"
      className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 min-h-full"
    >
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-center min-h-full",
          isMobile ? "px-3 py-6" : "max-w-4xl px-4",
        )}
      >
        <div className="text-center space-y-6">
          <h1
            className={cn(
              "font-bold text-white mb-6",
              isMobile ? "text-3xl" : "text-5xl sm:text-6xl",
            )}
          >
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Full Customization
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Tailor every aspect to match your brand
          </p>

          <div className="space-y-4 max-w-xl mx-auto text-left">
            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">
                Complete Options
              </h3>
              <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
                <code className="text-gray-300 text-sm">{`curtainReveal({
  // Text sequence
  texts: ['Welcome', 'To SSGOI'],

  // Background (solid or gradient)
  background: 'linear-gradient(to right, #000, #333)',

  // Shape animation
  shape: 'circle', // 'square', 'triangle'

  // Custom text styling
  textStyle: {
    fontSize: '8rem',
    color: '#FFD700',
    fontFamily: 'serif'
  },

  // Spring physics
  inSpring: { stiffness: 20, damping: 25 },
  outSpring: { stiffness: 1, damping: 1 }
})`}</code>
              </pre>
            </div>

            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">
                💡 Tips for Best Results
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Keep text short (1-3 words per message)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Use 2-3 text messages for optimal impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Match background to your brand colors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Test different shapes to find your style</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex justify-center gap-8 mb-8">
              {["✨", "🎨", "🎬", "🎭", "💫"].map((emoji, idx) => (
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
              Start creating memorable brand experiences
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const curtainRevealRoutes: RouteConfig[] = [
  { path: "/curtain-reveal", component: HomePage, label: "Home" },
  {
    path: "/curtain-reveal/features",
    component: FeaturesPage,
    label: "Features",
  },
  {
    path: "/curtain-reveal/use-cases",
    component: UseCasesPage,
    label: "Use Cases",
  },
  {
    path: "/curtain-reveal/customization",
    component: CustomizationPage,
    label: "Customize",
  },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <span className="text-gray-400 text-sm">curtain reveal</span>
    </>
  );
}

export function CurtainRevealDemo() {
  const config = {
    defaultTransition: curtainReveal({
      texts: ["Transform", "Experience", "SSGOI"],
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      shape: "circle",
      inSpring: { stiffness: 20, damping: 25 },
      outSpring: { stiffness: 1, damping: 1 },
    }),
  };

  // Custom layout with brand theme
  function BrandLayout({ children }: { children: React.ReactNode }) {
    return (
      <DemoLayout
        logo="🎬"
        title="Brand Story"
        headerActions={<HeaderActions />}
      >
        {children}
      </DemoLayout>
    );
  }

  return (
    <BrowserMockup
      routes={curtainRevealRoutes}
      config={config}
      layout={BrandLayout}
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
    logo = "🎬",
    title = "Brand Demo",
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
                    isMobile ? "text-base" : "text-xl",
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
                          ? "bg-indigo-900/50 text-white border border-indigo-700"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white",
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
