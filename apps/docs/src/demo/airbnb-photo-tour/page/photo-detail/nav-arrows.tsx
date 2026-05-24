"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function NavArrows({
  prevId,
  nextId,
}: {
  prevId: string;
  nextId: string;
}) {
  return (
    <>
      <Link
        href={`/demo/airbnb-photo-tour/photos/${prevId}`}
        scroll={false}
        aria-label="이전 사진"
        className="absolute left-6 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-neutral-900 hover:bg-neutral-100"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <Link
        href={`/demo/airbnb-photo-tour/photos/${nextId}`}
        scroll={false}
        aria-label="다음 사진"
        className="absolute right-6 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-neutral-900 hover:bg-neutral-100"
      >
        <ArrowRight className="h-5 w-5" />
      </Link>
    </>
  );
}
