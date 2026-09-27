"use client";

import { Link } from "@/lib/link";
import {
  CREATE_TOOLS,
  pickerHref,
  type CreateToolKey,
} from "@/demo/google-photos/page/shared/create-tools";

const TOOL_KEYS: CreateToolKey[] = [
  "collage",
  "highlight",
  "cinematic",
  "animation",
];

/** Every tool opens the same photo picker, which rises as a sheet. */
export function ToolGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TOOL_KEYS.map((key) => {
        const { Icon, label, bg, fg } = CREATE_TOOLS[key];
        return (
          <Link
            key={key}
            href={pickerHref(key)}
            scroll={false}
            className="relative flex flex-col items-start gap-3 rounded-2xl bg-neutral-50 p-4 text-left active:bg-neutral-100"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}
            >
              <Icon className={`h-5 w-5 ${fg}`} />
            </span>
            <span className="text-[13px] font-medium text-neutral-900">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
