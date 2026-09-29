"use client";

import { toast } from "sonner";
import type { HubContent } from "./content";

export function HubEmptyState({ hub }: { hub: HubContent }) {
  const Icon = hub.icon;
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-10 pt-6 pb-24 text-center">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100/70 text-indigo-600">
        <div className="absolute -right-1 bottom-2 h-7 w-7 rounded-full bg-amber-200/80" />
        <div className="absolute top-3 -left-2 h-4 w-4 rounded-full bg-teal-200/90" />
        <Icon size={44} strokeWidth={1.6} className="relative" />
      </div>
      <h2 className="mt-7 text-[22px] text-neutral-900">{hub.heading}</h2>
      <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-neutral-600">
        {hub.text}
      </p>
      {hub.actions.length > 0 && (
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {hub.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() =>
                toast(action.toast, { description: action.description })
              }
              className={
                action.filled
                  ? "h-10 rounded-full bg-indigo-600 px-5 text-[14px] font-medium text-white active:bg-indigo-700"
                  : "h-10 rounded-full border border-neutral-300 px-5 text-[14px] font-medium text-indigo-700 active:bg-indigo-50"
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
