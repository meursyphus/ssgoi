"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Star } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800  px-4 sm:px-6 lg:px-8 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
      <div className="mx-auto max-w-7xl flex h-16 items-center">
        <div className="flex items-center gap-4">
          {/* Mobile menu button - now on the left */}
          <button
            className="md:hidden inline-flex items-center justify-center  rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-white text-gray-300 h-9 w-9"
            onClick={() => {
              setMobileDrawerOpen(!mobileDrawerOpen);
            }}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("openMenu")}</span>
          </button>

          <Link
            href={`/${currentLang}/`}
            className="flex items-center space-x-2"
          >
            <Image
              src="/ssgoi-logo.png"
              alt="SSGOI Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-orange-500">SSGOI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${currentLang}/docs`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-400",
                isActive(`/${currentLang}/docs`)
                  ? "text-orange-400"
                  : "text-gray-300",
              )}
            >
              {t("docs")}
            </Link>
            <Link
              href={`/${currentLang}/blog`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-400",
                isActive(`/${currentLang}/blog`)
                  ? "text-orange-400"
                  : "text-gray-300",
              )}
            >
              {t("blog")}
            </Link>
            <Link
              href={`/${currentLang}/demo`}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-400",
                isActive(`/${currentLang}/demo`)
                  ? "text-orange-400"
                  : "text-gray-300",
              )}
            >
              {t("demo")}
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Language Switcher - Hidden on small mobile, visible on tablet and up */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Social Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            {/* Discord Link */}
            <Link
              href="https://discord.gg/9gSSWQbvX4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 h-9 w-9 text-gray-300 hover:text-white"
              aria-label="Discord"
            >
              {/* Discord Icon SVG */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 h-9 w-9 text-gray-300 hover:text-white"
              aria-label="X (Twitter)"
            >
              {/* X Icon SVG */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>

          <Link
            href="https://github.com/meursyphus/ssgoi"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "relative inline-flex items-center gap-2 rounded-md text-sm font-medium transition-all",
              "bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-zinc-700 hover:to-zinc-600",
              "text-white shadow-lg hover:shadow-xl hover:scale-105",
              "h-9 px-4",
              "border border-zinc-600 hover:border-zinc-500",
              "group",
            )}
          >
            {/* GitHub Icon SVG */}
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <div className="flex items-center gap-1 font-semibold min-w-[3.5rem]">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              {isLoadingStars ? (
                <span className="inline-block w-7 h-4 bg-zinc-600 rounded animate-pulse" />
              ) : stars !== null ? (
                <span>{stars.toLocaleString()}</span>
              ) : (
                <span className="text-zinc-400">—</span>
              )}
            </div>
            <span className="sr-only">{t("githubRepository")}</span>
          </Link>
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
