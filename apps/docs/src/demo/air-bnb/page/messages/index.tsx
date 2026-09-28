"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Filter = "all" | "traveling" | "support";

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "all", label: "All" },
  { key: "traveling", label: "Traveling" },
  { key: "support", label: "Support" },
];

const EMPTY: Record<Filter, { title: string; body: string }> = {
  all: {
    title: "You don't have any messages",
    body: "When you receive a new message, it will appear here.",
  },
  traveling: {
    title: "No trip messages yet",
    body: "Messages from your hosts show up here once you book a stay.",
  },
  support: {
    title: "No support messages",
    body: "Conversations with Airbnb support will appear here.",
  },
};

export default function MessagesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const empty = EMPTY[filter];
  return (
    <div className="flex-1 bg-white px-5 pb-10 pt-8">
      <h1 className="text-[30px] font-bold text-neutral-900">Messages</h1>
      <div className="flex gap-2 pt-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
              filter === f.key
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="flex flex-col items-center px-6 pt-28 text-center"
        >
          <MessageCircle
            className="h-9 w-9 text-neutral-300"
            strokeWidth={1.8}
          />
          <p className="pt-4 text-[17px] font-semibold text-neutral-900">
            {empty.title}
          </p>
          <p className="pt-1.5 text-[14px] leading-relaxed text-neutral-500">
            {empty.body}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
