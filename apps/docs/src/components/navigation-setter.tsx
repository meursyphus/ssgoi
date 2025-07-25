"use client";

import { useEffect } from "react";
import { useNavigationStore } from "@/store/navigation";
import type { NavigationItem } from "@/app/[lang]/docs/sidebar";

interface NavigationSetterProps {
  navigation: NavigationItem[];
}

export function NavigationSetter({ navigation }: NavigationSetterProps) {
  const setNavigation = useNavigationStore((state) => state.setNavigation);
  const clearNavigation = useNavigationStore((state) => state.clearNavigation);

  useEffect(() => {
    // docs 페이지에 진입할 때 navigation 설정
    setNavigation(navigation);

    // cleanup: docs 페이지를 벗어날 때 navigation 클리어
    return () => {
      clearNavigation();
    };
  }, [navigation, setNavigation, clearNavigation]);

  return null;
}