"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { HeroCard } from "./hero-card";
import { ToolGrid } from "./tool-grid";

export default function CreatePage() {
  return (
    <SsgoiTransition
      id="/demo/google-photos/create"
      className="block min-h-full bg-white"
    >
      <div className="space-y-6 px-4 py-4">
        <HeroCard />
        <section>
          <h2 className="mb-3 text-[18px] font-semibold text-neutral-900">
            My tools
          </h2>
          <ToolGrid />
        </section>
      </div>
    </SsgoiTransition>
  );
}
