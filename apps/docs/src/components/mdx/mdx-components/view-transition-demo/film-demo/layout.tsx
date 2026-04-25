"use client";

import React, { memo } from "react";

// Demo Layout Component - No header, just content
interface DemoLayoutProps {
  children: React.ReactNode;
}

export const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  return (
    <div className="overflow-x-clip overflow-y-scroll relative h-screen z-0 bg-black">
      {children}
    </div>
  );
});

DemoLayout.displayName = "FilmDemoLayout";
