"use client";

import { useState } from "react";
import type { MockVideo } from "../../mock-data";

/** Title, views and the description that expands in place ("...more"). */
export function VideoInfo({ video }: { video: MockVideo }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="px-3 pt-3">
      <h1 className="line-clamp-2 text-[18px] font-bold leading-6">
        {video.title}
      </h1>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-1 block w-full text-left text-[12px] text-neutral-500"
      >
        {video.views} · {video.ago}{" "}
        <span className="font-semibold text-neutral-950">
          {expanded ? "Show less" : "...more"}
        </span>
      </button>
      {expanded && (
        <p className="mt-2 rounded-xl bg-neutral-100 p-3 text-[14px] leading-5">
          {video.description}
        </p>
      )}
    </section>
  );
}
