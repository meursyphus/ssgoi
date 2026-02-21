"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "@/i18n";
import { useCurrentLanguage } from "@/i18n";
import { ChatbotMessages } from "./chatbot-messages";
import { ChatbotInput } from "./chatbot-input";
import { X } from "lucide-react";

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotDrawer({ isOpen, onClose }: ChatbotDrawerProps) {
  const t = useTranslations("chatbot");
  const lang = useCurrentLanguage();
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { lang },
      }),
    [lang],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 flex flex-col overflow-hidden border border-white/10 bg-neutral-900/95 shadow-2xl backdrop-blur-md
          inset-2 rounded-2xl
          md:inset-auto md:bottom-20 md:right-4 md:h-[560px] md:w-96 md:rounded-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-sm font-semibold text-neutral-100">
            {t("drawerTitle")}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <ChatbotMessages
          messages={messages}
          isLoading={isLoading}
          error={error}
        />

        {/* Input */}
        <ChatbotInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
