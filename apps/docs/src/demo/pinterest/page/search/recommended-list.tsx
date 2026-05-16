"use client";

import { Loader2 } from "lucide-react";
import { useCategory } from "@/demo/pinterest/state/category";
import { CategoryCard } from "./category-card";

export function RecommendedList() {
  const cat = useCategory((state) => ({ categories: state.categories }));

  if (cat.categories.isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-neutral-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cat.categories.data.map((c) => (
        <CategoryCard key={c.label} category={c} />
      ))}
    </div>
  );
}
