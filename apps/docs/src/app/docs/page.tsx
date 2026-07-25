import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/lib/link";
import { JsonLd } from "@/components/json-ld";
import { PhoneFrame } from "@/components/phone-frame";
import { breadcrumbSchema, buildOpenGraph, faqSchema } from "@/lib/seo";
import { DocsHero } from "@/page/docs/sections";
import {
  ChromeMark,
  EdgeMark,
  FirefoxMark,
  SafariMark,
} from "@/components/browser-logos";
import {
  NextMark,
  NuxtMark,
  ReactRouterMark,
  SvelteKitMark,
} from "@/components/router-logos";

export const metadata: Metadata = {
  title: "Docs — Native app-like page transitions for mobile web apps",
  description:
    "Understand why SSGOI exists, add it in 2–3 files, choose a mobile transition, and go deeper only when your routing UX needs it.",
  alternates: { canonical: "/docs" },
  openGraph: buildOpenGraph({
    path: "/docs",
    title: "SSGOI Docs — Native app-like motion, without replacing your router",
    description:
      "Add route-aware, interruptible page transitions in 2–3 files, then grow into scroll restoration and persistent layouts when needed.",
  }),
};

const DOCS_FAQ = faqSchema([
  {
    question: "Which frameworks does SSGOI support?",
    answer:
      "SSGOI works with React (and Next.js), Svelte (and SvelteKit), Vue (and Nuxt), Solid (and SolidStart), Angular, and Qwik (with Qwik City). It is router-agnostic, so it works regardless of which router you use.",
  },
  {
    question: "How do SSGOI page transitions work?",
    answer:
      "A route-boundary key change unmounts the old region and mounts the new one. SSGOI preserves the detached leaving DOM node, temporarily reinserts it with position: absolute, and coordinates the OUT and IN phases according to the selected preset.",
  },
  {
    question:
      "Why does the SSGOI wrapper need the classes relative, z-0, and overflow-x-clip?",
    answer:
      "relative gives the absolutely positioned OUT page the correct containing block; z-0 creates a stacking context so it does not fall behind backgrounds; and overflow-x-clip prevents horizontal scrollbar flashes during slide, drill, and strip transitions.",
  },
]);

const DOCS_BREADCRUMB = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Docs", path: "/docs" },
]);

const WHY_SSGOI = [
  {
    eyebrow: "Router agnostic",
    title: "Keep the navigation you already have",
    body: "SSGOI observes a small route boundary. Your framework still owns URLs, history, SSR, data loading, and navigation.",
    href: "/docs/frameworks",
  },
  {
    eyebrow: "Small adoption surface",
    title: "Start by changing only 2–3 files",
    body: "Add one config, one provider, and one pathname boundary. Persistent layouts stay optional until the app actually needs them.",
    href: "/docs/install",
  },
  {
    eyebrow: "Web Animations API",
    title: "Precomputed springs, browser-native playback",
    body: "SSGOI computes spring motion up front, then hands keyframes to the browser. It also owns interruption and cleanup policy.",
    href: "/docs/why-ssgoi",
  },
  {
    eyebrow: "Beyond the View Transition API",
    title: "Own live DOM, runtime layers, and precise geometry",
    body: "Zoom, Film, and blur presets can measure real pages, keep outgoing media live, and create effect-only layers for you.",
    href: "/docs/view-transition-api",
  },
] as const;

const START_PATHS = [
  {
    title: "Set it up",
    body: "Install a framework package and wire the provider, shell, and route boundary.",
    href: "/docs/install",
    meta: "About 5 minutes",
  },
  {
    title: "Choose mobile motion",
    body: "Start with Drill, Sheet, Slide, or Zoom, then browse the full effect catalog.",
    href: "/docs/transitions",
    meta: "UX-first catalog",
  },
  {
    title: "Configure route behavior",
    body: "Learn on, except, from/to, ordered, priority, and automatic scroll policy.",
    href: "/docs/route-rules",
    meta: "When one rule is not enough",
  },
  {
    title: "Build persistent layouts",
    body: "Keep a bottom nav or header still while the routed content moves beneath it.",
    href: "/docs/nested-boundaries",
    meta: "Advanced routing",
  },
] as const;

