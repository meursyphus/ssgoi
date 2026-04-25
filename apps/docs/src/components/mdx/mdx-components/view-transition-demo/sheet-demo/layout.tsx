"use client";

import React, { memo } from "react";
import { TransitionScope } from "@ssgoi/react";

// Demo Layout Component for Sheet demo
interface DemoLayoutProps {
  children: React.ReactNode;
}

export const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  return (
    <div className="overflow-x-clip relative z-0">
      <TransitionScope>{children}</TransitionScope>
    </div>
  );
});

DemoLayout.displayName = "SheetDemoLayout";
