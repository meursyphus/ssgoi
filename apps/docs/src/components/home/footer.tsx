"use client";

import { useTranslations } from "@/i18n/use-translations";

export function Footer() {
  const t = useTranslations("home");

  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-[10px] text-neutral-600">
          {t("newHome.footer.license")}
        </span>
        <span className="text-[10px] text-neutral-600">
          {t("newHome.footer.builtWith")}
        </span>
      </div>
    </footer>
  );
}
