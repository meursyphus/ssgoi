import { Link } from "@/lib/link";
import { ArrowLeft, Heart, Share } from "lucide-react";

export function DetailHeader() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4">
      <Link
        href="/demo/air-bnb"
        scroll={false}
        className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
        aria-label="Back"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <div className="pointer-events-auto flex gap-2">
        <button
          type="button"
          disabled
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
          aria-label="Share"
        >
          <Share className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
          aria-label="Save"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
