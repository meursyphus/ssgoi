"use client";

import { useEffect, useState } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { useListing } from "@/demo/air-bnb/state/listing";
import { routes } from "@/demo/air-bnb/page/shared/routes";
import { SearchHeader } from "./header";
import { WhereCard } from "./where-card";
import { WhenCard, type DateChoice } from "./when-card";
import { WhoCard } from "./who-card";
import { SearchBottomBar } from "./bottom-bar";

export default function SearchPage() {
  const listing = useListing((state) => ({
    destinations: state.destinations,
    actions: state.actions,
  }));
  const [text, setText] = useState("");
  const [dates, setDates] = useState<DateChoice | null>(null);
  const [guests, setGuests] = useState(0);

  useEffect(() => {
    listing.actions.searchDestinations(text);
  }, [text, listing.actions]);

  const results = listing.destinations.data;
  const target = routes.collection(results[0]?.key ?? "popular-seoul");

  return (
    <SsgoiRouteBoundary className="relative flex min-h-full w-full flex-col bg-[#F7F7F7]">
      <SearchHeader />
      <div className="flex-1 space-y-3 px-4 pb-6 pt-1">
        <WhereCard text={text} onTextChange={setText} results={results} />
        <WhenCard value={dates} onChange={setDates} />
        <WhoCard value={guests} onChange={setGuests} />
      </div>
      <SearchBottomBar
        href={target}
        onClear={() => {
          setText("");
          setDates(null);
          setGuests(0);
        }}
      />
    </SsgoiRouteBoundary>
  );
}
