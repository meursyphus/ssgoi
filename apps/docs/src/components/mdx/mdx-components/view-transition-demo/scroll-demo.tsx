"use client";

import React, { useState } from "react";
import { scroll } from "@ssgoi/react/view-transitions";
import {
  BrowserMockup,
  DemoPage,
  DemoLink,
  useBrowserNavigation,
} from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";

// Intro Section Page
function IntroPage() {
  return (
    <DemoPage path="/intro">
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-3 md:mb-6 text-2xl md:text-4xl">📝</div>

        <h1 className="mb-3 md:mb-4 text-xl md:text-3xl font-bold text-gray-100">
          Scroll Transitions
        </h1>

        <p className="mb-4 md:mb-6 text-sm md:text-lg text-gray-400">
          Experience smooth, natural scrolling transitions between pages.
        </p>

        <div className="space-y-2 md:space-y-3">
          {[
            "Smooth scroll animations",
            "Mobile app-like UX",
            "Intuitive page navigation",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-2 md:space-x-3">
              <div className="mt-0.5 md:mt-1">
                <svg
                  className="h-4 w-4 md:h-5 md:w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs md:text-base text-gray-300">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 md:mt-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 md:p-6 border border-gray-600">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="rounded-full bg-blue-600 p-1.5 md:p-2">
              <svg
                className="h-4 w-4 md:h-5 md:w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-gray-100">Get Started</p>
              <p className="text-xs md:text-sm text-gray-400">
                Click the menu items to navigate between sections
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Features Section Page
function FeaturesPage() {
  return (
    <DemoPage path="/features">
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-3 md:mb-6 text-2xl md:text-4xl">✨</div>

        <h1 className="mb-3 md:mb-4 text-xl md:text-3xl font-bold text-gray-100">Key Features</h1>

        <p className="mb-4 md:mb-6 text-sm md:text-lg text-gray-400">
          Discover the powerful features of scroll transitions.
        </p>

        <div className="space-y-3">
          {[
            "Direction control (up/down)",
            "Spring animation customization",
            "GPU acceleration support",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-300">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 md:mt-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 md:p-6 border border-gray-600">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="rounded-full bg-blue-600 p-1.5 md:p-2">
              <svg
                className="h-4 w-4 md:h-5 md:w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-gray-100">Learn More</p>
              <p className="text-xs md:text-sm text-gray-400">
                Navigate through the menu to explore more
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Usage Section Page
function UsagePage() {
  return (
    <DemoPage path="/usage">
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-3 md:mb-6 text-2xl md:text-4xl">🚀</div>

        <h1 className="mb-3 md:mb-4 text-xl md:text-3xl font-bold text-gray-100">How to Use</h1>

        <p className="mb-4 md:mb-6 text-sm md:text-lg text-gray-400">
          Apply scroll transitions with simple configuration.
        </p>

        <div className="space-y-3">
          {[
            "Set defaultTransition",
            "Per-route customization",
            "Utilize symmetric option",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-300">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 md:mt-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 md:p-6 border border-gray-600">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="rounded-full bg-blue-600 p-1.5 md:p-2">
              <svg
                className="h-4 w-4 md:h-5 md:w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-gray-100">Apply Now</p>
              <p className="text-xs md:text-sm text-gray-400">
                Use the navigation menu to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Examples Section Page
function ExamplesPage() {
  return (
    <DemoPage path="/examples">
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <div className="mb-3 md:mb-6 text-2xl md:text-4xl">💡</div>

        <h1 className="mb-3 md:mb-4 text-xl md:text-3xl font-bold text-gray-100">
          Real-world Examples
        </h1>

        <p className="mb-4 md:mb-6 text-sm md:text-lg text-gray-400">
          See how scroll transitions work in various scenarios.
        </p>

        <div className="space-y-3">
          {[
            "List → Detail pages",
            "Hierarchical navigation",
            "Modals and overlays",
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-300">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 md:mt-8 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-4 md:p-6 border border-gray-600">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="rounded-full bg-blue-600 p-1.5 md:p-2">
              <svg
                className="h-4 w-4 md:h-5 md:w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm md:text-base font-medium text-gray-100">Resources</p>
              <p className="text-xs md:text-sm text-gray-400">
                Continue exploring with the navigation menu
              </p>
            </div>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration with sidebar navigation
const scrollRoutes: RouteConfig[] = [
  { path: "/intro", component: IntroPage, label: "📝 Introduction" },
  { path: "/features", component: FeaturesPage, label: "✨ Features" },
  { path: "/usage", component: UsagePage, label: "🚀 Usage" },
  { path: "/examples", component: ExamplesPage, label: "💡 Examples" },
];

// Custom layout with sidebar navigation
function ScrollLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentPath, navigate } = useBrowserNavigation();

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative bg-gray-900 h-full overflow-hidden">
      {/* Toggle Button - Mobile only */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden absolute top-2 left-2 z-50 p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="md:hidden absolute inset-0 bg-black bg-opacity-30 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <nav
          className={`
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 absolute md:relative top-0 left-0 h-full z-40
            w-48 bg-gray-800 border-r border-gray-700 p-2 md:p-4
            transform transition-transform duration-300 ease-in-out
            md:h-screen overflow-y-auto flex-shrink-0
          `}
        >
          <h3 className="mb-3 text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider px-2">
            Contents
          </h3>
          <ul className="space-y-0.5 md:space-y-1">
            {scrollRoutes.map((route) => {
              const isActive = currentPath === route.path;
              return (
                <li key={route.path}>
                  <button
                    onClick={() => handleNavigation(route.path)}
                    className={`
                      w-full rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-left text-xs md:text-sm transition-all
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                  >
                    {route.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-gray-900 overflow-x-hidden overflow-y-hidden">
          <div className="md:ml-0 pt-10 md:pt-0 relative z-0 h-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ScrollDemo() {
  // Create middleware to determine scroll direction based on route order
  const createScrollMiddleware = () => {
    const routeOrder = scrollRoutes.map((r) => r.path);

    return (from: string, to: string) => {
      const fromIndex = routeOrder.indexOf(from);
      const toIndex = routeOrder.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1) {
        if (fromIndex < toIndex) {
          // Going forward (down the list)
          return { from: "/nav/previous", to: "/nav/next" };
        } else {
          // Going backward (up the list)
          return { from: "/nav/next", to: "/nav/previous" };
        }
      }

      return { from, to };
    };
  };

  const config = {
    transitions: [
      {
        from: "/nav/previous",
        to: "/nav/next",
        transition: scroll({
          direction: "up",
        }),
      },
      {
        from: "/nav/next",
        to: "/nav/previous",
        transition: scroll({
          direction: "down",
        }),
      },
    ],
    middleware: createScrollMiddleware(),
  };

  return (
    <BrowserMockup
      routes={scrollRoutes}
      config={config}
      layout={ScrollLayout}
    />
  );
}
