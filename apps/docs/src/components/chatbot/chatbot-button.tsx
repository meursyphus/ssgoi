"use client";

import { useState } from "react";
import { useTranslations } from "@/i18n";
import { MessageSquare } from "lucide-react";
import { ChatbotDrawer } from "./chatbot-drawer";

export function ChatbotButton() {
  const t = useTranslations("chatbot");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 text-neutral-300 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-neutral-800 hover:text-white md:h-11 md:w-auto md:gap-2 md:rounded-full md:px-4"
        aria-label={t("buttonLabel")}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden text-sm font-medium md:inline">
          {t("buttonLabel")}
        </span>
      </button>

      <ChatbotDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
