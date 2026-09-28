"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { DragScroller } from "@/lib/components/drag-scroller";
import type { ShareSheet } from "@/demo/pinterest/state/pin";

export function SendRow({ contacts }: { contacts: ShareSheet["contacts"] }) {
  const [sent, setSent] = useState<string[]>([]);

  function send(name: string) {
    if (sent.includes(name)) return;
    setSent((names) => [...names, name]);
    toast(`${name}님에게 보냈어요`, { duration: 1500 });
  }

  return (
    <section aria-label="보내기" className="pt-6">
      <h2 className="px-4 pb-3 text-[16px] font-bold text-black">보내기</h2>
      <DragScroller trackClassName="gap-4 px-4">
        {contacts.map((contact) => {
          const done = sent.includes(contact.name);
          return (
            <button
              key={contact.name}
              type="button"
              onClick={() => send(contact.name)}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5"
            >
              <span className="relative">
                <img
                  src={contact.avatar}
                  alt=""
                  width={96}
                  height={96}
                  className={`h-16 w-16 rounded-full bg-neutral-200 object-cover transition-opacity ${
                    done ? "opacity-50" : ""
                  }`}
                />
                {done && (
                  <span className="absolute inset-0 grid place-items-center">
                    <Check className="h-7 w-7 text-black" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span className="w-full truncate text-center text-[12px] text-black">
                {done ? "보냄" : contact.shortName}
              </span>
            </button>
          );
        })}
      </DragScroller>
    </section>
  );
}
