import type { Metadata } from "next";
import { Link } from "@/lib/link";
import { JsonLd } from "@/components/json-ld";
import { PhoneFrame } from "@/components/phone-frame";
import { breadcrumbSchema, buildOpenGraph, faqSchema } from "@/lib/seo";
import { DocsHero } from "@/page/docs/sections";
import { DOCS_NAV } from "@/page/docs/nav";

export const metadata: Metadata = {
  title: "Docs — Setup, transitions, and how SSGOI works",
  description:
    "Install SSGOI, mark your pages, and pick from thirteen page transitions. Setup lives in plain-text llms.txt files your AI agent can read directly.",
  alternates: { canonical: "/docs" },
  openGraph: buildOpenGraph({
    path: "/docs",
    title: "SSGOI Docs — Setup, transitions, and how it works",
    description:
      "Install SSGOI, mark your pages, and pick from thirteen page transitions. Setup lives in plain-text llms.txt files your AI agent can read directly.",
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
      "A route-boundary key change unmounts the old region and mounts the new one. SSGOI preserves the detached leaving DOM node, temporarily reinserts it with position: absolute, and runs its OUT animation beside the incoming region's IN animation.",
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

const QUICK_LINKS = DOCS_NAV.flatMap((g) => g.items).filter(
  (i) => i.href !== "/docs",
);

export default function DocsOverviewPage() {
  return (
    <>
      <JsonLd data={[DOCS_FAQ, DOCS_BREADCRUMB]} />
      <DocsHero />

      <section className="relative mt-12 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#16100b] via-[#0e0b08] to-[#0e0b08]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-orange-500/15 blur-3xl"
        />
        <div className="relative grid items-center gap-8 p-7 sm:p-9 md:grid-cols-[1fr_auto] md:gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-orange-400/90">
              In production
            </p>
            <h2 className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
              Not a demo. <span className="text-orange-400">It ships.</span>
            </h2>
            <p className="mt-4 max-w-sm text-pretty leading-relaxed text-neutral-400">
              <span className="font-medium text-neutral-200">
                seoulbiyori.com
              </span>{" "}
              is a live travel guide for Seoul, built on SSGOI. Open it and tap
              around — every screen change is a real page transition, in
              production.
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
              title="ssgoi in production — seoulbiyori.com"
              widthClassName="w-[280px] sm:w-[300px]"
            />
          </div>
        </div>
      </section>

      <div className="mt-12">
        <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
          Start here
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map((item) => (
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
                {item.blurb}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
