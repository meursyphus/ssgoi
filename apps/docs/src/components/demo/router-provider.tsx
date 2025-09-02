"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface RouterContextType {
  goto: (path: string) => void;
  prefetch: (path: string) => void;
  currentPath?: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
  currentPath: string;
  customRouter: {
    goto: (path: string) => void;
    prefetch?: (path: string) => void;
  };
}

export function RouterProvider({
  children,
  currentPath,
  customRouter,
}: RouterProviderProps) {
  const router: RouterContextType = {
    goto: customRouter.goto,
    prefetch: customRouter.prefetch || (() => {}), // No-op if prefetch not provided
    currentPath,
  };

  return (
    <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
  );
}

export function useDemoRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useDemoRouter must be used within a RouterProvider");
  }
  return context;
}
