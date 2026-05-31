import { Link } from "@/lib/link";
import { PhoneFrame } from "@/components/phone-frame";
import {
  NextMark,
  NuxtMark,
  ReactRouterMark,
  SvelteKitMark,
  TanStackRouterMark,
} from "@/components/router-logos";
import {
  ChromeMark,
  EdgeMark,
  FirefoxMark,
  SafariMark,
} from "@/components/browser-logos";
import { NpmPill } from "@/components/npm-pill";
import { SiteNav } from "@/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { softwareApplicationSchema } from "@/lib/seo";
export default function LandingPage() {
  return (
    <main data-ssgoi-transition="/" className="relative min-h-dvh bg-black">
      <JsonLd data={softwareApplicationSchema} />
      <SiteNav />
      <Hero />
      <Routers />
      <Compat />
      <Resources />
    </main>
  );
}
function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-8 lg:gap-16">
        <div className="order-2 md:order-1">
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Native page transitions{" "}
            <span className="text-orange-500">on the web.</span>
          </h1>
          <p className="mt-7 max-w-md text-balance text-base leading-relaxed text-neutral-400">
            Router-agnostic. Built on the Web Animations API — beyond what View
            Transitions can do.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-[#0e0b08] transition-colors hover:bg-orange-400"
            >
              Get started
            </Link>
            <NpmPill pkg="@ssgoi/react" />
          </div>
        </div>
        <div className="order-1 flex flex-col items-center gap-4 md:order-2 md:items-end">
          <PhoneFrame
            src="https://www.seoulbiyori.com"
            title="ssgoi in production — seoulbiyori.com"
          />
          <a
            href="https://www.seoulbiyori.com"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1.5 font-mono text-sm text-neutral-400 transition-colors hover:text-orange-400"
          >
            www.seoulbiyori.com
            <span
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
const ROUTERS: Array<{
  name: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}> = [
  {
    name: "Next.js",
    icon: NextMark,
  },
  {
    name: "React Router",
    icon: ReactRouterMark,
  },
  {
    name: "TanStack Router",
    icon: TanStackRouterMark,
  },
  {
    name: "SvelteKit",
    icon: SvelteKitMark,
  },
  {
    name: "Nuxt",
    icon: NuxtMark,
  },
];
const TEMPLATES_URL = "https://github.com/meursyphus/ssgoi/tree/main/templates";
function Routers() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Use your router.{" "}
          <span className="text-neutral-400">SSR included.</span>
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ROUTERS.map(({ name, icon: Icon }) => (
            <div
              key={name}
              className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <Icon className="h-9 w-9 shrink-0" />
              <span className="text-lg font-semibold tracking-tight text-neutral-100">
                {name}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-neutral-400">
          Starter examples for each router are on GitHub —{" "}
          <a
            href={TEMPLATES_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-neutral-200 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
          >
            /templates ↗
          </a>
        </p>
      </div>
    </section>
  );
}
const BROWSERS: Array<{
  name: string;
  v: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}> = [
  {
    name: "Chrome",
    v: "84+",
    icon: ChromeMark,
  },
  {
    name: "Safari",
    v: "13.1+",
    icon: SafariMark,
  },
  {
    name: "Firefox",
    v: "75+",
    icon: FirefoxMark,
  },
  {
    name: "Edge",
    v: "84+",
    icon: EdgeMark,
  },
];
function Compat() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Why not View Transitions?{" "}
          <span className="text-neutral-400">
            Two reasons. ssgoi answers both.
          </span>
        </h2>

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <ReasonCard
            title="Chrome-only"
            desc="Firefox and Safari users get a hard cut — no transition at all."
            ours="Every modern browser."
          />
          <ReasonCard
            title="CSS-locked"
            desc="Snapshots and declarative CSS. No physics, no interrupts, no multi-element choreography."
            ours="Web Animations API. Spring physics, interrupt-safe, paired hero transitions."
          />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BROWSERS.map(({ name, v, icon: Icon }) => (
            <div
              key={name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 text-center transition-colors hover:border-white/15 hover:bg-white/[0.03]"
            >
              <Icon className="h-12 w-12" />
              <div>
                <div className="text-base font-semibold text-neutral-100">
                  {name}
                </div>
                <div className="mt-1 font-mono text-sm text-orange-500">
                  {v}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function ReasonCard({
  title,
  desc,
  ours,
}: {
  title: string;
  desc: string;
  ours: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7">
      <h3 className="text-xl font-semibold tracking-tight text-neutral-100">
        {title}
      </h3>
      <p className="mt-3 leading-relaxed text-neutral-400">{desc}</p>
      <div className="mt-6 flex items-start gap-3 border-t border-white/[0.05] pt-5">
        <span className="mt-1 text-orange-500" aria-hidden>
          →
        </span>
        <p className="leading-relaxed text-neutral-100">{ours}</p>
      </div>
    </div>
  );
}
function Resources() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="flex flex-col items-start gap-8">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              See the transitions in action.
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-400">
              Interactive demos of real-world app patterns — Airbnb-style
              sheets, drill navigation, hero pairs.
            </p>
          </div>
          <Link
            href="/showcase"
            className="group inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-[#0e0b08] transition-colors hover:bg-orange-400"
          >
            Browse demos
            <span
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.05] pt-8 text-sm">
          <span className="text-neutral-500">Using an AI agent?</span>
          <a
            href="https://ssgoi.dev/llms.txt"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1 font-mono text-neutral-200 underline decoration-white/20 underline-offset-4 transition-colors hover:text-orange-400 hover:decoration-orange-400/60"
          >
            /llms.txt
            <span
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              ↗
            </span>
          </a>
          <span className="text-neutral-500">
            — single-file reference for LLMs.
          </span>
        </div>
      </div>
    </section>
  );
}
