"use client";

import { SsgoiTransition } from "@ssgoi/react";
import type { HomeData } from "@/demo/youtube-music-web/api/song";
import { ChipBar } from "./chip-bar";
import { Shelf } from "./shelf";

export default function HomePage({ initialData }: { initialData: HomeData }) {
  return (
    <SsgoiTransition
      id="/demo/youtube-music-web"
      className="h-full overflow-y-auto bg-[#030303] text-white"
    >
      <div className="mx-auto max-w-[1280px] px-6 pt-3 pb-16 lg:px-10">
        <ChipBar />
        <div className="mt-6 flex flex-col gap-10">
          {initialData.shelves.map((shelf) => (
            <Shelf key={shelf.id} shelf={shelf} />
          ))}
        </div>
      </div>
    </SsgoiTransition>
  );
}
