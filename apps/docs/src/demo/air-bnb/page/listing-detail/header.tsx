"use client";

import { ArrowLeft, Share } from "lucide-react";
import { toast } from "sonner";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { SaveButton } from "@/demo/air-bnb/page/shared/save-button";
import { isListingSource, routes } from "@/demo/air-bnb/page/shared/routes";

async function shareListing(title: string) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  } catch {
    toast("Share this listing", { description: url });
  }
}

export function DetailHeader({ id, title }: { id: string; title: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4">
      {/* Goes back to whichever list opened the listing (skipping a closed
          checkout or photo tour); Explore when opened directly. */}
      <DemoBackLink
        fallback={routes.explore}
        match={isListingSource}
        aria-label="Back"
        className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
      >
        <ArrowLeft className="h-4 w-4" />
      </DemoBackLink>
      <div className="pointer-events-auto flex gap-2">
        <button
          type="button"
          onClick={() => shareListing(title)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-transform active:scale-90"
          aria-label="Share"
        >
          <Share className="h-4 w-4" />
        </button>
        <SaveButton listingId={id} variant="round" />
      </div>
    </div>
  );
}
