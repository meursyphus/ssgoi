"use client";

import React from "react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiFramework,
} from "@ssgoi/react";
import { ssgoiConfig } from "./ssgoi-config";

const INTERCEPTION_PREFIX = /^(?:\(\.\.\.\)|\(\.\.\)|\(\.\))+/;

const framework: SsgoiFramework = {
  useRoute: () => {
    const pathname = usePathname();
    // The page the children slot renders. During a soft intercept it is still
    // the background page, so no background boundary moves.
    const segments = useSelectedLayoutSegments();
    if (pathname == null) return null;
    const renderedPath = `/${segments
      .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
      .map((segment) => segment.replace(INTERCEPTION_PREFIX, ""))
      .filter(Boolean)
      .join("/")}`;
    return { pathname, renderedPath };
  },
};

interface DemoLayoutProps {
  children: React.ReactNode;
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  return (
    <div className="h-full bg-[#121212] flex z-0">
      {/* Mobile Frame */}
      <div className="w-full bg-[#121212] flex flex-col overflow-hidden relative">
        {/* Main Content Area */}
        <main
          id="demo-content"
          className="relative z-0 flex-1 w-full overflow-y-scroll overflow-x-clip bg-[#121212] scrollbar-hide"
        >
          <Ssgoi config={ssgoiConfig} framework={framework}>
            {/* Depth 0: top-level tabs <-> detail pages */}
            <SsgoiLayoutBoundary className="min-h-full flex flex-col bg-[#121212]">
              {children}
            </SsgoiLayoutBoundary>
          </Ssgoi>
        </main>
      </div>
    </div>
  );
}
