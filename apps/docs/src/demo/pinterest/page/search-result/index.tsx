"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { usePin } from "@/demo/pinterest/state/pin";
import { ResultHeader } from "./header";
import { ChipRow } from "./chip-row";
import { ResultGrid } from "./result-grid";

export default function SearchResultPage({ query }: { query: string }) {
  const pinState = usePin((state) => ({ actions: state.actions }));

  useEffect(() => {
    pinState.actions.search(query);
  }, [pinState.actions, query]);

  return (
    <SsgoiTransition
      id={`/demo/pinterest/search/${query}`}
      className="flex min-h-full flex-col bg-black"
    >
      <ResultHeader query={query} />
      <ChipRow query={query} />
      <div className="flex-1 pb-6">
        <ResultGrid />
      </div>
    </SsgoiTransition>
  );
}
