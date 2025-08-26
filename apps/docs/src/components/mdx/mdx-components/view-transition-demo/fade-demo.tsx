"use client";

import React from "react";
import { fade } from "@ssgoi/react/view-transitions";
import { BrowserMockup, DemoPage, DemoLayout } from "../browser-mockup";
import type { RouteConfig } from "../browser-mockup";
import { cn } from "../../../../lib/utils";
import { useMobile } from "../../../../lib/use-mobile";

// Home Page - SSGOI Introduction
function HomePage() {
  const isMobile = useMobile();
  
  return (
    <DemoPage
      path="/"
      title=""
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div className={cn(
        "mx-auto",
        isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12 sm:py-20"
      )}>
        <div className="text-center space-y-6">
          <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
            <span className="text-blue-400 text-sm font-semibold">
              SMOOTH TRANSITIONS
            </span>
          </div>
          <h1 className={cn(
            "font-bold text-white",
            isMobile ? "text-2xl" : "text-4xl sm:text-6xl"
          )}>
            Welcome to{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SSGOI
            </span>
          </h1>
          <p className={cn(
            "text-gray-300 max-w-2xl mx-auto",
            isMobile ? "text-base" : "text-xl sm:text-2xl"
          )}>
            Native app-like page transitions for the web. Transform your static pages into smooth, delightful experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              View Docs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Works Everywhere</h3>
            <p className="text-gray-400 text-sm">
              Unlike View Transition API, works in all modern browsers
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">SSR Ready</h3>
            <p className="text-gray-400 text-sm">
              Perfect with Next.js, Nuxt, SvelteKit. SEO-friendly
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">Any Router</h3>
            <p className="text-gray-400 text-sm">
              Keep your existing routing solution
            </p>
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
      path="/features"
      title=""
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div className={cn(
        "mx-auto",
        isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12"
      )}>
        <h1 className={cn(
          "font-bold text-white mb-8",
          isMobile ? "text-2xl" : "text-4xl"
        )}>Features</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎨 Built-in Transitions
            </h2>
            <p className="text-gray-300 mb-4">
              Choose from a variety of pre-built transitions or create your own.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['fade', 'slide', 'scale', 'hero', 'pinterest', 'ripple'].map(transition => (
                <div key={transition} className="bg-gray-700 px-3 py-2 rounded text-center text-sm text-gray-300">
                  {transition}()
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              ⚙️ Route-based Config
            </h2>
            <p className="text-gray-300 mb-4">
              Define different transitions for different routes with wildcards support.
            </p>
            <pre className="bg-gray-900 p-4 rounded text-xs overflow-x-auto">
              <code className="text-gray-300">{`{
  from: '/products',
  to: '/products/*',
  transition: scale()
}`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              💾 State Persistence
            </h2>
            <p className="text-gray-300">
              Animation state persists during navigation, even with browser back/forward buttons.
              No jarring jumps or broken animations.
            </p>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Examples Page
function ExamplesPage() {
  const isMobile = useMobile();
  
  const examples = [
    {
      title: "E-Commerce",
      description: "Product gallery with smooth transitions",
      icon: "🛍️",
      transitions: ["scale", "hero", "fade"],
    },
    {
      title: "Dashboard",
      description: "Analytics with slide transitions",
      icon: "📊",
      transitions: ["slide", "fade"],
    },
    {
      title: "Blog",
      description: "Article navigation with fade effects",
      icon: "📝",
      transitions: ["fade", "slide"],
    },
    {
      title: "Portfolio",
      description: "Image gallery with pinterest effect",
      icon: "🎨",
      transitions: ["pinterest", "hero", "scale"],
    },
  ];

  return (
    <DemoPage
      path="/examples"
      title=""
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div className={cn(
        "mx-auto",
        isMobile ? "px-3 py-6" : "max-w-6xl px-4 py-12"
      )}>
        <h1 className={cn(
          "font-bold text-white mb-8",
          isMobile ? "text-2xl" : "text-4xl"
        )}>Examples</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-5xl">
                {example.icon}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {example.title}
                </h3>
                <p className="text-gray-400 mb-4">{example.description}</p>
                <div className="flex flex-wrap gap-2">
                  {example.transitions.map((transition) => (
                    <span
                      key={transition}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {transition}()
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DemoPage>
  );
}

// Getting Started Page
function GettingStartedPage() {
  const isMobile = useMobile();
  
  return (
    <DemoPage
      path="/start"
      title=""
      className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-full"
    >
      <div className={cn(
        "mx-auto",
        isMobile ? "px-3 py-6" : "max-w-4xl px-4 py-12"
      )}>
        <h1 className={cn(
          "font-bold text-white mb-8",
          isMobile ? "text-2xl" : "text-4xl"
        )}>Get Started</h1>
        
        <div className="space-y-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Install SSGOI
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`npm install @ssgoi/react`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Wrap Your App
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`import { Ssgoi } from '@ssgoi/react';
import { fade } from '@ssgoi/react/view-transitions';

export default function App() {
  return (
    <Ssgoi config={{ defaultTransition: fade() }}>
      {/* Your app */}
    </Ssgoi>
  );
}`}</code>
            </pre>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              3. Add Transitions to Pages
            </h2>
            <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
              <code className="text-gray-300 text-sm">{`import { SsgoiTransition } from '@ssgoi/react';

export default function HomePage() {
  return (
    <SsgoiTransition id="/">
      <h1>Welcome</h1>
    </SsgoiTransition>
  );
}`}</code>
            </pre>
          </div>

          <div className="text-center pt-8">
            <a
              href="https://ssgoi.dev"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Full Documentation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </DemoPage>
  );
}

// Route configuration
const fadeRoutes: RouteConfig[] = [
  { path: "/", component: HomePage, label: "Home" },
  { path: "/features", component: FeaturesPage, label: "Features" },
  { path: "/examples", component: ExamplesPage, label: "Examples" },
  { path: "/start", component: GettingStartedPage, label: "Start" },
];

// Header Actions Component
function HeaderActions() {
  return (
    <>
      <a 
        href="https://github.com/meursyphus/ssgoi" 
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      </a>
      <a 
        href="https://www.npmjs.com/package/@ssgoi/react"
        className="text-gray-300 hover:text-white transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/>
        </svg>
      </a>
    </>
  );
}

export function FadeDemo() {
  const config = {
    defaultTransition: fade(),
  };

  // Custom layout with SSGOI branding
  function SSGOILayout({ children }: { children: React.ReactNode }) {
    return (
      <DemoLayout
        logo="⚡"
        title="SSGOI"
        headerActions={<HeaderActions />}
      >
        {children}
      </DemoLayout>
    );
  }

  return (
    <BrowserMockup
      routes={fadeRoutes}
      config={config}
      layout={SSGOILayout}
    />
  );
}