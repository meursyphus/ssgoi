"use client";

import { ArrowLeft, Search } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { Link } from "@/lib/link";
import { BASE, type Channel } from "../../mock-data";
import { MoreButton } from "../shared/action-sheet";

export function ChannelTopBar({ channel }: { channel: Channel }) {
  return (
    <header className="sticky top-0 z-20 flex h-12 items-center gap-1 bg-white px-1">
      <DemoBackLink
        fallback={BASE}
        aria-label="Back"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-neutral-100"
      >
        <ArrowLeft className="h-6 w-6" />
      </DemoBackLink>
      <h1 className="min-w-0 flex-1 truncate text-[18px] font-semibold">
        {channel.name}
      </h1>
      <Link
        href={`${BASE}/search`}
        scroll={false}
        aria-label="Search"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:bg-neutral-100"
      >
        <Search className="h-[22px] w-[22px]" />
      </Link>
      <MoreButton menu="channel" className="h-10 w-10 shrink-0" />
    </header>
  );
}
