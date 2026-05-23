"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Back"
      className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur active:bg-white"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
