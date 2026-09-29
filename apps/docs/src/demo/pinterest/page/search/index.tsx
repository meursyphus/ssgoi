"use client";

import { useEffect, useState } from "react";
import { useCategory } from "@/demo/pinterest/state/category";
import { SearchInput } from "./search-input";
import { HeroBanner } from "./hero-banner";
import { RecommendedList } from "./recommended-list";
import { Suggestions } from "./suggestions";

export default function SearchPage() {
  const cat = useCategory((state) => ({
    actions: state.actions,
  }));
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    cat.actions.loadCategories();
  }, [cat.actions]);
  return (
    <div className="flex min-h-full flex-col bg-white">
      <SearchInput active={typing} onActiveChange={setTyping} />
      <div className="flex-1 pb-6">
        {typing ? (
          <Suggestions />
        ) : (
          <>
            <HeroBanner />
            <RecommendedList />
          </>
        )}
      </div>
    </div>
  );
}
