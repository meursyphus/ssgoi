"use client";

import React, { memo } from "react";
import { TransitionScope } from "@ssgoi/react";

// Demo Layout Component for Depth demo

interface DemoLayoutProps {
  children: React.ReactNode;
}

export const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  return (
    <div className="overflow-x-clip overflow-y-scroll relative h-screen z-0">
      <TransitionScope>{children}</TransitionScope>
    </div>
  );
});

DemoLayout.displayName = "DepthDemoLayout";
