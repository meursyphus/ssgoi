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
    isDocsPage ? "docs" : "menu"
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
                <p className="text-sm text-gray-400">
                  {t("noDocumentPage")}
                </p>
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
