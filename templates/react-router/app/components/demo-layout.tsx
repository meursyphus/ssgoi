import React, { useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router";
import { Ssgoi } from "@ssgoi/react";
import {
  drill,
  pinterest,
  instagram,
} from "@ssgoi/react/view-transitions";

interface DemoLayoutProps {
  children: React.ReactNode;
}

export default function DemoLayout({ children }: DemoLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const previousPath = useRef(pathname);

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
    const savedPosition = scrollPositions.current[pathname] || 0;

    if (mainRef.current) {
      mainRef.current.scrollTop = savedPosition;
    }

    previousPath.current = pathname;
  }, [pathname]);

  const config = useMemo(
    () => ({
      transitions: [
        // Pinterest transitions
        {
          from: "/pinterest/*",
          to: "/pinterest",
          transition: pinterest(),
          symmetric: true,
        },
        // Posts transitions - drill effect
        {
          from: "/posts",
          to: "/posts/*",
          transition: drill({ direction: "enter" }),
        },
        {
          from: "/posts/*",
          to: "/posts",
          transition: drill({ direction: "exit" }),
        },
        // Profile transitions - instagram
        {
          from: "/profile",
          to: "/profile/*",
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
          className="flex-1 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] scrollbar-hide"
        >
          <Ssgoi config={config}>{children}</Ssgoi>
        </main>

        {/* Bottom Navigation */}
        <nav className="flex justify-around items-center bg-[#121212] border-t border-white/5 py-2 flex-shrink-0">
          <NavItem
            href="/posts"
            label="Posts"
            isActive={pathname.startsWith("/posts")}
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
            href="/products"
            label="Shop"
            isActive={pathname.startsWith("/products")}
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
            href="/pinterest"
            label="Gallery"
            isActive={pathname.startsWith("/pinterest")}
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
            href="/profile"
            label="Profile"
            isActive={pathname.startsWith("/profile")}
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
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

function NavItem({ href, label, icon, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={`flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 ${
        isActive ? "text-white" : "text-neutral-500 hover:text-neutral-400"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
