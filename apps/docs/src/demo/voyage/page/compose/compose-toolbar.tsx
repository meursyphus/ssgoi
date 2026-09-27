"use client";

import { Camera, MapPin, Smile, Hash, Heading } from "lucide-react";
import type { ComposeDraft } from "./compose-form";

export type ComposeTool = "photo" | "location" | "heading" | "tag" | "emoji";

const tools = [
  { id: "photo", icon: Camera, label: "Add photo" },
  { id: "location", icon: MapPin, label: "Add location" },
  { id: "heading", icon: Heading, label: "Heading" },
  { id: "tag", icon: Hash, label: "Add tag" },
  { id: "emoji", icon: Smile, label: "Add emoji" },
] as const;

export function ComposeToolbar({
  draft,
  onTool,
}: {
  draft: ComposeDraft;
  onTool: (tool: ComposeTool) => void;
}) {
  const filled: Partial<Record<ComposeTool, boolean>> = {
    photo: draft.cover !== null,
    location: draft.location !== null,
  };

  return (
    <div className="sticky bottom-0 z-10 flex items-center gap-1 border-t border-neutral-200/80 bg-white px-3 py-2">
      {tools.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTool(id)}
          // Keep the caret in the body while tapping formatting tools.
          onMouseDown={(e) => e.preventDefault()}
          className={`rounded-full p-2 transition-transform active:scale-90 active:bg-neutral-100 ${
            filled[id] ? "text-[#FF5A5F]" : "text-neutral-600"
          }`}
          aria-label={label}
        >
          <Icon size={19} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
