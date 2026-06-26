"use client";

import { Camera, MapPin, Smile, Hash, Heading } from "lucide-react";

const tools = [
  { icon: Camera, label: "Add photo" },
  { icon: MapPin, label: "Add location" },
  { icon: Heading, label: "Heading" },
  { icon: Hash, label: "Add tag" },
  { icon: Smile, label: "Add emoji" },
];

export function ComposeToolbar() {
  return (
    <div className="flex items-center gap-1 border-t border-neutral-200/80 bg-white px-3 py-2">
      {tools.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          className="rounded-full p-2 text-neutral-600 active:bg-neutral-100"
          aria-label={label}
        >
          <Icon size={19} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
