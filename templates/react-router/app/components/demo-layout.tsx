import React from "react";
import { useLocation } from "react-router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiFramework,
} from "@ssgoi/react";
import { ssgoiConfig } from "./ssgoi-config";

const framework: SsgoiFramework = { useRoute: () => useLocation() };

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
