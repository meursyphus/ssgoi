"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SsgoiTransition } from "@ssgoi/react";

export default function Sheet1Compose() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const max = 280;
  const remaining = max - content.length;
  const canPost = content.trim().length > 0 && remaining >= 0;

  const handlePost = () => {
    // Pretend POST /api/posts then navigate back.
    router.push("/g/sheet1");
  };

  return (
    <SsgoiTransition id="/g/sheet1/compose">
      <div className="min-h-full bg-neutral-950 text-neutral-100">
        <header className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <button
            onClick={() => router.push("/g/sheet1")}
            className="text-sm font-medium text-neutral-400 hover:text-neutral-100"
          >
            Cancel
          </button>
          <h1 className="text-base font-semibold">New Post</h1>
          <button
            onClick={handlePost}
            disabled={!canPost}
            className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-500/30"
          >
            Post
          </button>
        </header>

        <main className="px-4 py-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-semibold">
              D
            </div>
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={8}
              className="min-h-[200px] flex-1 resize-none bg-transparent text-base leading-snug text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex gap-2 text-blue-400">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blue-500/10"
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
                    d="M3 7a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                  />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blue-500/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 14s1.2 1.5 3 1.5 3-1.5 3-1.5M9 9h.01M15 9h.01"
                  />
                </svg>
              </button>
            </div>
            <span
              className={`text-xs ${remaining < 20 ? "text-red-400" : "text-neutral-500"}`}
            >
              {remaining}
            </span>
          </div>
        </main>
      </div>
    </SsgoiTransition>
  );
}
