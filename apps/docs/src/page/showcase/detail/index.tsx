import Link from "next/link";
import { findShowcase } from "../data";

export default function ShowcaseDetailPage({ slug }: { slug: string }) {
  const showcase = findShowcase(slug);

  if (!showcase) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-24">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Showcase
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Not found
        </h1>
        <p className="mt-4 text-neutral-400">
          <code className="text-orange-400">{slug}</code> is not in the catalog
          yet.
        </p>
        <Link
          href="/showcase"
          className="mt-8 text-sm text-neutral-300 hover:text-neutral-100"
        >
          ← Back to showcase
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {showcase.category}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        {showcase.name}
      </h1>
      <p className="mt-3 max-w-xl text-neutral-400">{showcase.tagline}</p>
      {/* Detail layout (Mobbin app page style) will be designed in a separate pass. */}
    </main>
  );
}
