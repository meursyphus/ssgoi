"use client";

import { SsgoiTransition } from "@ssgoi/react";
import type { HomeData } from "@/demo/youtube-music-web/api/song";
import { ChipBar } from "./chip-bar";
import { HeroRow } from "./hero-row";
import { Shelf } from "./shelf";

export default function HomePage({ initialData }: { initialData: HomeData }) {
  return (
    <SsgoiTransition
      id="/demo/youtube-music-web"
      className="h-full overflow-y-auto bg-[#030303] text-white"
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-4 pb-12 lg:px-10">
        <ChipBar />
        <HeroRow hero={initialData.hero} />
        <div className="mt-10 flex flex-col gap-10">
          {initialData.shelves.map((shelf) => (
            <Shelf key={shelf.id} shelf={shelf} />
          ))}
        </div>
      </div>
    </SsgoiTransition>
  );
}
