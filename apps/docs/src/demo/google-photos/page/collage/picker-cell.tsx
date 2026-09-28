"use client";

import { Check } from "lucide-react";
import type { PhotoSimple } from "@/demo/google-photos/state/photo";

/**
 * Selection circle used on cells and day headers: empty ring, or a filled
 * blue check once selected.
 */
export function SelectCircle({
  selected,
  onImage = false,
}: {
  selected: boolean;
  onImage?: boolean;
}) {
  if (selected) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A73E8] text-white ring-2 ring-white">
        <Check className="h-3 w-3" strokeWidth={3.5} />
      </span>
    );
  }
  return (
    <span
      className={
        onImage
          ? "block h-5 w-5 rounded-full border-2 border-white/90 bg-black/10 shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          : "block h-5 w-5 rounded-full border-2 border-neutral-300"
      }
    />
  );
}

export function PickerCell({
  photo,
  selected,
  onToggle,
}: {
  photo: PhotoSimple;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`Select photo from ${photo.takenAt}`}
      onClick={onToggle}
      className={`relative block aspect-square overflow-hidden transition-colors ${
        selected ? "bg-[#E8F0FE]" : "bg-neutral-100"
      }`}
    >
      <img
        src={photo.thumbSrc}
        alt={photo.takenAt}
        className={`h-full w-full object-cover transition-[transform,border-radius] duration-200 ease-out ${
          selected ? "scale-[0.84] rounded-xl" : "scale-100 rounded-none"
        }`}
      />
      <span className="absolute left-2 top-2">
        <SelectCircle selected={selected} onImage />
      </span>
    </button>
  );
}
