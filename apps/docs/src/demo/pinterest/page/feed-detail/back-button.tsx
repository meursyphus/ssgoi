"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="뒤로"
      className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-black shadow-[0_2px_8px_rgba(0,0,0,0.18)] backdrop-blur"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={2.6} />
    </button>
  );
}
