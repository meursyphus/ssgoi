"use client";

import React from "react";
import { BrowserMockup } from "../../browser-mockup";
import { swapRoutes } from "./routes";
import { swapConfig } from "./config";
import { DemoLayout } from "./layout";

// Import generated Sandpack files
import { swapdemoFiles, ssgoiLocalPackages } from "../../demo-templates";

export function SwapDemo() {
  // Merge demo files with SSGOI packages
  const sandpackFiles = {
    ...swapdemoFiles,
    ...ssgoiLocalPackages,
  };

  return (
    <BrowserMockup
      routes={swapRoutes}
      config={swapConfig}
      layout={DemoLayout}
      initialPath="/home"
      deviceType="mobile"
      useSandpack={true}
      sandpackFiles={sandpackFiles}
    />
  );
}

// Non-Sandpack version for comparison/fallback
export function SwapDemoLegacy() {
  return (
    <BrowserMockup
      routes={swapRoutes}
      config={swapConfig}
      layout={DemoLayout}
      initialPath="/home"
      deviceType="mobile"
      useSandpack={false}
    />
  );
}
