"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Star, Github, Home, FileText, BookOpen, AppWindow, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/i18n/use-current-language";
import { useTranslations } from "@/i18n/use-translations";
import { MobileDrawer } from "./mobile-drawer";
import { LanguageSwitcher } from "./language-switcher";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const [isLoadingStars, setIsLoadingStars] = useState(true);
  const currentLang = useCurrentLanguage();
  const t = useTranslations("header");
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Remove language prefix from pathname for comparison
    const pathWithoutLang = pathname.replace(
      new RegExp(`^/${currentLang}`),
      "",
    );
    const cleanPath = path.replace(new RegExp(`^/${currentLang}`), "");

    // Check for exact match or if current path starts with the nav item path
    return (
      pathWithoutLang === cleanPath ||
      (cleanPath !== "/" && pathWithoutLang.startsWith(cleanPath))
    );
  };

  useEffect(() => {
    fetch("https://api.github.com/repos/meursyphus/ssgoi")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");

        return res.json();
      })
      .then((data) => {
        setStars(data.stargazers_count);
        setIsLoadingStars(false);
      })
      .catch(() => {
        setStars(null);
        setIsLoadingStars(false);
      });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full h-20 flex items-center justify-center">
      {/* Mobile Layout - Center logo with GitHub and menu */}
      <div className="md:hidden fixed top-4 z-50 flex items-center justify-between w-full px-4">
        <div className="flex-1" /> {/* Spacer */}

        <div className="px-4 py-2 rounded-full bg-zinc-900/70 backdrop-blur-xl backdrop-saturate-150 border border-zinc-700/50 shadow-2xl shadow-black/20 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none relative">
          <Link
            href={`/${currentLang}/`}
            className="flex items-center gap-1.5 group"
          >
            <Image
              src="/ssgoi-logo.png"
              alt="SSGOI Logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover transition-transform group-hover:scale-110"
            />
            <span className="text-lg font-bold text-orange-500 transition-colors group-hover:text-orange-400 font-[family-name:var(--font-space-grotesk)] tracking-wide">
              SSGOI
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 bg-zinc-900/70 backdrop-blur-xl backdrop-saturate-150 border border-zinc-700/50 hover:bg-zinc-800/70 text-gray-300 hover:text-white h-10 w-10 relative"
            onClick={() => {
              setMobileDrawerOpen(!mobileDrawerOpen);
            }}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">{t("openMenu")}</span>
          </button>
        </div>
      </div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden md:block fixed top-4 z-50 mx-auto px-2 py-2 rounded-full bg-zinc-900/70 backdrop-blur-xl backdrop-saturate-150 border border-zinc-700/50 shadow-2xl shadow-black/20 transition-all duration-300 hover:shadow-black/30 max-w-fit before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none relative">
        <div className="flex items-center gap-2 px-3">
          {/* Logo */}
          <Link
            href={`/${currentLang}/`}
            className="flex items-center gap-2 group"
          >
            <Image
              src="/ssgoi-logo.png"
              alt="SSGOI Logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover transition-transform group-hover:scale-110"
            />
            <span className="text-lg font-bold text-orange-500 transition-colors group-hover:text-orange-400 font-[family-name:var(--font-space-grotesk)] tracking-wide">
              SSGOI
            </span>
          </Link>

          {/* Desktop Navigation - Full text */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href={`/${currentLang}/docs`}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 relative z-10",
                isActive(`/${currentLang}/docs`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
            >
              {t("docs")}
            </Link>
            <Link
              href={`/${currentLang}/blog`}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                isActive(`/${currentLang}/blog`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
            >
              {t("blog")}
            </Link>
            <Link
              href={`/${currentLang}/demo`}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                isActive(`/${currentLang}/demo`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
            >
              {t("demo")}
            </Link>
            <Link
              href={`/${currentLang}/showcase`}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                isActive(`/${currentLang}/showcase`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
            >
              {t("showcase")}
            </Link>
          </nav>

          {/* Tablet Navigation - Icons only */}
          <nav className="flex lg:hidden items-center gap-1">
            <Link
              href={`/${currentLang}/docs`}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                isActive(`/${currentLang}/docs`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
              title={t("docs")}
            >
              <FileText className="h-4 w-4" />
            </Link>
            <Link
              href={`/${currentLang}/blog`}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                isActive(`/${currentLang}/blog`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
              title={t("blog")}
            >
              <BookOpen className="h-4 w-4" />
            </Link>
            <Link
              href={`/${currentLang}/demo`}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                isActive(`/${currentLang}/demo`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
              title={t("demo")}
            >
              <AppWindow className="h-4 w-4" />
            </Link>
            <Link
              href={`/${currentLang}/showcase`}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                isActive(`/${currentLang}/showcase`)
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-300 hover:bg-zinc-800 hover:text-orange-400",
              )}
              title={t("showcase")}
            >
              <Sparkles className="h-4 w-4" />
            </Link>
          </nav>

          {/* Separator */}
          <div className="hidden lg:block w-px h-5 bg-zinc-700" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Social Links - Hidden on tablet, visible on desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Discord Link */}
              <Link
                href="https://discord.gg/9gSSWQbvX4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 hover:bg-zinc-800 h-8 w-8 text-gray-300 hover:text-white"
                aria-label="Discord"
              >
                {/* Discord Icon SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
                </svg>
              </Link>

              {/* X (Twitter) Link */}
              <Link
                href="https://x.com/meursyphus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 hover:bg-zinc-800 h-8 w-8 text-gray-300 hover:text-white"
                aria-label="X (Twitter)"
              >
                {/* X Icon SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>

            {/* GitHub Stars */}
            <Link
              href="https://github.com/meursyphus/ssgoi"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full text-sm font-medium transition-all duration-200",
                "bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600",
                "text-white shadow-lg hover:shadow-xl hover:scale-105",
                "h-8 px-3",
                "border border-zinc-600 hover:border-zinc-500",
                "group",
              )}
            >
              <Github className="h-3.5 w-3.5" />
              <div className="hidden sm:flex items-center gap-0.5 font-semibold">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                {isLoadingStars ? (
                  <span className="inline-block w-6 h-3.5 bg-zinc-600 rounded animate-pulse" />
                ) : stars !== null ? (
                  <span className="text-xs">{stars.toLocaleString()}</span>
                ) : (
                  <span className="text-xs text-zinc-400">—</span>
                )}
              </div>
              <span className="sr-only">{t("githubRepository")}</span>
            </Link>
          </div>
        </div>
      </div>

      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        lang={currentLang}
      />
    </header>
  );
}