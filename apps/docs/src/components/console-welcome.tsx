"use client";

import { useEffect } from "react";
import { useTranslations } from "@/i18n/use-translations";

export function ConsoleWelcome() {
  const t = useTranslations("console");
  
  useEffect(() => {
    // ASCII art with color styling
    console.log(
      "%c" +
      "███████╗███████╗ ██████╗  ██████╗ ██╗\n" +
      "██╔════╝██╔════╝██╔════╝ ██╔═══██╗██║\n" +
      "███████╗███████╗██║  ███╗██║   ██║██║\n" +
      "╚════██║╚════██║██║   ██║██║   ██║██║\n" +
      "███████║███████║╚██████╔╝╚██████╔╝██║\n" +
      "╚══════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝",
      "color: #10b981; font-family: monospace; font-size: 12px; line-height: 1.2;"
    );
    
    console.log(
      "%c🥒 " + t("welcome"),
      "color: #10b981; font-size: 20px; font-weight: bold; margin-top: 10px;"
    );
    
    console.log(
      "%c✨ " + t("subtitle"),
      "color: #6b7280; font-size: 14px; margin-top: 5px;"
    );
    
    console.log(
      "%c🚀 " + t("supports"),
      "color: #6b7280; font-size: 14px;"
    );
    
    console.log(
      "%c📚 " + t("visit"),
      "color: #3b82f6; font-size: 14px; margin-top: 5px;"
    );
  }, [t]);

  return null;
}