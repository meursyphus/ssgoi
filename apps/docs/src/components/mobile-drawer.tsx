"use client";

import { X, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebar";
import { useEffect } from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export function MobileDrawer({ isOpen, onClose, lang }: MobileDrawerProps) {
  const pathname = usePathname();
  const isDocsPage = pathname.includes("/docs");
  const { toggle: toggleSidebar } = useSidebarStore();

  // Close drawer when route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <aside
        className={`
          fixed right-0 top-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 overflow-y-auto z-50
          transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-white">메뉴</span>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 h-9 w-9 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close drawer</span>
            </button>
          </div>

          {/* Navigation Section */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              네비게이션
            </h3>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${lang}/docs`}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    문서
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Documentation Quick Access (only on docs pages) */}
          {isDocsPage && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                문서 사이드바
              </h3>
              <button
                onClick={() => {
                  onClose();
                  toggleSidebar();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <FileText className="h-4 w-4" />
                문서 목차 보기
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}