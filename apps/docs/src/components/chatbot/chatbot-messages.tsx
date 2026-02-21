"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "@/i18n";
import { Bot, User } from "lucide-react";

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

interface ChatbotMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
}

export function ChatbotMessages({
  messages,
  isLoading,
  error,
}: ChatbotMessagesProps) {
  const t = useTranslations("chatbot");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="max-w-[240px] text-center text-sm text-neutral-400">
            {t("welcomeMessage")}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((message) => {
          const text = getTextContent(message);
          return (
            <div
              key={message.id}
              className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20">
                  <Bot className="h-3.5 w-3.5 text-blue-400" />
                </div>
              )}
              <div
                className={`min-w-0 max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-neutral-200"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="chatbot-markdown prose prose-sm prose-invert max-w-none [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/30 [&_pre]:p-3 [&_code]:text-xs [&_pre]:my-2 [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-300">
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{text}</p>
                )}
              </div>
              {message.role === "user" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-700">
                  <User className="h-3.5 w-3.5 text-neutral-300" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20">
              <Bot className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="rounded-xl bg-white/5 px-3.5 py-2.5">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error.message.includes("429")
              ? t("rateLimitMessage")
              : t("errorMessage")}
          </div>
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
