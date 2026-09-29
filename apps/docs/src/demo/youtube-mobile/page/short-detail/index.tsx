"use client";

import { ArrowLeft } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import { BASE, type MockShort } from "../../mock-data";
import { ShortPlayer } from "../shorts/short-player";

/**
 * /shorts/[id]: the tapped Short, full screen, grown out of its shelf card.
 * Every Short is on the Home shelf, so a deep link's back shrinks into it.
 */
export default function ShortDetailPage({ short }: { short: MockShort }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f0f0f]">
      <ShortPlayer
        short={short}
        zoomKey={`short-${short.id}`}
        toScreenEdge
        className="h-full"
        leading={
          <DemoBackLink
            fallback={BASE}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full active:bg-white/15"
          >
            <ArrowLeft className="h-6 w-6" />
          </DemoBackLink>
        }
      />
    </div>
  );
}
