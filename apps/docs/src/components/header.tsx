"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/i18n/use-current-language";
import { MobileDrawer } from "./mobile-drawer";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [stars, setStars] = useState<number | null>(null);
  const [isLoadingStars, setIsLoadingStars] = useState(true);
  const currentLang = useCurrentLanguage();

  useEffect(() => {
    fetch("https://api.github.com/repos/meursyphus/ssgoi")
      .then((res) => res.json())
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
            className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-white text-gray-300 h-9 w-9"
            onClick={() => {
              setMobileDrawerOpen(!mobileDrawerOpen);
            }}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-500">SSGOI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${currentLang}/docs`}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-orange-400"
            >
              문서
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

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
              "group"
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
            <span className="sr-only">GitHub Repository</span>
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
