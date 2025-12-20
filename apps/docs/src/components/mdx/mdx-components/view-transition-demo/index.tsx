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
const InstagramDemo = lazy(() =>
  import("./instagram-demo").then((m) => ({ default: m.InstagramDemo })),
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
const RotateDemo = lazy(() =>
  import("./rotate-demo").then((m) => ({ default: m.RotateDemo })),
);
const SheetDemo = lazy(() =>
  import("./sheet-demo").then((m) => ({ default: m.SheetDemo })),
);
const FilmDemo = lazy(() =>
  import("./film-demo").then((m) => ({ default: m.FilmDemo })),
);
const DepthDemo = lazy(() =>
  import("./depth-demo").then((m) => ({ default: m.DepthDemo })),
);

export interface ViewTransitionDemoProps {
  type:
    | "fade"
    | "hero"
    | "pinterest"
    | "instagram"
    | "scroll"
    | "drill"
    | "slide"
    | "blind"
    | "strip"
    | "jaemin"
    | "rotate"
    | "sheet"
    | "film"
    | "depth";
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
      case "instagram":
        return <InstagramDemo />;
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
      case "rotate":
        return <RotateDemo />;
      case "sheet":
        return <SheetDemo />;
      case "film":
        return <FilmDemo />;
      case "depth":
        return <DepthDemo />;
      default:
        return null;
    }
  };

  return <Suspense fallback={<DemoLoading />}>{renderDemo()}</Suspense>;
}

export default ViewTransitionDemo;
