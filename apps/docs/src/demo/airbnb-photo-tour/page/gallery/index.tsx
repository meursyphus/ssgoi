"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePhoto, type PhotoTour } from "@/demo/airbnb-photo-tour/state/photo";
import { GalleryHeader } from "./gallery-header";
import { CategoryStrip } from "./category-strip";
import { CategorySection } from "./category-section";
export default function GalleryPage({
  initialData,
}: {
  initialData: PhotoTour;
}) {
  // SSR data is the source of truth — render from `initialData` directly so
  // SSR/CSR markup matches. Model sync is silent and only useful for any
  // future cross-page reads of the tour list.
  const photo = usePhoto((state) => ({
    actions: state.actions,
  }));
  photo.actions.initTour(initialData);
  const { title, categories } = initialData;
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    refs.current[id] = el;
  }, []);
  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    const el = refs.current[id];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const id = (visible.target as HTMLElement).dataset.categoryId;
          if (id) setActiveId(id);
        }
      },
      {
        rootMargin: "-200px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    for (const [id, el] of Object.entries(refs.current)) {
      if (el) {
        el.dataset.categoryId = id;
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [categories.length]);
  return (
    <div className="block h-full overflow-y-auto bg-white text-neutral-900">
      <GalleryHeader title={title} />
      <div className="mx-auto max-w-[1200px]">
        <CategoryStrip
          categories={categories}
          activeId={activeId}
          onSelect={handleSelect}
        />
        <div className="pb-24">
          {categories.map((c) => (
            <CategorySection
              key={c.id}
              category={c}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
