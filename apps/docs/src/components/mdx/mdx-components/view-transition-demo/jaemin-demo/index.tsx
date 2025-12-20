"use client";

import React from "react";
import { BrowserMockup } from "../../browser-mockup";
import { jaeminRoutes } from "./routes";
import { jaeminConfig } from "./config";
import { DemoLayout } from "./layout";

// Import generated Sandpack files
import { jaemindemoFiles, ssgoiLocalPackages } from "../../demo-templates";

export function JaeminDemo() {
  // Merge demo files with SSGOI packages
  const sandpackFiles = {
    ...jaemindemoFiles,
    ...ssgoiLocalPackages,
  };

  return (
    <BrowserMockup
      routes={jaeminRoutes}
      config={jaeminConfig}
      layout={DemoLayout}
      useSandpack={true}
      sandpackFiles={sandpackFiles}
    />
  );
}

// Non-Sandpack version for comparison/fallback
export function JaeminDemoLegacy() {
  return (
    <BrowserMockup
      routes={jaeminRoutes}
      config={jaeminConfig}
      layout={DemoLayout}
      useSandpack={false}
    />
  );
}
