"use client";

import React, { lazy, Suspense } from "react";

// Dynamic imports for code splitting
const FadeDemo = lazy(() =>
  import("./fade-demo").then((m) => ({ default: m.FadeDemo })),
);
const ScrollDemo = lazy(() =>
  import("./scroll-demo").then((m) => ({ default: m.ScrollDemo })),
);
const HeroDemo = lazy(() =>
  import("./hero-demo").then((m) => ({ default: m.HeroDemo })),
);
const PinterestDemo = lazy(() =>
  import("./pinterest-demo").then((m) => ({ default: m.PinterestDemo })),
);

const DrillDemo = lazy(() =>
  import("./drill-demo").then((m) => ({ default: m.DrillDemo })),
);

const SlideDemo = lazy(() =>
  import("./slide-demo").then((m) => ({ default: m.SlideDemo })),
);
const BlindDemo = lazy(() =>
  import("./blind-demo").then((m) => ({ default: m.BlindDemo })),
);
const StripDemo = lazy(() =>
  import("./strip-demo").then((m) => ({ default: m.StripDemo })),
);
const JaeminDemo = lazy(() =>
  import("./jaemin-demo").then((m) => ({ default: m.JaeminDemo })),
);
const DimmDemo = lazy(() =>
  import("./dimm-demo").then((m) => ({ default: m.DimmDemo })),
                      

export interface ViewTransitionDemoProps {
  type:
    | "fade"
    | "hero"
    | "pinterest"
    | "scroll"
    | "drill"
    | "slide"
    | "blind"
    | "strip"
    | "dimm";
    | "jaemin";
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
      case "blind":
        return <BlindDemo />;
      case "strip":
        return <StripDemo />;
      case "jaemin":
        return <JaeminDemo />;
      case "dimm":
        return <DimmDemo />;
      default:
        return null;
    }
  };

  return <Suspense fallback={<DemoLoading />}>{renderDemo()}</Suspense>;
}

export default ViewTransitionDemo;
