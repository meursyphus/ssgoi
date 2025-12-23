"use client";

import React, { useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { useDemoRouter } from "./router-provider";
import { Ssgoi, SsgoiConfig } from "@ssgoi/react";
import {
  drill,
  hero,
  pinterest,
  instagram,
  snap,
  swap,
} from "@ssgoi/react/view-transitions";
import styles from "./layout.module.css";

/**
 * Generate snap transitions for ordered tabs
 * @param tabs - Array of tab paths in order (left to right)
 * @returns Array of transition configs with correct direction
 */
function createSnapTransitions(tabs: string[]): SsgoiConfig["transitions"] {
  const transitions: SsgoiConfig["transitions"] = [];
  for (let i = 0; i < tabs.length; i++) {
    for (let j = 0; j < tabs.length; j++) {
      if (i !== j) {
        // Moving to higher index = left (enters from right)
        // Moving to lower index = right (enters from left)
        const direction = j > i ? "left" : "right";
        transitions.push({
          from: tabs[i],
          to: tabs[j],
          transition: snap({ direction }),
        });
      }
    }
  }
  return transitions;
}

// Tab order for snap transitions
const TAB_ORDER = [
  "/demo/posts",
  "/demo/products",
  "/demo/pinterest",
  "/demo/profile",
];

interface DemoLayoutProps {
  children: React.ReactNode;
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  const router = useDemoRouter();
  const currentPath = router.currentPath || "";
  const pathRef = useRef(currentPath);
  pathRef.current = currentPath;
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const previousPath = useRef(currentPath);

  // Prefetch main pages on mount
  useEffect(() => {
    router.prefetch("/demo/posts");
    router.prefetch("/demo/products");
    router.prefetch("/demo/pinterest");
    router.prefetch("/demo/profile");
  }, [router]);

  useEffect(() => {
    if (!mainRef.current) return;

    const handleScroll = () => {
      if (!mainRef.current) return;
      scrollPositions.current[pathRef.current] = mainRef.current.scrollTop;
    };

    const element = mainRef.current;
    element.addEventListener("scroll", handleScroll);
    return () => {
      element?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Restore scroll position when path changes
  useLayoutEffect(() => {
    if (!mainRef.current) return;
    const savedPosition = scrollPositions.current[currentPath] || 0;

    if (mainRef.current) {
      mainRef.current.scrollTop = savedPosition;
    }

    previousPath.current = currentPath;
  }, [currentPath]);

  const config = useMemo(
    () => ({
      transitions: [
        // Top-level tab snap transitions
        ...createSnapTransitions(TAB_ORDER),
        // Pinterest transitions
        {
          from: "/demo/pinterest/*",
          to: "/demo/pinterest",
          transition: pinterest(),
          symmetric: true,
        },
        // Products transitions - hero
        {
          from: "/demo/products",
          to: "/demo/products/*",
          transition: hero(),
          symmetric: true,
        },
        // Posts transitions - drill effect
        {
          from: "/demo/posts",
          to: "/demo/posts/*",
          transition: drill({ direction: "enter" }),
        },
        {
          from: "/demo/posts/*",
          to: "/demo/posts",
          transition: drill({ direction: "exit" }),
        },
        {
          from: "/demo/profile",
          to: "/demo/profile/*",
          transition: instagram(),
          symmetric: true,
        },
      ],
    }),
    [],
  );
  return (
    <div className="h-full bg-[#121212] flex z-0">
      {/* Mobile Frame */}
      <div className="w-full bg-[#121212] flex flex-col overflow-hidden relative">
        {/* Main Content Area */}
        <main
          ref={mainRef}
          id="demo-content"
          className={`flex-1 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] ${styles.scrollContainer}`}
        >
          <Ssgoi config={config}>{children}</Ssgoi>
        </main>

        {/* Bottom Navigation */}
        <nav className="flex justify-around items-center bg-[#121212] border-t border-white/5 py-2 flex-shrink-0">
          <NavItem
            label="Posts"
            onClick={() => router.goto("/demo/posts")}
            isActive={currentPath.startsWith("/demo/posts")}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            }
          />
          <NavItem
            label="Shop"
            onClick={() => router.goto("/demo/products")}
            isActive={currentPath.startsWith("/demo/products")}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            }
          />
          <NavItem
            label="Gallery"
            onClick={() => router.goto("/demo/pinterest")}
            isActive={currentPath.startsWith("/demo/pinterest")}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            }
          />
          <NavItem
            label="Profile"
            onClick={() => router.goto("/demo/profile")}
            isActive={currentPath.startsWith("/demo/profile")}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            }
          />
        </nav>
      </div>
    </div>
  );
}

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

function NavItem({ label, icon, onClick, isActive }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 ${
        isActive ? "text-white" : "text-neutral-500 hover:text-neutral-400"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </button>
  );
}
