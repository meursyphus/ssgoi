"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <Link
      href="/demo/pinterest"
      aria-label="뒤로"
      className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/45 text-white backdrop-blur"
    >
      <ArrowLeft className="h-5 w-5" strokeWidth={2.4} />
    </Link>
  );
}
