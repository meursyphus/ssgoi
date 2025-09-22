"use client";

import { X, FileText, Globe, Menu, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarStore } from "@/store/sidebar";
import { useEffect, useState } from "react";
import { useOutsideClick } from "@/lib/use-click-outside";
import { LANGUAGE_LIST } from "@/i18n/supported-languages";
import { SidebarContent } from "@/components/docs/sidebar-content";
import { useNavigationStore } from "@/store/navigation";
import { useTranslations } from "@/i18n/use-translations";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export function MobileDrawer({ isOpen, onClose, lang }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isDocsPage = pathname.includes("/docs");
  const { toggle: toggleSidebar } = useSidebarStore();
  const onOutsideClick = useOutsideClick();
  const navigation = useNavigationStore((state) => state.navigation);
  const t = useTranslations("mobileMenu");

  // 탭 상태 관리 - 문서 페이지에서는 'docs'가 기본값
  const [activeTab, setActiveTab] = useState<"menu" | "docs">(
    isDocsPage ? "docs" : "menu",
  );

  // Close drawer when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // 문서 페이지 여부에 따라 기본 탭 설정
  useEffect(() => {
    setActiveTab(isDocsPage ? "docs" : "menu");
  }, [isDocsPage]);

  const handleLanguageChange = (locale: string) => {
    const pathSegments = pathname.split("/");
    pathSegments[1] = locale;
    const newPath = pathSegments.join("/");

    router.push(newPath);
    onClose();
  };

  return (
    <>
      {/* Overlay - 시각적 효과만, 클릭 이벤트 없음 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] md:hidden" />
      )}

      {/* Drawer */}
      <aside
        ref={isOpen ? onOutsideClick(onClose) : undefined}
        className={`
          fixed left-0 top-0 h-screen w-72 bg-zinc-900 border-r border-zinc-800 overflow-y-auto z-[70]
          transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with Tabs */}
          <div className="p-4 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-4">
                {/* 문서 페이지에서만 문서 탭 표시 */}
                {isDocsPage && (
                  <button
                    onClick={() => setActiveTab("docs")}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      activeTab === "docs"
                        ? "text-white border-b-2 border-orange-500 pb-2"
                        : "text-gray-400 hover:text-white pb-2"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    {t("documentToc")}
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("menu")}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    activeTab === "menu"
                      ? "text-white border-b-2 border-orange-500 pb-2"
                      : "text-gray-400 hover:text-white pb-2"
                  }`}
                >
                  <Menu className="h-4 w-4" />
                  {t("menu")}
                </button>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 h-9 w-9 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">{t("closeDrawer")}</span>
              </button>
            </div>
            <div className="border-b border-zinc-800" />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* 문서 탭 콘텐츠 */}
            {activeTab === "docs" && isDocsPage && navigation && (
              <div>
                <SidebarContent
                  navigation={navigation}
                  lang={lang}
                  onLinkClick={onClose}
                />
              </div>
            )}

            {/* 문서 탭이지만 navigation이 없는 경우 (문서 페이지가 아닐 때) */}
            {activeTab === "docs" && !navigation && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">{t("noDocumentPage")}</p>
              </div>
            )}

            {/* 메뉴 탭 콘텐츠 */}
            {activeTab === "menu" && (
              <div className="space-y-6">
                {/* Navigation Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {t("navigation")}
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
                          {t("documents")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/${lang}/blog`}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <BookOpen className="h-4 w-4" />
                          {t("blog")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/${lang}/demo`}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="7" y="4" width="10" height="16" rx="1" />
                            <circle cx="12" cy="17" r="1" />
                          </svg>
                          {t("demo")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/${lang}/showcase`}
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                          </svg>
                          {t("showcase")}
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Social Links Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Community
                  </h3>
                  <nav>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="https://github.com/meursyphus/ssgoi"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          {/* GitHub Icon SVG */}
                          <svg
                            viewBox="0 0 16 16"
                            className="h-4 w-4 fill-current"
                            aria-hidden="true"
                          >
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                          GitHub
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://discord.gg/9gSSWQbvX4"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          {/* Discord Icon SVG */}
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                            aria-hidden="true"
                          >
                            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
                          </svg>
                          Discord
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://x.com/meuryphus"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                          {/* X Icon SVG */}
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                            aria-hidden="true"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          X (Twitter)
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Language Section */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {t("language")}
                  </h3>
                  <div className="space-y-2">
                    {LANGUAGE_LIST.map((language) => (
                      <button
                        key={language.locale}
                        onClick={() => handleLanguageChange(language.locale)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          lang === language.locale
                            ? "bg-zinc-800 text-white"
                            : "text-gray-300 hover:text-white hover:bg-zinc-800"
                        }`}
                      >
                        <Globe className="h-4 w-4" />
                        {language.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
