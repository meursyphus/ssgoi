"use client";

import React, { lazy, Suspense } from "react";

// Dynamic imports for code splitting
const FadeDemo = lazy(() => import("./fade-demo").then(m => ({ default: m.FadeDemo })));
const ScrollDemo = lazy(() => import("./scroll-demo").then(m => ({ default: m.ScrollDemo })));
const HeroDemo = lazy(() => import("./hero-demo").then(m => ({ default: m.HeroDemo })));
const PinterestDemo = lazy(() => import("./pinterest-demo").then(m => ({ default: m.PinterestDemo })));

export interface ViewTransitionDemoProps {
  type: "fade" | "hero" | "pinterest" | "slide" | "scale" | "blur" | "scroll";
}

// Loading component
function DemoLoading() {
  return (
    <div className="flex items-center justify-center h-[500px] bg-gray-900 rounded-lg">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        <p className="mt-4 text-gray-400 text-sm">Loading demo...</p>
      </div>
    </div>
  );
}

export function ViewTransitionDemo({ type }: ViewTransitionDemoProps) {
  const renderDemo = () => {
    switch (type) {
      case "fade":
        return <FadeDemo />;
      case "scroll":
        return <ScrollDemo />;
      case "hero":
        return <HeroDemo />;
      case "pinterest":
        return <PinterestDemo />;
      // TODO: Add other transition types
      case "slide":
      case "scale":
      case "blur":
        return (
          <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400">
              {type} transition demo coming soon...
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<DemoLoading />}>
      {renderDemo()}
    </Suspense>
  );
}