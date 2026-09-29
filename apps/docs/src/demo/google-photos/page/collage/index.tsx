"use client";

import { useState } from "react";
import { Search, Maximize2 } from "lucide-react";
import type { PhotoSimple } from "@/demo/google-photos/state/photo";
import {
  CREATE_TOOLS,
  type CreateToolKey,
} from "@/demo/google-photos/page/shared/create-tools";
import { BASE } from "@/demo/google-photos/page/shared/paths";
import { useDemoBack } from "@/lib/hooks";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { notify } from "@/demo/google-photos/page/shared/notify";
import { PickerCell, SelectCircle } from "./picker-cell";

const SECTION_LABELS = ["Today", "Yesterday", "Thursday"] as const;

/**
 * Split the photo list into 3 day-buckets purely for layout — the screen is a
 * sheet effect showcase, so we don't bother with real grouping by `takenAt`.
 */
function bucket(photos: PhotoSimple[], perSection = 6): PhotoSimple[][] {
  return SECTION_LABELS.map((_, i) =>
    photos.slice(i * perSection, (i + 1) * perSection),
  );
}

/**
 * Photo picker shared by every Create tool (`?tool=` picks the copy and the
 * selection limits). Cancel and Create both dismiss back to the opener.
 */
export default function CollagePage({
  photos,
  tool: toolKey = "collage",
}: {
  photos: PhotoSimple[];
  tool?: CreateToolKey;
}) {
  const tool = CREATE_TOOLS[toolKey];
  const dismiss = useDemoBack(`${BASE}/create`);
  const [selected, setSelected] = useState<string[]>([]);
  const sections = bucket(photos);
  const count = selected.length;
  const canCreate = count >= tool.min && count <= tool.max;
  // Single-photo tools (Cinematic) swap the selection instead of adding to it,
  // so they get no select-the-whole-day circle.
  const single = tool.max === 1;

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else if (single) {
      setSelected([id]);
    } else if (count >= tool.max) {
      notify(`You can select up to ${tool.max} photos`);
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleDay = (items: PhotoSimple[]) => {
    const ids = items.map((p) => p.id);
    if (ids.every((id) => selected.includes(id))) {
      setSelected(selected.filter((id) => !ids.includes(id)));
      return;
    }
    const room = Math.max(0, tool.max - count);
    const added = ids.filter((id) => !selected.includes(id)).slice(0, room);
    if (added.length === 0) {
      notify(`You can select up to ${tool.max} photos`);
      return;
    }
    setSelected([...selected, ...added]);
  };

  const create = () => {
    if (!canCreate) return;
    notify(tool.done);
    dismiss();
  };

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      <header className="sticky top-0 z-30 bg-white pt-3 pb-2">
        <p className="text-center text-[13px] text-neutral-500">
          {count > 0 ? `${count} selected` : tool.hint}
        </p>
        <div className="mt-2 flex items-center justify-between px-4">
          <DemoBackLink
            fallback={`${BASE}/create`}
            className="text-[15px] font-medium text-neutral-700 active:opacity-60"
          >
            Cancel
          </DemoBackLink>
          <h1 className="text-[16px] font-semibold text-neutral-900">
            {tool.title}
          </h1>
          <button
            type="button"
            onClick={create}
            aria-disabled={!canCreate}
            className={`text-[15px] font-medium transition-colors ${
              canCreate
                ? "text-[#1A73E8] active:opacity-60"
                : "text-neutral-400"
            }`}
          >
            {tool.action}
          </button>
        </div>
        <div className="px-4 pt-3">
          <div className="flex h-11 items-center gap-2 rounded-full bg-neutral-100 px-4">
            <Search className="h-4 w-4 text-neutral-500" />
            <span className="text-[14px] text-neutral-500">
              Search your photos
            </span>
          </div>
        </div>
      </header>

      {/* Room for the last row to scroll clear of the floating button. */}
      <div className="flex-1 pb-safe-24">
        {sections.map((items, i) => {
          const allSelected =
            items.length > 0 && items.every((p) => selected.includes(p.id));
          return (
            <section key={SECTION_LABELS[i]} className="mt-5">
              {single ? (
                <h2 className="px-4 pb-3 text-[18px] font-semibold text-neutral-900">
                  {SECTION_LABELS[i]}
                </h2>
              ) : (
                <button
                  type="button"
                  aria-pressed={allSelected}
                  onClick={() => toggleDay(items)}
                  className="flex items-center gap-3 px-4 pb-3 text-left"
                >
                  <SelectCircle selected={allSelected} />
                  <h2 className="text-[18px] font-semibold text-neutral-900">
                    {SECTION_LABELS[i]}
                  </h2>
                </button>
              )}
              <div className="grid grid-cols-3 gap-[2px] bg-white">
                {items.map((p) => (
                  <PickerCell
                    key={p.id}
                    photo={p}
                    selected={selected.includes(p.id)}
                    onToggle={() => toggle(p.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Floats over the grid like the tab bar's pill (`sticky bottom-0 h-0`
          pins a zero-height anchor to the scroll viewport's bottom), above
          the home-indicator inset. */}
      <div className="pointer-events-none sticky bottom-0 z-20 h-0">
        <button
          type="button"
          aria-label="Resize"
          className="pointer-events-auto absolute right-4 bottom-[max(1.5rem,calc(var(--safe-bottom)+0.5rem))] flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-700 shadow-[0_4px_12px_rgba(0,0,0,0.18)] active:bg-neutral-100"
        >
          <Maximize2 className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
