"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Mic, X } from "lucide-react";
import { toast } from "sonner";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { Input } from "@/lib/components/ui/input";
import { BASE } from "../../mock-data";

export function SearchHeader({
  query,
  onQueryChange,
  onLeave,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  onLeave: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  // Keyboard up on a fresh search; preventScroll keeps the frame still while
  // the page fades in. Only when this document already has focus (the user
  // opened search here): an embedded preview that navigates the frame from
  // outside must not pull focus, and keystrokes, out of the host page.
  useEffect(() => {
    if (input.current?.value || !document.hasFocus()) return;
    input.current?.focus({ preventScroll: true });
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-1 bg-white px-1">
      <DemoBackLink
        fallback={BASE}
        onClick={onLeave}
        aria-label="Back"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-neutral-100"
      >
        <ArrowLeft className="h-6 w-6" />
      </DemoBackLink>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          input.current?.blur();
        }}
        className="relative min-w-0 flex-1"
      >
        <Input
          ref={input}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search YouTube"
          aria-label="Search YouTube"
          enterKeyHint="search"
          className="h-10 rounded-full border-0 bg-neutral-100 pl-4 pr-10 text-[16px] shadow-none placeholder:text-neutral-500 focus-visible:ring-0 md:text-[15px] [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              input.current?.focus({ preventScroll: true });
            }}
            aria-label="Clear search"
            className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full active:bg-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>
      <button
        type="button"
        onClick={() => toast("Voice search needs microphone access")}
        aria-label="Search with your voice"
        className="ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200"
      >
        <Mic className="h-5 w-5" />
      </button>
    </header>
  );
}
