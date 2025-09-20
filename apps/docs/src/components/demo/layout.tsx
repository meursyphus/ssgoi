"use client";

import React, { useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { useDemoRouter } from "./router-provider";
import { Ssgoi, SsgoiConfig } from "@ssgoi/react";
import { drill, hero, pinterest, fade } from "@ssgoi/react/view-transitions";
import styles from "./layout.module.css";

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

  const config: SsgoiConfig = useMemo(
    () => ({
      defaultTransition: fade(),
      transitions: [
        // Pinterest transitions
        {
          from: "/demo/pinterest/*",
          to: "/demo/pinterest",
          transition: pinterest({ spring: { stiffness: 150, damping: 20 } }),
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
      ],
    }),
    [],
  );
  return (
    <div className="h-full bg-gray-900 flex z-0">
      {/* Mobile Frame */}
      <div className="w-full bg-black flex flex-col overflow-hidden relative">
        {/* Main Content Area */}
        <main
          ref={mainRef}
          id="demo-content"
          className={`flex-1 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-gray-950 ${styles.scrollContainer}`}
        >
          <Ssgoi config={config}>{children}</Ssgoi>
        </main>

        {/* Bottom Navigation */}
        <nav className="flex justify-around items-center bg-gray-950 border-t border-gray-800 py-2 flex-shrink-0">
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
        isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-300"
      }`}
    >
      <div className="w-6 h-6">{icon}</div>
      <span>{label}</span>
    </button>
  );
}