const BROWSERS = [
  { name: "Chrome", icon: ChromeMark },
  { name: "Safari", icon: SafariMark },
  { name: "Firefox", icon: FirefoxMark },
  { name: "Edge", icon: EdgeMark },
] as const;

const ROUTERS = [
  { name: "Next.js", icon: NextMark },
  { name: "React Router", icon: ReactRouterMark },
  { name: "SvelteKit", icon: SvelteKitMark },
  { name: "Nuxt", icon: NuxtMark },
] as const;

export default function DocsOverviewPage() {
  return (
    <>
      <JsonLd data={[DOCS_FAQ, DOCS_BREADCRUMB]} />
      <DocsHero />

      <section className="mt-14">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-400">
            Why SSGOI
          </p>
          <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-neutral-100 md:text-3xl">
            Page transitions should add motion, not replace your architecture.
          </h2>
        </div>
        <div className="mt-7 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
          {WHY_SSGOI.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-[#0b0907] p-6 transition-colors hover:bg-white/[0.035]"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-orange-400">
                {item.eyebrow}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-neutral-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {item.body}
              </p>
              <span
                className="mt-5 inline-block text-sm text-neutral-500 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400"
                aria-hidden
              >
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-white/[0.06] pt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-400">
              Built for mobile web apps
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-100 md:text-3xl">
              Let navigation explain where the user went.
            </h2>
          </div>
          <Link
            href="/docs/transitions"
            className="shrink-0 text-sm text-neutral-400 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
          >
            Browse every transition →
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <TransitionPreview
            name="Drill"
            description="List to detail with clear spatial depth and a natural back direction."
            href="/docs/transitions/drill"
            src="/readme-drill.gif"
          />
          <TransitionPreview
            name="Sheet"
            description="Keep the origin in context while a focused task rises above it."
            href="/docs/transitions/sheet"
            src="/blog/view-transition-api-limitations/sheet-blur-full.gif"
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <EffectLink
            name="Slide"
            body="Ordered tabs, steps, and sibling screens."
            href="/docs/transitions/slide"
          />
          <EffectLink
            name="Zoom"
            body="A selected card unfolds into its detail route."
            href="/docs/transitions/zoom"
          />
        </div>
      </section>

      <section className="mt-16 border-t border-white/[0.06] pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-400">
              Compatibility
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-100">
              One motion layer across routers and browsers.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
              SSGOI depends on the broadly available Web Animations API. It
              observes the DOM lifecycle your framework already owns, so router
              behavior and SSR remain unchanged.
            </p>
            <div className="mt-7 grid grid-cols-4 gap-2">
              {BROWSERS.map(({ name, icon: Icon }) => (
                <div
                  key={name}
                  className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.015] px-2 py-4 text-center"
                >
                  <Icon className="h-8 w-8" />
                  <span className="truncate text-xs text-neutral-400">
                    {name}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/docs/compatibility"
              className="mt-6 inline-block text-sm text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400 hover:decoration-orange-400/60"
            >
              See compatibility details →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-3">
            {ROUTERS.map(({ name, icon: Icon }) => (
              <div
                key={name}
                className="flex min-w-0 flex-col items-center gap-2 rounded-xl px-2 py-4 text-center"
              >
                <Icon className="h-8 w-8" />
                <span className="text-xs leading-tight text-neutral-400">
                  {name}
                </span>
              </div>
            ))}
            <Link
              href="/docs/frameworks"
              className="col-span-2 rounded-xl border border-white/[0.06] px-3 py-2 text-center text-xs text-neutral-400 transition-colors hover:border-orange-400/30 hover:text-orange-400"
            >
              All framework guides →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-white/[0.06] pt-12">
        <div className="overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.08] via-[#0e0b08] to-[#0e0b08]">
          <div className="grid gap-7 p-7 sm:p-9 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-400">
                Why not the View Transition API?
              </p>
              <h2 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-neutral-100">
                SSGOI owns what reusable complex motion needs.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">
                The browser API is now broadly available and excellent for many
                page transitions. SSGOI keeps a separate engine for effects that
                need live outgoing DOM, runtime geometry, temporary layers,
                coordinated springs, and route-level interruption policy.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <Link
                  href="/docs/view-transition-api"
                  className="text-neutral-100 underline decoration-orange-400/40 underline-offset-4 hover:text-orange-400"
                >
                  See the concise comparison →
                </Link>
                <a
                  href="https://ssgoi.dev/blog/view-transition-api-limitations"
                  className="text-neutral-400 underline decoration-white/20 underline-offset-4 hover:text-neutral-100"
                >
                  Read the technical analysis ↗
                </a>
              </div>
            </div>
            <Image
              src="/blog/view-transition-api-limitations/film.gif"
              alt="Film transition moving two live pages through a runtime-generated viewfinder scene"
              width={640}
              height={360}
              unoptimized
              className="h-auto w-full rounded-2xl border border-white/[0.08]"
            />
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-white/[0.06] pt-12">
        <h2 className="text-xl font-semibold tracking-tight text-neutral-100">
          Continue by what you are building
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {START_PATHS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-semibold tracking-tight text-neutral-100">
                  {item.title}
                </span>
                <span
                  className="text-neutral-500 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400"
                  aria-hidden
                >
                  →
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {item.body}
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-neutral-600">
                {item.meta}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mt-16 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#16100b] via-[#0e0b08] to-[#0e0b08]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-orange-500/15 blur-3xl"
        />
        <div className="relative grid items-center gap-8 p-7 sm:p-9 md:grid-cols-[1fr_auto] md:gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-400">
              Production proof
            </p>
            <h2 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              Not a demo. <span className="text-orange-400">It ships.</span>
            </h2>
            <p className="mt-4 max-w-sm text-pretty leading-relaxed text-neutral-400">
              <span className="font-medium text-neutral-200">
                seoulbiyori.com
              </span>{" "}
              is a live travel guide for Seoul built on SSGOI. Open it and tap
              around — every screen change is a real production transition.
            </p>
            <a
              href="https://www.seoulbiyori.com"
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-[#0e0b08] transition-colors hover:bg-orange-400"
            >
              Open the live site
              <span
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                ↗
              </span>
            </a>
          </div>

          <div className="mx-auto md:mx-0">
            <PhoneFrame
              src="https://www.seoulbiyori.com"
              title="SSGOI in production — seoulbiyori.com"
              widthClassName="w-[280px] sm:w-[300px]"
            />
          </div>
        </div>
      </section>

      <aside className="mt-10 border-t border-white/[0.06] pt-8 text-sm text-neutral-500">
        Using a coding agent? Give it{" "}
        <a
          href="https://ssgoi.dev/llms.txt"
          className="font-mono text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          /llms.txt
        </a>
        . These pages stay focused on explaining the decisions to humans.{" "}
        <a
          href="https://github.com/meursyphus/ssgoi/blob/HEAD/LICENSE"
          target="_blank"
          rel="noreferrer"
          className="text-neutral-400 underline decoration-white/15 underline-offset-4 hover:text-orange-400"
        >
          MIT Licensed © MeurSyphus
        </a>
        .
      </aside>
    </>
  );
}

function TransitionPreview({
  name,
  description,
  href,
  src,
}: {
  name: string;
  description: string;
  href: string;
  src: string;
}) {
  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.015] sm:grid-cols-[minmax(0,1fr)_170px]"
    >
      <div className="flex flex-col justify-between p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-orange-400">
            Mobile preset
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-100">
            {name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            {description}
          </p>
        </div>
        <span className="mt-6 text-sm text-neutral-500 transition-all group-hover:translate-x-0.5 group-hover:text-orange-400">
          See usage and variants →
        </span>
      </div>
      <div className="flex max-h-[350px] items-start justify-center overflow-hidden bg-[#11100f] px-4 pt-4">
        <Image
          src={src}
          alt={`${name} page transition in a mobile web app`}
          width={360}
          height={696}
          unoptimized
          className="h-auto w-full max-w-[180px] rounded-t-[1.6rem] border-x border-t border-white/10"
        />
      </div>
    </Link>
  );
}

function EffectLink({
  name,
  body,
  href,
}: {
  name: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] px-5 py-4 transition-colors hover:border-white/15 hover:bg-white/[0.025]"
    >
      <span>
        <span className="font-mono font-semibold text-neutral-100 group-hover:text-orange-400">
          {name}
        </span>
        <span className="mt-1 block text-sm text-neutral-500">{body}</span>
      </span>
      <span
        className="text-neutral-600 group-hover:text-orange-400"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
