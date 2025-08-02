"use client";

import { useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";

export function ConsoleWelcome() {
  const t = useTranslations("console");
  
  useEffect(() => {
    // ASCII art with messages in one console.log
    console.log(
      "%c" +
      "███████╗███████╗ ██████╗  ██████╗ ██╗\n" +
      "██╔════╝██╔════╝██╔════╝ ██╔═══██╗██║\n" +
      "███████╗███████╗██║  ███╗██║   ██║██║\n" +
      "╚════██║╚════██║██║   ██║██║   ██║██║\n" +
      "███████║███████║╚██████╔╝╚██████╔╝██║\n" +
      "╚══════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝\n\n" +
      "%c🥒 " + t("welcome") + "\n" +
      "%c✨ " + t("subtitle") + "\n" +
      "%c🚀 " + t("supports") + "\n" +
      "%c📚 " + t("visit"),
      "color: #ff6b35; font-family: monospace; font-size: 12px; line-height: 1.2;",
      "color: #ff6b35; font-size: 20px; font-weight: bold; line-height: 1.8;",
      "color: #6b7280; font-size: 14px; line-height: 1.6;",
      "color: #6b7280; font-size: 14px; line-height: 1.6;",
      "color: #3b82f6; font-size: 14px; line-height: 1.6;"
    );
  }, [t]);

  return null;
}