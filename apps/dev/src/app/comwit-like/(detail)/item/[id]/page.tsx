import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { SsgoiPageBoundary } from "@ssgoi/react";
import { itemImage } from "../../../media";

/**
 * Like Comwit's showcase detail: the page boundary renders at once, the body
 * with the hero target sits behind a Suspense boundary on dynamic data. The
 * `ssgoi-delay` cookie (ms) stands in for a slow dynamic RSC chunk.
 */
export default function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <SsgoiPageBoundary className="min-h-dvh bg-neutral-950">
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-neutral-950/90 px-4 py-3 backdrop-blur">
        <Link href="/comwit-like/list" data-back="">
          ← Back
        </Link>
      </header>
      <Suspense fallback={<Skeleton />}>
        <Body params={params} />
      </Suspense>
    </SsgoiPageBoundary>
  );
}

function Skeleton() {
  return (
    <div data-skeleton="" className="p-4">
      <div className="aspect-square w-full animate-pulse rounded-none bg-neutral-800 md:aspect-video md:rounded-2xl" />
      <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-neutral-800" />
    </div>
  );
}

async function Body({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const delay = Number((await cookies()).get("ssgoi-delay")?.value ?? 0);
  if (delay > 0) await new Promise((r) => setTimeout(r, delay));
  const n = Number(id);
  return (
    <article data-body="" className="p-4">
      <div className="relative aspect-square w-full md:aspect-video">
        <img
          data-hero-enter-key={`card-${n}`}
          data-zoom-enter-key={`card-${n}`}
          src={itemImage(n)}
          alt=""
          className="absolute inset-0 h-full w-full rounded-none object-cover md:rounded-2xl"
        />
      </div>
      <h1 className="mt-4 text-2xl font-bold">Item {n}</h1>
      {Array.from({ length: 12 }, (_, i) => (
        <p key={i} className="mt-4 text-neutral-400">
          Body paragraph {i + 1} for item {n}. Long enough to make the detail
          page scroll on both viewports so returning to the list has to restore
          a different offset.
        </p>
      ))}
    </article>
  );
}
