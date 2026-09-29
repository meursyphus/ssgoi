"use client";

import type { ReactNode } from "react";
import {
  FileText,
  Film,
  Heart,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/lib/link";
import { DragScroller } from "@/lib/components/drag-scroller";
import type {
  SearchCategory,
  SearchFace,
  SearchPlace,
} from "@/demo/google-photos/api/search";
import type { CollectionKind } from "@/demo/google-photos/api/collection";
import { BASE } from "@/demo/google-photos/page/shared/paths";

const CATEGORY_ICON: Partial<Record<CollectionKind, LucideIcon>> = {
  favorite: Heart,
  video: Film,
  screenshot: Smartphone,
  document: FileText,
};

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="px-4 pb-3 text-[16px] font-semibold text-neutral-900">
      {children}
    </h2>
  );
}

/** Face circles open the People & Pets grid (no hero — a face is a group). */
export function FaceRow({ faces }: { faces: SearchFace[] }) {
  return (
    <section className="pt-3">
      <SectionTitle>People & Pets</SectionTitle>
      <div className="flex justify-between px-5">
        {faces.map((f) => (
          <Link
            key={f.id}
            href={`${BASE}/c/${f.collectionId}`}
            scroll={false}
            className="flex w-[68px] flex-col items-center gap-2 active:opacity-70"
          >
            <img
              src={f.thumbSrc}
              alt=""
              width={68}
              height={68}
              className="h-[68px] w-[68px] rounded-full bg-neutral-100 object-cover"
            />
            <span className="text-[13px] text-neutral-800">{f.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function PlaceRow({ places }: { places: SearchPlace[] }) {
  return (
    <section className="pt-7">
      <SectionTitle>Places</SectionTitle>
      <DragScroller trackClassName="gap-2 px-4">
        {places.map((p) => (
          <Link
            key={p.id}
            href={`${BASE}/c/${p.collectionId}`}
            scroll={false}
            draggable={false}
            className="relative block h-[124px] w-[124px] shrink-0 overflow-hidden rounded-xl bg-neutral-100 active:opacity-80"
          >
            <img
              src={p.thumbSrc}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-2.5 text-[13px] font-medium text-white">
              {p.name}
            </span>
          </Link>
        ))}
      </DragScroller>
    </section>
  );
}

export function CategoryGrid({ categories }: { categories: SearchCategory[] }) {
  return (
    <section className="pt-7">
      <SectionTitle>Categories</SectionTitle>
      <div className="grid grid-cols-2 gap-3 px-4">
        {categories.map((c) => {
          const Icon = CATEGORY_ICON[c.kind] ?? Heart;
          return (
            <Link
              key={c.id}
              href={`${BASE}/c/${c.id}`}
              scroll={false}
              className="flex items-center gap-3 rounded-full bg-neutral-100 px-4 py-3 text-[13px] font-medium text-neutral-800 active:bg-neutral-200"
            >
              <Icon className="h-4 w-4 text-neutral-600" />
              {c.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
