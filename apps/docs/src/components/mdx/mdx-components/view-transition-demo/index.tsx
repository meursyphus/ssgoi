"use client";

import React, { lazy, Suspense } from "react";

// Dynamic imports for code splitting
const FadeDemo = lazy(() =>
  import("./fade-demo").then((m) => ({ default: m.FadeDemo }))
);
const ScrollDemo = lazy(() =>
  import("./scroll-demo").then((m) => ({ default: m.ScrollDemo }))
);
const HeroDemo = lazy(() =>
  import("./hero-demo").then((m) => ({ default: m.HeroDemo }))
);
const PinterestDemo = lazy(() =>
  import("./pinterest-demo").then((m) => ({ default: m.PinterestDemo }))
);

const DrillDemo = lazy(() =>
  import("./drill-demo").then((m) => ({ default: m.DrillDemo }))
);

const SlideDemo = lazy(() =>
  import("./slide-demo").then((m) => ({ default: m.SlideDemo }))
);
const CurtainDemo = lazy(() =>
  import("./curtain-demo").then((m) => ({ default: m.CurtainDemo }))
);

export interface ViewTransitionDemoProps {
  type: "fade" | "hero" | "pinterest" | "scroll" | "drill" | "slide" | "curtain";
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
      case "drill":
        return <DrillDemo />;
      case "slide":
        return <SlideDemo />;
      case "curtain":
        return <CurtainDemo />;
      default:
        return null;
    }
  };

  return <Suspense fallback={<DemoLoading />}>{renderDemo()}</Suspense>;
}
