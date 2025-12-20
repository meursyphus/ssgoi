/**
 * Sandpack Helpers
 *
 * This file contains helper code that will be included in Sandpack templates.
 * It provides the same API as browser-mockup.tsx but works standalone in Sandpack.
 */

export const SANDPACK_HELPERS_CODE = `
// ============================================
// Sandpack Helpers - Auto-generated
// Provides browser-mockup compatible API for Sandpack
// ============================================

import React, { createContext, useContext, memo, useState, useEffect } from "react";

// ============================================
// Utility Functions
// ============================================

export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
}

// ============================================
// Browser Context
// ============================================

interface BrowserContextType {
  currentPath: string;
  navigate: (path: string) => void;
  routes: { path: string; label?: string }[];
}

export const BrowserContext = createContext<BrowserContextType | null>(null);

export function useBrowserNavigation() {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error("useBrowserNavigation must be used within BrowserContext");
  }
  return context;
}

// ============================================
// Demo Components
// ============================================

// Note: DemoPage is defined in App.tsx to share the same SSGOI context

interface DemoLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const DemoLink = memo(({ to, children, className, ...props }: DemoLinkProps) => {
  const { navigate } = useBrowserNavigation();
  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "text-neutral-300 hover:text-neutral-100 underline cursor-pointer transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

DemoLink.displayName = "DemoLink";

interface DemoCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}

export const DemoCard = memo(({ children, onClick, className, ...props }: DemoCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border border-white/10 rounded-lg bg-white/[0.02]",
        "hover:bg-white/5 transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

DemoCard.displayName = "DemoCard";
`;
