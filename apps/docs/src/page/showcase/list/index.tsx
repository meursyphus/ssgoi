import { showcases } from "../data";

export default function ShowcaseListPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6 py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        Showcase
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        {showcases.length === 0
          ? "Catalog coming together."
          : `${showcases.length} showcases.`}
      </h1>
      <p className="mt-4 max-w-md text-neutral-400">
        Mobbin-style grid (mobile / web split, category tabs) will land here.
      </p>
    </main>
  );
}
