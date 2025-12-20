"use client";

import React, { memo } from "react";
import { TransitionScope } from "@ssgoi/react";
import { useBrowserNavigation } from "../../browser-mockup";

// Demo Layout Component for Swap demo with bottom navigation

interface DemoLayoutProps {
  children: React.ReactNode;
}

export const DemoLayout = memo(({ children }: DemoLayoutProps) => {
  const { navigate, currentPath } = useBrowserNavigation();

  const navItems = [
    { path: "/home", icon: "🏠", label: "Home" },
    { path: "/search", icon: "🔍", label: "Search" },
    { path: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <div className="z-0">
      <TransitionScope>
        {children}

        {/* Fixed Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-[9000]">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </TransitionScope>
    </div>
  );
});

DemoLayout.displayName = "SwapDemoLayout";
