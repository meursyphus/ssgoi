"use client";

import React, { memo, useState, useEffect } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { cn } from "../../../lib/utils";

// Browser header component - ultra thin (copied from browser-mockup.tsx)
const BrowserHeader = memo(({ currentPath }: { currentPath: string }) => {
  return (
    <div className="browser-header bg-neutral-900/80 border-b border-white/5 px-3 py-1.5 flex items-center gap-2">
      {/* Traffic lights - tiny */}
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-white/10" />
        <div className="w-2 h-2 rounded-full bg-white/10" />
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>

      {/* Address bar - compact */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/[0.03] border border-white/5 rounded px-2.5 py-0.5 text-[10px] text-neutral-400 flex items-center gap-1.5 max-w-[200px]">
          <svg
            className="w-2.5 h-2.5 text-neutral-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="truncate">
            <span className="text-neutral-500">ssgoi.dev</span>
            <span className="text-neutral-300">{currentPath}</span>
          </span>
        </div>
      </div>

      {/* Spacer for balance */}
      <div className="w-[52px]" />
    </div>
  );
});

BrowserHeader.displayName = "BrowserHeader";

// Mobile header component - iPhone style with dynamic island
const MobileHeader = memo(({ currentPath }: { currentPath: string }) => {
  return (
    <div className="mobile-header bg-neutral-900/95 relative">
      {/* Dynamic Island / Notch */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-28 h-7 bg-black rounded-full border border-white/10 flex items-center justify-center gap-3 px-3">
          {/* Camera */}
          <div className="w-2 h-2 rounded-full bg-neutral-800 ring-1 ring-white/20" />
          {/* Spacer */}
          <div className="flex-1" />
          {/* Face ID dots */}
          <div className="flex gap-0.5">
            <div className="w-0.5 h-0.5 rounded-full bg-red-500/60" />
            <div className="w-0.5 h-0.5 rounded-full bg-red-500/40" />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1">
        {/* Time */}
        <div className="text-[11px] font-medium text-white/90">9:41</div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {/* Signal */}
          <div className="flex items-end gap-[1px]">
            <div className="w-0.5 h-1.5 bg-white/90 rounded-full" />
            <div className="w-0.5 h-2 bg-white/90 rounded-full" />
            <div className="w-0.5 h-2.5 bg-white/90 rounded-full" />
            <div className="w-0.5 h-3 bg-white/90 rounded-full" />
          </div>
          {/* WiFi */}
          <svg
            className="w-3.5 h-3.5 text-white/90"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0-4c1.66 0 3.16.64 4.29 1.68l1.42-1.42C16.08 12.63 14.13 12 12 12s-4.08.63-5.71 2.26l1.42 1.42C8.84 14.64 10.34 14 12 14zm0-4c2.76 0 5.26 1.12 7.07 2.93l1.42-1.42C18.28 9.3 15.26 8 12 8s-6.28 1.3-8.49 3.51l1.42 1.42C6.74 11.12 9.24 10 12 10z" />
          </svg>
          {/* Battery */}
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-2.5 border border-white/90 rounded-sm relative">
              <div className="absolute inset-0.5 bg-white/90 rounded-[1px]" />
            </div>
            <div className="w-0.5 h-1.5 bg-white/90 rounded-r-sm" />
          </div>
        </div>
      </div>

      {/* Address bar */}
      <div className="px-3 pb-2">
        <div className="bg-neutral-800/80 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-neutral-400 flex items-center gap-2">
          <svg
            className="w-3 h-3 text-neutral-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="truncate flex-1">
            <span className="text-neutral-500">ssgoi.dev</span>
            <span className="text-neutral-300">{currentPath}</span>
          </span>
          <svg
            className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      </div>
    </div>
  );
});

MobileHeader.displayName = "MobileHeader";

export interface SandpackBrowserMockupProps {
  /** Files to pass to Sandpack (e.g., { "/App.tsx": "..." }) */
  files: Record<string, string>;
  /** Additional dependencies (optional, can include local dist files) */
  dependencies?: Record<string, string>;
  /** Device type for display */
  deviceType?: "desktop" | "mobile";
  /** Initial path to show in address bar */
  initialPath?: string;
  /** Additional class names */
  className?: string;
  /** External resources (CSS CDNs, etc.) */
  externalResources?: string[];
}

export function SandpackBrowserMockup({
  files,
  dependencies = {},
  deviceType = "desktop",
  initialPath = "/",
  className,
  externalResources = [],
}: SandpackBrowserMockupProps) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const isMobile = deviceType === "mobile";

  // Listen for navigation updates from iframe via postMessage
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "SSGOI_NAVIGATION") {
        setCurrentPath(e.data.path);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      className={cn(
        "browser-mockup overflow-hidden bg-white/[0.02] relative flex flex-col",
        isMobile
          ? "w-[375px] mx-auto rounded-[3rem] border-[14px] border-neutral-900 h-[667px] shadow-2xl shadow-black/50"
          : "w-full rounded-xl border border-white/10 h-[500px] md:h-[800px]",
        className,
      )}
    >
      {/* Header - Desktop or Mobile */}
      {isMobile ? (
        <MobileHeader currentPath={currentPath} />
      ) : (
        <BrowserHeader currentPath={currentPath} />
      )}

      {/* Sandpack Preview - renders in iframe */}
      <div className="flex-1 min-h-0 overflow-hidden bg-[#121212] sandpack-container">
        <style>{`
          .sandpack-container {
            display: flex;
            flex-direction: column;
          }
          .sandpack-container .sp-wrapper {
            flex: 1;
            min-height: 0;
            display: flex;
            flex-direction: column;
          }
          .sandpack-container .sp-layout {
            flex: 1 !important;
            min-height: 0 !important;
            height: 100% !important;
            border: none !important;
            border-radius: 0 !important;
          }
          .sandpack-container .sp-stack {
            height: 100% !important;
          }
          .sandpack-container .sp-preview {
            height: 100% !important;
            flex: 1 !important;
          }
          .sandpack-container .sp-preview-container {
            height: 100% !important;
          }
          .sandpack-container .sp-preview-iframe {
            height: 100% !important;
          }
          .sandpack-container iframe {
            height: 100% !important;
          }
        `}</style>
        <SandpackProvider
          template="react-ts"
          files={files}
          customSetup={{
            dependencies:
              Object.keys(dependencies).length > 0 ? dependencies : undefined,
          }}
          options={{
            externalResources: [
              // Tailwind CDN
              "https://cdn.tailwindcss.com",
              ...externalResources,
            ],
          }}
          theme="dark"
        >
          <SandpackLayout style={{ height: "100%", flex: 1 }}>
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
              style={{ height: "100%", flex: 1 }}
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>

      {/* iPhone Home Indicator */}
      {isMobile && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
      )}
    </div>
  );
}

export default SandpackBrowserMockup;
