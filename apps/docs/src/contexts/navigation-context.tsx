"use client";

import { createContext, useContext, ReactNode } from "react";
import type { NavigationItem } from "@/app/[lang]/docs/sidebar";

interface NavigationContextType {
  navigation: NavigationItem[] | null;
}

const NavigationContext = createContext<NavigationContextType>({
  navigation: null,
});

export function NavigationProvider({ 
  children, 
  navigation 
}: { 
  children: ReactNode; 
  navigation: NavigationItem[] | null;
}) {
  return (
    <NavigationContext.Provider value={{ navigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}