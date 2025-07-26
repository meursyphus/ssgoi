"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { LANGUAGE_LIST } from "@/i18n/supported-languages";
import { useCurrentLanguage } from "@/i18n/use-current-language";
import { useOutsideClick } from "@/lib/use-click-outside";

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = useCurrentLanguage();
  const onOutsideClick = useOutsideClick();

  const currentLanguage = LANGUAGE_LIST.find((lang) => lang.locale === currentLang);

  const handleLanguageChange = (locale: string) => {
    // 현재 경로에서 언어 부분만 교체
    const pathSegments = pathname.split("/");
    pathSegments[1] = locale; // /ko/docs -> /en/docs
    const newPath = pathSegments.join("/");
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-zinc-800 hover:text-white rounded-md"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage?.title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          ref={onOutsideClick(() => setIsOpen(false))}
          className="absolute right-0 mt-2 w-40 rounded-md bg-zinc-800 border border-zinc-700 shadow-lg py-1 z-50"
        >
          {LANGUAGE_LIST.map((lang) => (
            <button
              key={lang.locale}
              onClick={() => handleLanguageChange(lang.locale)}
              className={`
                w-full px-4 py-2 text-sm text-left transition-colors
                ${currentLang === lang.locale 
                  ? "bg-zinc-700 text-white" 
                  : "text-gray-300 hover:bg-zinc-700 hover:text-white"
                }
              `}
            >
              {lang.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}