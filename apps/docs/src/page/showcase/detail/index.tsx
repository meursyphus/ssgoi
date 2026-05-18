import Link from "next/link";
import { findShowcase, githubUrl, type ShowcaseClip } from "../data";
import { ClipPlayer } from "./clip-player";

export default function ShowcaseDetailPage({ slug }: { slug: string }) {
  const showcase = findShowcase(slug);

  if (!showcase) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-24">
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
          Examples
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
          ← Back to examples
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-32 pt-10 sm:px-8">
      <Link
        href="/showcase"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm font-medium text-neutral-200 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Examples
      </Link>

      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            {showcase.category}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-100">
            {showcase.name}
          </h1>
          <p className="mt-2 max-w-xl text-neutral-400">{showcase.tagline}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="flex flex-wrap gap-2">
            {showcase.transitions.map((t) => (
              <span
                key={t}
                className="rounded-full border border-orange-400/30 bg-orange-400/[0.06] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-orange-200"
              >
                {t}
              </span>
            ))}
          </div>
          {showcase.sourcePath && (
            <a
              href={githubUrl(showcase.sourcePath)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-neutral-300 hover:border-white/25 hover:text-neutral-100"
            >
              <GithubIcon />
              <span>Source</span>
              <span className="font-mono text-neutral-500">
                {showcase.sourcePath}
              </span>
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </header>

      <section className="mt-10 flex flex-col items-center gap-y-12 sm:flex-row sm:flex-wrap sm:items-start sm:justify-start sm:gap-x-8">
        {showcase.clips.map((clip, i) => (
          <ClipPlayer
            key={`${clip.transition}-${i}`}
            clip={clip}
            demoOrigin={showcase.demoOrigin}
            platform={showcase.platforms[0] ?? "mobile"}
          />
        ))}
      </section>
    </main>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.94c-3.2.7-3.87-1.54-3.87-1.54-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.77 2.7 1.26 3.36.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.93 10.93 0 015.74 0c2.19-1.48 3.15-1.17 3.15-1.17.63 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.26 5.65.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

// re-export for type usage in test/mocks if needed
export type { ShowcaseClip };
