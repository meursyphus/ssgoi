"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import type { NavigationItem } from "@/app/[lang]/docs/sidebar";

interface SidebarContentProps {
  navigation: NavigationItem[];
  lang: string;
  onLinkClick?: () => void;
}

export function SidebarContent({ navigation, lang, onLinkClick }: SidebarContentProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand the group containing the active page
  useEffect(() => {
    const findActiveParent = (items: NavigationItem[], parentPath?: string): string | null => {
      for (const item of items) {
        const itemPath = `/${lang}/docs/${item.path}`;
        
        if (pathname === itemPath && parentPath) {
          return parentPath;
        }
        
        if (item.children) {
          const activeParent = findActiveParent(item.children, item.path);
          if (activeParent) {
            return activeParent;
          }
        }
      }
      return null;
    };

    const activeParent = findActiveParent(navigation);
    if (activeParent) {
      setExpandedItems(new Set([activeParent]));
    }
  }, [pathname, lang, navigation]);

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
                w-full text-left px-3 py-2 flex items-center justify-between rounded-md
                text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors
                ${level > 0 ? "ml-" + (level * 4) : ""}
              `}
            >
              <span className="font-medium text-sm">{item.navTitle}</span>
              <ChevronRight 
                className={`w-4 h-4 transition-transform duration-300 text-gray-500 ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="mt-1">
                {item.children?.map((child) => renderNavItem(child, level + 1))}
              </ul>
            </div>
          </div>
        ) : (
          <Link
            href={itemPath}
            onClick={onLinkClick}
            className={`
              block px-3 py-2 rounded-md transition-colors text-sm
              ${level > 0 ? "ml-" + (level * 4) : ""}
              ${isActive 
                ? "bg-orange-500/20 text-orange-400 font-medium" 
                : "text-gray-300 hover:text-white hover:bg-zinc-800"
              }
            `}
          >
            {item.navTitle}
          </Link>
        )}
      </li>
    );
  };

  return (
    <nav>
      <ul className="space-y-1">
        {navigation.map((item) => renderNavItem(item))}
      </ul>
    </nav>
  );
}