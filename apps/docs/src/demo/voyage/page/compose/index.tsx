"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDemoBack } from "@/lib/hooks";
import { BASE } from "../shared/routes";
import { ComposeBar } from "./compose-bar";
import { ComposeForm, type ComposeDraft } from "./compose-form";
import { ComposeToolbar, type ComposeTool } from "./compose-toolbar";

const SAMPLE_COVERS = [
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1100&q=80",
];
const SAMPLE_PLACES = ["Kyoto, Japan", "Lisbon, Portugal", "Banff, Canada"];
const EMOJIS = ["🌿", "☕️", "✈️", "🌅"];

/** Picks the entry after `current` in `list`, wrapping around. */
function next<T>(list: T[], current: T | null) {
  return list[(list.indexOf(current as T) + 1) % list.length];
}

export default function ComposePage() {
  // Publish dismisses the composer like Close: back to the feed that opened
  // it, so browser Back does not reopen an empty composer.
  const close = useDemoBack(BASE);
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState<ComposeDraft>({
    cover: null,
    location: null,
    title: "",
    body: "",
  });
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [titleMissing, setTitleMissing] = useState(false);

  // Warm the sample photos so "Add photo" swaps without a blank frame.
  useEffect(() => {
    for (const src of SAMPLE_COVERS) new Image().src = src;
  }, []);

  function update(patch: Partial<ComposeDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
    if (patch.title) setTitleMissing(false);
  }

  function appendToBody(text: string) {
    const body = draft.body;
    update({ body: body + text });
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  function onTool(tool: ComposeTool) {
    switch (tool) {
      case "photo":
        update({ cover: next(SAMPLE_COVERS, draft.cover) });
        break;
      case "location":
        update({ location: next(SAMPLE_PLACES, draft.location) });
        break;
      case "heading":
        appendToBody(
          `${draft.body && !draft.body.endsWith("\n") ? "\n\n" : ""}## `,
        );
        break;
      case "tag":
        appendToBody(
          `${draft.body && !draft.body.endsWith(" ") ? " " : ""}#slowtravel `,
        );
        break;
      case "emoji":
        appendToBody(EMOJIS[emojiIndex % EMOJIS.length]);
        setEmojiIndex((i) => i + 1);
        break;
    }
  }

  function publish() {
    if (!draft.title.trim()) {
      setTitleMissing(true);
      titleRef.current?.focus();
      return;
    }
    // Leaving /compose drops the sheet back over the feed (backward sheet).
    close();
    toast("Story published", { duration: 2500 });
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-white">
      <ComposeBar canPublish={draft.title.trim() !== ""} onPublish={publish} />
      <div className="flex-1">
        <ComposeForm
          draft={draft}
          onChange={update}
          titleRef={titleRef}
          titleMissing={titleMissing}
          bodyRef={bodyRef}
          sampleCover={SAMPLE_COVERS[0]}
          samplePlace={SAMPLE_PLACES[0]}
        />
      </div>
      <ComposeToolbar draft={draft} onTool={onTool} />
    </div>
  );
}
