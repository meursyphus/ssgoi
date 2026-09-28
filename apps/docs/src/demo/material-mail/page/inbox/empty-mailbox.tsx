"use client";

import { Inbox } from "lucide-react";

export function EmptyMailbox({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center px-8 pt-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100/70 text-indigo-600">
        <Inbox size={34} strokeWidth={1.75} />
      </div>
      <p className="mt-5 text-[16px] text-neutral-800">Nothing in {label}</p>
    </div>
  );
}
