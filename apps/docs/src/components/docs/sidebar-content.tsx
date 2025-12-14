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

export function SidebarContent({
  navigation,
  lang,
  onLinkClick,
}: SidebarContentProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand the group containing the active page
  useEffect(() => {
    const findActiveParent = (
      items: NavigationItem[],
      parentPath?: string,
    ): string | null => {
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
      <li key={item.path} className={level === 0 ? "mb-0.5" : ""}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpanded(item.path)}
              className={`
                w-full text-left px-2 py-1.5 flex items-center justify-between rounded
                text-neutral-400 hover:text-white transition-colors
                ${level > 0 ? "ml-" + level * 4 : ""}
              `}
            >
              <span className="text-xs font-medium">{item.navTitle}</span>
              <ChevronRight
                className={`w-3 h-3 transition-transform duration-300 text-neutral-600 ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="mt-0.5 space-y-0 border-l border-white/5 ml-2">
                {item.children?.map((child) => renderNavItem(child, level + 1))}
              </ul>
            </div>
          </div>
        ) : (
          <Link
            href={itemPath}
            onClick={onLinkClick}
            className={`
              block px-2 py-1.5 rounded text-xs relative transition-colors
              ${level > 0 ? "ml-" + level * 4 : ""}
              ${
                isActive
                  ? "bg-white/5 text-white border-l-2 border-white pl-1.5"
                  : "text-neutral-500 hover:text-white border-l-2 border-transparent"
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
      <ul className="space-y-0">
        {navigation.map((item) => renderNavItem(item))}
      </ul>
    </nav>
  );
}
