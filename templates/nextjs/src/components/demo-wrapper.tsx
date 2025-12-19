"use client";

import React, { Suspense } from "react";
import DemoLayout from "./demo-layout";

export default function DemoWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100svh] md:h-screen grow flex items-center justify-center bg-[#121212] md:pt-20 relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neutral-800/50 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neutral-700/30 rounded-full blur-[150px]" />
      </div>

      {/* Main content - iPhone frame */}
      <div
        className={`
          w-full h-full
          lg:w-[390px] lg:h-[844px]
          lg:rounded-[2.5rem]
          overflow-hidden
          lg:border lg:border-white/10
          lg:shadow-2xl lg:shadow-black/50
          relative z-10
          bg-[#121212]
        `}
      >
        {/* Notch for desktop */}
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50" />
        <Suspense fallback={<div className="h-full bg-[#121212]" />}>
          <DemoLayout>{children}</DemoLayout>
        </Suspense>
      </div>
    </div>
  );
}
