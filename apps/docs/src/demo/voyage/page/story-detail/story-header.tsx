"use client";

import { useEffect, useState, type RefObject } from "react";
import { Bookmark, ChevronLeft, Share } from "lucide-react";
import { toast } from "sonner";
import { useStory, type StoryDetail } from "@/demo/voyage/state/story";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BASE } from "../shared/routes";

/** Height of the docked bar: py-3 around the 40px buttons. */
const BAR_HEIGHT = 64;

const button =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full text-neutral-900 transition-[background-color,box-shadow,transform] duration-200 active:scale-90";

function scrollParent(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
  }
  return null;
}

/**
 * Floating round controls over the cover (`h-0`, so the hero stays
 * full-bleed). Once the cover scrolls under them they dock into a solid bar
 * with the title, so they never sit on top of the article text.
 */
export function StoryHeader({
  story,
  heroRef,
}: {
  story: StoryDetail;
  heroRef: RefObject<HTMLDivElement | null>;
}) {
  const storyState = useStory((s) => ({
    current: s.current,
    actions: s.actions,
  }));
  const saved =
    storyState.current?.id === story.id
      ? storyState.current.saved
      : story.saved;
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setDocked(!entry.isIntersecting),
      { root: scrollParent(hero), rootMargin: `-${BAR_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroRef]);

  function share() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    // Bottom: a top toast would sit over these controls. mb-safe lifts it
    // clear of the home indicator.
    toast("Link copied", {
      duration: 1500,
      position: "bottom-center",
      className: "mb-safe",
    });
  }

  const tone = docked
    ? "bg-transparent"
    : "bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur";

  return (
    <div className="sticky top-0 z-20 h-0">
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 transition-colors duration-200 ${
          docked
            ? "border-neutral-200/80 bg-white/95 backdrop-blur-sm"
            : "border-transparent"
        }`}
      >
        {/* A story opens from any tab, Activity or another story: Back goes
            to whichever pushed it. On direct entry the feed replaces it, and
            the TABS → story pair zooms that swap backward. */}
        <DemoBackLink
          fallback={BASE}
          aria-label="Back"
          className={`${button} ${tone}`}
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </DemoBackLink>
        <span
          aria-hidden={!docked}
          className={`min-w-0 flex-1 truncate text-center text-[15px] font-semibold text-neutral-900 transition-opacity duration-200 ${
            docked ? "opacity-100" : "opacity-0"
          }`}
        >
          {story.title}
        </span>
        <button
          type="button"
          onClick={share}
          aria-label="Share story"
          className={`${button} ${tone}`}
        >
          <Share size={18} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          onClick={() => storyState.actions.toggleSave(story.id)}
          aria-label={saved ? "Remove from saved" : "Save story"}
          aria-pressed={saved}
          className={`${button} ${tone}`}
        >
          <Bookmark
            size={18}
            strokeWidth={2.25}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>
    </div>
  );
}
