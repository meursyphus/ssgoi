"use client";

import React from "react";
import { BrowserMockup } from "../../browser-mockup";
import { filmRoutes } from "./routes";
import { filmConfig } from "./config";
import { DemoLayout } from "./layout";

// Import generated Sandpack files
import { filmdemoFiles, ssgoiLocalPackages } from "../../demo-templates";

export function FilmDemo() {
  // Merge demo files with SSGOI packages
  const sandpackFiles = {
    ...filmdemoFiles,
    ...ssgoiLocalPackages,
  };

  return (
    <BrowserMockup
      routes={filmRoutes}
      config={filmConfig}
      layout={DemoLayout}
      useSandpack={true}
      sandpackFiles={sandpackFiles}
    />
  );
}

// Non-Sandpack version for comparison/fallback
export function FilmDemoLegacy() {
  return (
    <BrowserMockup
      routes={filmRoutes}
      config={filmConfig}
      layout={DemoLayout}
      useSandpack={false}
    />
  );
}
