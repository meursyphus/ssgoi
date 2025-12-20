"use client";

import React, { useState } from "react";
import { SsgoiTransition, transition } from "@ssgoi/react";
import { fade } from "@ssgoi/react/transitions";
import { useBrowserNavigation } from "../../browser-mockup";
import { sentEmails } from "./content";

// DemoPage wrapper with SsgoiTransition
interface DemoPageProps {
  children: React.ReactNode;
  path: string;
}

function DemoPage({ children, path }: DemoPageProps) {
  return <SsgoiTransition id={path}>{children}</SsgoiTransition>;
}

// Sent emails list page
export function SentEmailsPage() {
  const { navigate } = useBrowserNavigation();

  return (
    <>
      {/* FAB - Compose Button - fixed positioning for Sandpack */}
      <button
        ref={transition({
          scope: "local",
          key: "sent-button",
          ...fade(),
        })}
        onClick={() => navigate("/compose")}
        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all z-10"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>
      <DemoPage path="/sent">
        <div className="flex flex-col bg-[#121212] min-h-screen">
          {/* Header */}
          <div className="flex-shrink-0 bg-[#121212] border-b border-white/5">
            <div className="px-4 py-3">
              <h1 className="text-lg font-semibold text-neutral-100">Sent</h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                {sentEmails.length} emails
              </p>
            </div>
          </div>

          {/* Email List - Scrollable area */}
          <div className="divide-y divide-white/5">
            {sentEmails.map((email) => (
              <div
                key={email.id}
                className="px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                    {email.to[0]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-neutral-100">
                        {email.to}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {email.date}
                      </span>
                    </div>
                    <h3 className="text-sm text-neutral-300 truncate mb-0.5">
                      {email.subject}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate">
                      {email.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DemoPage>
    </>
  );
}

// Compose email page
export function ComposeEmailPage() {
  const { navigate } = useBrowserNavigation();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = () => {
    // Simulate sending
    navigate("/sent");
  };

  return (
    <>
      <DemoPage path="/compose">
        <div className="min-h-screen bg-[#121212] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-md border-b border-white/5">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => navigate("/sent")}
                className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <h1 className="text-base font-semibold text-neutral-100">
                New Message
              </h1>
              <button
                onClick={handleSend}
                disabled={!to.trim()}
                className="text-sm font-medium text-blue-500 hover:text-blue-400 disabled:text-neutral-600 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>

          {/* Compose Form */}
          <div className="flex-1 flex flex-col">
            {/* To Field */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
              <span className="text-sm text-neutral-500 w-8">To</span>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-600 outline-none"
              />
            </div>

            {/* Subject Field */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
              <span className="text-sm text-neutral-500 w-8">Subj</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 bg-transparent text-sm text-neutral-100 placeholder-neutral-600 outline-none"
              />
            </div>

            {/* Body */}
            <div className="flex-1 p-4">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose your message..."
                className="w-full h-full min-h-[200px] bg-transparent text-sm text-neutral-100 placeholder-neutral-600 outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Toolbar */}
            <div className="border-t border-white/5 px-4 py-3 flex items-center gap-4">
              <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </DemoPage>
    </>
  );
}
