"use client";

import { useState } from "react";
import { ImagePlus, Settings, X } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BASE } from "../../mock-data";
import { ShortsMark } from "../shared/brand";

const MODES = ["Video", "Shorts", "Live", "Post"];

export default function CreatePage() {
  const [mode, setMode] = useState("Shorts");

  return (
    <main className="absolute inset-0 min-h-[620px] overflow-hidden bg-black text-white">
      <img
        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&h=1600&q=85"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-65"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90" />

      <DemoBackLink
        fallback={BASE}
        aria-label="Close create screen"
        className="absolute left-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm"
      >
        <X className="h-6 w-6" />
      </DemoBackLink>

      <div className="absolute inset-x-0 bottom-safe-5 z-10 px-5 text-center">
        <ShortsMark className="mx-auto h-16 w-16 text-white" />
        <h1 className="mt-5 text-[24px] font-bold leading-8">
          Allow camera and microphone access to create a Short
        </h1>
        <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-5 text-white/80">
          You can change these permissions at any time in your device settings.
        </p>

        <div className="mt-7 space-y-3">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-neutral-950"
          >
            <ImagePlus className="h-5 w-5" />
            Add from library
          </button>
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white/15 text-[15px] font-semibold backdrop-blur-md"
          >
            <Settings className="h-5 w-5" />
            Open settings
          </button>
        </div>

        <div
          role="tablist"
          className="mt-7 flex items-center justify-center gap-1 text-[14px] font-semibold"
        >
          {MODES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              onClick={() => setMode(item)}
              className={`rounded-full px-4 py-2 transition-colors duration-200 ${
                mode === item ? "bg-white/20 text-white" : "text-white/45"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
