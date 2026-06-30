"use client";

import { useState } from "react";
import { ImagePlus, MapPin, X } from "lucide-react";
import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";

const SAMPLE_COVER =
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1100&q=80";

export function ComposeForm() {
  const [cover, setCover] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="flex flex-col">
      {/* Cover photo */}
      <div className="px-5 pt-4">
        {cover ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100">
            <img
              src={cover}
              alt="Story cover"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setCover(null)}
              className="absolute right-2.5 top-2.5 rounded-full bg-black/55 p-1.5 text-white backdrop-blur active:scale-95"
              aria-label="Remove cover photo"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCover(SAMPLE_COVER)}
            className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 active:bg-neutral-100"
          >
            <ImagePlus size={26} strokeWidth={2} />
            <span className="text-[14px] font-medium">Add a cover photo</span>
          </button>
        )}
      </div>

      {/* Location */}
      <div className="px-5 pt-4">
        {location ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEFEF] px-3 py-1.5 text-[13px] font-semibold text-[#FF5A5F]">
            <MapPin size={14} strokeWidth={2.5} />
            {location}
            <button
              type="button"
              onClick={() => setLocation(null)}
              className="-mr-1 ml-0.5 rounded-full p-0.5 active:bg-[#FF5A5F]/15"
              aria-label="Remove location"
            >
              <X size={13} strokeWidth={3} />
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setLocation("Kyoto, Japan")}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-[13px] font-medium text-neutral-600 active:bg-neutral-100"
          >
            <MapPin size={14} strokeWidth={2.5} />
            Add location
          </button>
        )}
      </div>

      {/* Title */}
      <div className="px-5 pt-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your story a title"
          className="h-12 border-0 px-0 text-[20px] font-bold tracking-tight shadow-none placeholder:font-bold placeholder:text-neutral-300 focus-visible:ring-0"
        />
      </div>

      {/* Body */}
      <div className="px-5 pb-6">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share what made this trip unforgettable…"
          rows={12}
          className="min-h-[260px] resize-none border-0 px-0 text-[15px] leading-relaxed shadow-none placeholder:text-neutral-400 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
