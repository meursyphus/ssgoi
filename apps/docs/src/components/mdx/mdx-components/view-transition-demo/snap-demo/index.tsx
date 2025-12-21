"use client";

import React from "react";
import { BrowserMockup } from "../../browser-mockup";
import { snapRoutes } from "./routes";
import { snapConfig } from "./config";
import { DemoLayout } from "./layout";

// Import generated Sandpack files
import { snapdemoFiles, ssgoiLocalPackages } from "../../demo-templates";

export function SnapDemo() {
  // Merge demo files with SSGOI packages
  const sandpackFiles = {
    ...snapdemoFiles,
    ...ssgoiLocalPackages,
  };

  return (
    <BrowserMockup
      routes={snapRoutes}
      config={snapConfig}
      layout={DemoLayout}
      initialPath="/home"
      deviceType="mobile"
      useSandpack={true}
      sandpackFiles={sandpackFiles}
    />
  );
}

// Non-Sandpack version for comparison/fallback
export function SnapDemoLegacy() {
  return (
    <BrowserMockup
      routes={snapRoutes}
      config={snapConfig}
      layout={DemoLayout}
      initialPath="/home"
      deviceType="mobile"
      useSandpack={false}
    />
  );
}
