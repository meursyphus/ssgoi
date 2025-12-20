"use client";

import React from "react";
import { BrowserMockup } from "../../browser-mockup";
import { sheetRoutes } from "./routes";
import { sheetConfig } from "./config";
import { DemoLayout } from "./layout";

// Import generated Sandpack files
import { sheetdemoFiles, ssgoiLocalPackages } from "../../demo-templates";

export function SheetDemo() {
  // Merge demo files with SSGOI packages
  const sandpackFiles = {
    ...sheetdemoFiles,
    ...ssgoiLocalPackages,
  };

  return (
    <BrowserMockup
      routes={sheetRoutes}
      config={sheetConfig}
      layout={DemoLayout}
      initialPath="/sent"
      deviceType="mobile"
      useSandpack={true}
      sandpackFiles={sandpackFiles}
    />
  );
}

// Non-Sandpack version for comparison/fallback
export function SheetDemoLegacy() {
  return (
    <BrowserMockup
      routes={sheetRoutes}
      config={sheetConfig}
      layout={DemoLayout}
      initialPath="/sent"
      deviceType="mobile"
      useSandpack={false}
    />
  );
}
