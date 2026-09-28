"use client";

import type { RefObject } from "react";
import { motion } from "motion/react";
import { ImagePlus, MapPin, X } from "lucide-react";
import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";

export type ComposeDraft = {
  cover: string | null;
  location: string | null;
  title: string;
  body: string;
};

export function ComposeForm({
  draft,
  onChange,
  titleRef,
  titleMissing,
  bodyRef,
  sampleCover,
  samplePlace,
}: {
  draft: ComposeDraft;
  onChange: (patch: Partial<ComposeDraft>) => void;
  titleRef: RefObject<HTMLInputElement | null>;
  /** Publish was tapped without a title */
  titleMissing: boolean;
  bodyRef: RefObject<HTMLTextAreaElement | null>;
  sampleCover: string;
  samplePlace: string;
}) {
  return (
    <div className="flex flex-col">
      {/* Cover photo */}
      <div className="px-5 pt-4">
        {draft.cover ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100">
            <motion.img
              key={draft.cover}
              src={draft.cover}
              alt="Story cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange({ cover: null })}
              className="absolute right-2.5 top-2.5 rounded-full bg-black/55 p-1.5 text-white backdrop-blur active:scale-95"
              aria-label="Remove cover photo"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onChange({ cover: sampleCover })}
            className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 active:bg-neutral-100"
          >
            <ImagePlus size={26} strokeWidth={2} />
            <span className="text-[14px] font-medium">Add a cover photo</span>
          </button>
        )}
      </div>

      {/* Location */}
      <div className="px-5 pt-4">
        {draft.location ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEFEF] px-3 py-1.5 text-[13px] font-semibold text-[#FF5A5F]">
            <MapPin size={14} strokeWidth={2.5} />
            {draft.location}
            <button
              type="button"
              onClick={() => onChange({ location: null })}
              className="-mr-1 ml-0.5 rounded-full p-0.5 active:bg-[#FF5A5F]/15"
              aria-label="Remove location"
            >
              <X size={13} strokeWidth={3} />
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onChange({ location: samplePlace })}
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
          ref={titleRef}
          value={draft.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder={
            titleMissing ? "Add a title to publish" : "Give your story a title"
          }
          aria-label="Story title"
          aria-invalid={titleMissing || undefined}
          className={`h-12 border-0 px-0 text-[20px] font-bold tracking-tight text-neutral-900 shadow-none placeholder:font-bold focus-visible:ring-0 aria-invalid:ring-0 ${
            titleMissing
              ? "placeholder:text-[#FF5A5F]/70"
              : "placeholder:text-neutral-300"
          }`}
        />
      </div>

      {/* Body */}
      <div className="px-5 pb-6">
        <Textarea
          ref={bodyRef}
          value={draft.body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder="Share what made this trip unforgettable…"
          aria-label="Story"
          rows={12}
          className="min-h-[260px] resize-none border-0 px-0 text-[15px] leading-relaxed text-neutral-800 shadow-none placeholder:text-neutral-400 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
