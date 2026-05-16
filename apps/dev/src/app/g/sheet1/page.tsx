"use client";

import Link from "next/link";
import { SsgoiTransition } from "@ssgoi/react";

type SentEmail = {
  id: string;
  to: string;
  email: string;
  subject: string;
  preview: string;
  date: string;
  time: string;
};

const SENT_EMAILS: SentEmail[] = [
  {
    id: "1",
    to: "John Smith",
    email: "john@example.com",
    subject: "Project status update",
    preview: "Hi team, here's a quick update on where we stand with...",
    date: "Today",
    time: "10:32 AM",
  },
  {
    id: "2",
    to: "Sarah Johnson",
    email: "sarah@example.com",
    subject: "Re: Design review feedback",
    preview: "Thanks for sharing! Overall looks great, just a few minor...",
    date: "Today",
    time: "9:15 AM",
  },
  {
    id: "3",
    to: "Mike Chen",
    email: "mike@example.com",
    subject: "Weekly report attached",
    preview: "Please find attached the weekly progress report with...",
    date: "Yesterday",
    time: "5:48 PM",
  },
  {
    id: "4",
    to: "Emily Davis",
    email: "emily@example.com",
    subject: "Meeting confirmation request",
    preview: "Could you please confirm if Tuesday 2 PM works for...",
    date: "Yesterday",
    time: "3:22 PM",
  },
  {
    id: "5",
    to: "Alex Kim",
    email: "alex@example.com",
    subject: "API docs updated",
    preview: "I've finished updating the API documentation with all...",
    date: "Dec 18",
    time: "1:05 PM",
  },
  {
    id: "6",
    to: "Lisa Park",
    email: "lisa@example.com",
    subject: "Vacation request",
    preview: "I'd like to request time off from December 24th to 27th...",
    date: "Dec 17",
    time: "11:30 AM",
  },
  {
    id: "7",
    to: "Tom Wilson",
    email: "tom@example.com",
    subject: "Q4 budget review",
    preview:
      "Attached the revised numbers for next quarter — the marketing line...",
    date: "Dec 16",
    time: "4:18 PM",
  },
  {
    id: "8",
    to: "Rachel Adams",
    email: "rachel@example.com",
    subject: "Onboarding checklist",
    preview: "Welcome aboard! Here's the checklist for your first week...",
    date: "Dec 15",
    time: "9:02 AM",
  },
  {
    id: "9",
    to: "David Park",
    email: "david@example.com",
    subject: "Re: Office relocation",
    preview: "Confirmed for the new floor on Jan 6. I'll send the seating...",
    date: "Dec 13",
    time: "2:47 PM",
  },
  {
    id: "10",
    to: "Hyeon Lee",
    email: "hyeon@example.com",
    subject: "Sheet transition notes",
    preview: "Here are my notes from the demo today — the spring config we...",
    date: "Dec 12",
    time: "8:11 AM",
  },
];

async function fetchSentEmails(): Promise<SentEmail[]> {
  return SENT_EMAILS;
}

export default function Sheet1SentPage() {
  // Pretend we're calling an API.
  const emails = SENT_EMAILS;
  void fetchSentEmails;

  return (
    <SsgoiTransition
      id="/g/sheet1"
      className="relative flex min-h-full flex-col bg-[#121212] text-neutral-100"
    >
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#121212]/85 backdrop-blur">
        <div className="flex items-center justify-between px-5 pt-4 pb-1.5">
          <Link
            href="/"
            aria-label="Home"
            className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 18l-6-6 6-6"
              />
            </svg>
          </Link>
          <button
            type="button"
            aria-label="Search"
            className="-mr-2 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-white/5 hover:text-neutral-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3-3" />
            </svg>
          </button>
        </div>
        <div className="px-5 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Sent
          </h1>
          <p className="mt-0.5 text-sm text-neutral-400">
            {emails.length} messages
          </p>
        </div>
      </header>

      <ul className="divide-y divide-white/5">
        {emails.map((email) => (
          <li
            key={email.id}
            className="cursor-pointer px-5 py-4 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white">
                {email.to[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-white">
                    {email.to}
                  </span>
                  <span className="shrink-0 text-xs text-neutral-500">
                    {email.date}
                  </span>
                </div>
                <h3 className="truncate text-sm text-neutral-300">
                  {email.subject}
                </h3>
                <p className="mt-0.5 truncate text-sm text-neutral-500">
                  {email.preview}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Link
        href="/g/sheet1/compose"
        aria-label="Compose new message"
        className="sticky bottom-5 right-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-400 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </Link>
    </SsgoiTransition>
  );
}
