"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSidebarStore } from "@/store/sidebar";
import { X } from "lucide-react";

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
                w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between
                ${level > 0 ? "pl-" + (level * 4 + 4) : ""}
              `}
            >
              <span className="font-medium">{item.navTitle}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
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
              block px-4 py-2 hover:bg-gray-100
              ${level > 0 ? "pl-" + (level * 4 + 4) : ""}
              ${isActive ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : ""}
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={close}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <Link href={`/${lang}`} className="text-xl font-bold">
            SSGOI Docs
          </Link>
          <button
            onClick={close}
            className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        <nav className="py-4">
          <ul>{navigation.map((item) => renderNavItem(item))}</ul>
        </nav>
      </aside>
    </>
  );
}
