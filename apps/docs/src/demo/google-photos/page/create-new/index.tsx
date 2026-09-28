"use client";

import { X } from "lucide-react";
import { Link } from "@/lib/link";
import {
  CREATE_TOOLS,
  pickerHref,
  type CreateToolKey,
} from "@/demo/google-photos/page/shared/create-tools";
import { BASE } from "@/demo/google-photos/page/shared/paths";
import { DemoBackLink } from "@/lib/components/demo-back-link";

const OPTIONS: CreateToolKey[] = [
  "album",
  "collage",
  "highlight",
  "cinematic",
  "animation",
  "shared",
];

/**
 * "Create new" sheet from the top bar's +. Every option opens the photo
 * picker, which rises as a second sheet over this one.
 */
export default function CreateNewPage() {
  return (
    <div className="block min-h-full bg-white pb-10">
      <header className="flex h-14 items-center gap-2 px-2">
        <DemoBackLink
          fallback={BASE}
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 active:bg-black/[0.05]"
        >
          <X className="h-5 w-5" />
        </DemoBackLink>
        <h1 className="text-[18px] font-medium text-neutral-900">Create new</h1>
      </header>
      <div className="grid grid-cols-2 gap-3 px-4 pt-2">
        {OPTIONS.map((key) => {
          const { Icon, label, bg, fg, hint } = CREATE_TOOLS[key];
          return (
            <Link
              key={key}
              href={pickerHref(key)}
              scroll={false}
              className="flex flex-col items-start gap-3 rounded-2xl bg-neutral-50 p-4 text-left active:bg-neutral-100"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}
              >
                <Icon className={`h-5 w-5 ${fg}`} />
              </span>
              <span>
                <span className="block text-[13px] font-medium text-neutral-900">
                  {label}
                </span>
                <span className="mt-0.5 block text-[12px] text-neutral-500">
                  {hint}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
