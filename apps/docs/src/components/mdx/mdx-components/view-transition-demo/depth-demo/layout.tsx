"use client";

import React, { memo } from "react";
import { TransitionScope } from "@ssgoi/react";

// Demo Layout Component for Depth demo

interface DemoLayoutProps {
  children: React.ReactNode;
}

export const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  return <TransitionScope>{children}</TransitionScope>;
});

DemoLayout.displayName = "DepthDemoLayout";
