import React from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiFramework,
} from "@ssgoi/react";
import { ssgoiConfig } from "./ssgoi-config";

// Key by the leaf match the outlet renders, not location (location moves
// before pending matches render; index routes match "/parent/").
const framework: SsgoiFramework = {
  useRoute: () => ({
    pathname: useRouterState({
      select: (state) => {
        const location = state.location.pathname;
        const leaf = state.matches.at(-1)?.pathname;
        if (!leaf) return location;
        return leaf.length > 1 && leaf.endsWith("/") && !location.endsWith("/")
          ? leaf.slice(0, -1)
          : leaf;
      },
    }),
  }),
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
