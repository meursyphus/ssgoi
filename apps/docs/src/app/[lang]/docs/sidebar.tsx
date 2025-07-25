"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebar";
import { SidebarContent } from "@/components/docs/sidebar-content";

export interface NavigationItem {
  title: string;
  navTitle: string;
  description?: string;
  path: string;
  children?: NavigationItem[];
}

interface SidebarProps {
  navigation: NavigationItem[];
  lang: string;
}

export function Sidebar({ navigation, lang }: SidebarProps) {
  const pathname = usePathname();
  const { close } = useSidebarStore();

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <div className="hidden md:block">
      <div className="space-y-1">
        <div className="mb-4 pb-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Documentation
          </h2>
        </div>
        <SidebarContent
          navigation={navigation}
          lang={lang}
          onLinkClick={close}
        />
      </div>
    </div>
  );
}
