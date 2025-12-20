"use client";

import React from "react";
import { BrowserMockup } from "../../browser-mockup";
import { depthRoutes } from "./routes";
import { depthConfig } from "./config";
import { DemoLayout } from "./layout";

// Import generated Sandpack files
import { depthdemoFiles, ssgoiLocalPackages } from "../../demo-templates";

export function DepthDemo() {
  // Merge demo files with SSGOI packages
  const sandpackFiles = {
    ...depthdemoFiles,
    ...ssgoiLocalPackages,
  };

  return (
    <BrowserMockup
      routes={depthRoutes}
      config={depthConfig}
      layout={DemoLayout}
      initialPath="/home"
      deviceType="mobile"
      useSandpack={true}
      sandpackFiles={sandpackFiles}
    />
  );
}

// Non-Sandpack version for comparison/fallback
export function DepthDemoLegacy() {
  return (
    <BrowserMockup
      routes={depthRoutes}
      config={depthConfig}
      layout={DemoLayout}
      initialPath="/home"
      deviceType="mobile"
      useSandpack={false}
    />
  );
}
