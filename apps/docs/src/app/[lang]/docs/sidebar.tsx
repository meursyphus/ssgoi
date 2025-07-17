"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSidebarStore } from "@/store/sidebar";
import { X, ChevronRight } from "lucide-react";

interface NavigationItem {
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { isOpen, close } = useSidebarStore();

  const toggleExpanded = (path: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderNavItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.path);
    const itemPath = `/${lang}/docs/${item.path}`;
    const isActive = pathname === itemPath;

    return (
      <li key={item.path}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpanded(item.path)}
              className={`
                w-full text-left px-4 py-2 flex items-center justify-between
                text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors
                ${level > 0 ? "pl-" + (level * 4 + 4) : ""}
              `}
            >
              <span className="font-medium">{item.navTitle}</span>
              <ChevronRight 
                className={`w-4 h-4 transition-transform text-gray-500 ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>
            {isExpanded && (
              <ul>
                {item.children?.map((child) => renderNavItem(child, level + 1))}
              </ul>
            )}
          </div>
        ) : (
          <Link
            href={itemPath}
            onClick={() => close()}
            className={`
              block px-4 py-2 transition-colors
              ${level > 0 ? "pl-" + (level * 4 + 4) : ""}
              ${isActive 
                ? "bg-orange-500/20 text-orange-400 border-l-4 border-orange-500 hover:bg-orange-500/30" 
                : "text-gray-300 hover:text-white hover:bg-zinc-800 border-l-4 border-transparent"
              }
            `}
          >
            {item.navTitle}
          </Link>
        )}
      </li>
    );
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={close}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-zinc-900 border-r border-zinc-800 overflow-y-auto z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-4 md:hidden flex items-center justify-between border-b border-zinc-800">
          <span className="text-sm font-medium text-gray-400">Navigation</span>
          <button
            onClick={close}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 h-8 w-8 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        <nav className="py-4 md:pt-6">
          <ul>{navigation.map((item) => renderNavItem(item))}</ul>
        </nav>
      </aside>
    </>
  );
}