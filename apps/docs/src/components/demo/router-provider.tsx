"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRouter as useNextRouter } from "next/navigation";

interface RouterContextType {
  goto: (path: string) => void;
  currentPath?: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
  currentPath: string;
  customRouter?: {
    goto: (path: string) => void;
  };
}

export function RouterProvider({
  children,
  currentPath,
  customRouter,
}: RouterProviderProps) {
  const nextRouter = useNextRouter();

  const router: RouterContextType = customRouter || {
    goto: (path: string) => {
      nextRouter.push(path);
    },
    currentPath,
  };

  return (
    <RouterContext.Provider value={{ ...router, currentPath }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}
