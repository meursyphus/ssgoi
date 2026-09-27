"use client";

import { ChevronLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";

export function FollowsHeader({
  username,
  fallbackHref,
}: {
  username: string;
  fallbackHref: string;
}) {
  return (
    <div className="flex h-12 items-center px-1">
      <DemoBackLink
        fallback={fallbackHref}
        aria-label="뒤로"
        className="grid h-10 w-10 place-items-center"
      >
        <ChevronLeft className="h-7 w-7" strokeWidth={1.8} />
      </DemoBackLink>
      <span className="flex-1 text-center text-[16px] font-bold">
        {username}
      </span>
      <div className="w-10" />
    </div>
  );
}
