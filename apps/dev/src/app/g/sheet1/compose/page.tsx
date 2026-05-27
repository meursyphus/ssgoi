"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Recipient = {
  name: string;
  email: string;
  initial: string;
};

const SUGGESTED_RECIPIENTS: Recipient[] = [
  { name: "Sarah Johnson", email: "sarah@example.com", initial: "S" },
  { name: "Mike Chen", email: "mike@example.com", initial: "M" },
  { name: "Emily Davis", email: "emily@example.com", initial: "E" },
  { name: "Alex Kim", email: "alex@example.com", initial: "A" },
  { name: "Lisa Park", email: "lisa@example.com", initial: "L" },
];

type Draft = {
  subject: string;
  preview: string;
  date: string;
};

const RECENT_DRAFTS: Draft[] = [
  {
    subject: "Re: Quarterly review",
    preview: "Thanks for the detailed breakdown — I'll review and...",
    date: "Yesterday",
  },
  {
    subject: "Out of office — Dec 24-27",
    preview: "I'll be out of the office and slow to respond. For urgent...",
    date: "Dec 18",
  },
  {
    subject: "Project Mercury kickoff notes",
    preview: "Here are the action items from today's kickoff. Owners are...",
    date: "Dec 15",
  },
];

export default function Sheet1ComposePage() {
  const router = useRouter();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    // Pretend POST /api/emails.
    router.push("/g/sheet1");
  };

  return (
    <div
      data-ssgoi-transition="/g/sheet1/compose"
      className="flex min-h-full flex-col bg-[#121212] text-neutral-100"
    >
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#121212]/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push("/g/sheet1")}
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Cancel
          </button>
          <h1 className="text-base font-semibold text-white">New Message</h1>
          <button
            onClick={handleSend}
            disabled={!to.trim()}
            className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300 disabled:cursor-not-allowed disabled:text-neutral-600"
          >
            Send
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <span className="w-14 text-sm text-neutral-500">To:</span>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="recipient@email.com"
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
        />
      </div>

      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
        <span className="w-14 text-sm text-neutral-500">Subject:</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject"
          className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
        />
      </div>

      <div className="p-4">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
          className="min-h-[280px] w-full resize-none bg-transparent text-sm leading-relaxed text-white outline-none placeholder:text-neutral-600"
        />
      </div>

      <section className="border-t border-white/10 px-5 py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
          Suggested
        </h3>
        <div className="space-y-1">
          {SUGGESTED_RECIPIENTS.map((r) => (
            <button
              key={r.email}
              onClick={() => setTo(r.email)}
              className="flex w-full items-center gap-3 rounded-md py-2 transition-colors hover:bg-white/5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-semibold text-white">
                {r.initial}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-sm text-white">{r.name}</div>
                <div className="truncate text-xs text-neutral-500">
                  {r.email}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-4">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
          Recent drafts
        </h3>
        <div className="space-y-3">
          {RECENT_DRAFTS.map((d) => (
            <div
              key={d.subject}
              className="cursor-pointer rounded-lg bg-white/[0.03] px-3 py-3 transition-colors hover:bg-white/[0.06]"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-medium text-white">
                  {d.subject}
                </h4>
                <span className="shrink-0 text-xs text-neutral-500">
                  {d.date}
                </span>
              </div>
              <p className="truncate text-xs text-neutral-500">{d.preview}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto flex items-center gap-3 border-t border-white/10 bg-[#0a0a0a] px-4 py-3">
        <button
          type="button"
          aria-label="Attach link"
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Attach image"
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Attach file"
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </button>
        <span className="ml-auto text-xs text-neutral-500">
          {body.length} chars
        </span>
      </div>
    </div>
  );
}
