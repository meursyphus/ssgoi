"use client";

import React, { memo } from "react";
import { TransitionScope } from "@ssgoi/react";
import { useBrowserNavigation } from "../../browser-mockup";

// Demo Layout Component for Snap demo with bottom navigation

interface DemoLayoutProps {
  children: React.ReactNode;
}

export const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  const { navigate, currentPath } = useBrowserNavigation();

  const navItems = [
    {
      path: "/home",
      label: "Home",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      path: "/search",
      label: "Search",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="z-0">
      <TransitionScope>
        {children}

        {/* Fixed Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 z-[9000]">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {item.icon}
                  <span className="text-[10px] mt-1 font-medium">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </TransitionScope>
    </div>
  );
});

DemoLayout.displayName = "SnapDemoLayout";
