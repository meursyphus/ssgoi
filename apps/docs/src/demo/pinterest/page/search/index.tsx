"use client";

import { useEffect } from "react";
import { SsgoiTransition } from "@ssgoi/react";
import { useCategory } from "@/demo/pinterest/state/category";
import { SearchInput } from "./search-input";
import { HeroBanner } from "./hero-banner";
import { RecommendedList } from "./recommended-list";
import { BottomNav } from "../shared/bottom-nav";

export default function SearchPage() {
  const cat = useCategory((state) => ({ actions: state.actions }));

  useEffect(() => {
    cat.actions.loadCategories();
  }, [cat.actions]);

  return (
    <SsgoiTransition
      id="/demo/pinterest/search"
      className="flex min-h-full flex-col bg-white"
    >
      <SearchInput />
      <div className="flex-1 pb-6">
        <HeroBanner />
        <RecommendedList />
      </div>
      <BottomNav />
    </SsgoiTransition>
  );
}
