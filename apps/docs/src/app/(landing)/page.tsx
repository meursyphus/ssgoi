import Link from "next/link";
import { PhoneFrame } from "@/components/phone-frame";
import { NextMark, NuxtMark, SvelteKitMark } from "@/components/router-logos";
import {
  ChromeMark,
  EdgeMark,
  FirefoxMark,
  SafariMark,
} from "@/components/browser-logos";
import { NpmPill } from "@/components/npm-pill";

export default function LandingPage() {
  return (
    <main>
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
        <div className="order-1 flex justify-center md:order-2 md:justify-end">
          <PhoneFrame
            src="https://www.seoulbiyori.com"
            title="ssgoi in production — seoulbiyori.com"
          />
        </div>
      </div>
    </section>
  );
}

const ROUTERS: Array<{
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}> = [
  { name: "Next.js", icon: NextMark, iconClass: "text-neutral-100" },
  { name: "SvelteKit", icon: SvelteKitMark, iconClass: "text-orange-500" },
  { name: "Nuxt", icon: NuxtMark, iconClass: "text-emerald-400" },
];

function Routers() {
  return (
    <section className="border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Use your router.{" "}
          <span className="text-neutral-400">SSR included.</span>
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {ROUTERS.map(({ name, icon: Icon, iconClass }) => (
            <div
              key={name}
              className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <Icon className={`h-9 w-9 shrink-0 ${iconClass}`} />
              <span className="text-lg font-semibold tracking-tight text-neutral-100">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BROWSERS: Array<{
  name: string;
  v: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { name: "Chrome", v: "84+", icon: ChromeMark },
  { name: "Safari", v: "13.1+", icon: SafariMark },
  { name: "Firefox", v: "75+", icon: FirefoxMark },
  { name: "Edge", v: "84+", icon: EdgeMark },
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
      <div className="mx-auto grid max-w-6xl gap-3 px-6 py-20 md:grid-cols-2 md:py-24">
        <Link
          href="/showcase"
          className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8 transition-colors hover:border-orange-500/30 hover:bg-orange-500/[0.03]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-orange-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <rect x="3" y="4" width="7" height="7" rx="1.5" />
            <rect x="14" y="4" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight">
            Real apps, real transitions.
          </h3>
          <p className="mt-3 max-w-sm leading-relaxed text-neutral-400">
            See how shipped products use ssgoi — Airbnb-style sheets, drill
            navigation, hero pairs.
          </p>
          <span className="mt-7 inline-flex items-center gap-1.5 font-medium text-neutral-200 transition-colors group-hover:text-orange-400">
            Browse showcase{" "}
            <span
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </span>
        </Link>

        <a
          href="https://ssgoi.dev/llms.txt"
          target="_blank"
          rel="noreferrer"
          className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-8 transition-colors hover:border-orange-500/30 hover:bg-orange-500/[0.03]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-orange-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 9l3 3-3 3M12 15h5" strokeLinecap="round" />
          </svg>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight">
            Drop it into your AI agent.
          </h3>
          <p className="mt-3 max-w-sm leading-relaxed text-neutral-400">
            Single-file reference written for LLMs. Paste the URL and let your
            agent wire ssgoi up for you.
          </p>
          <span className="mt-7 inline-flex items-center gap-1.5 font-mono text-neutral-200 transition-colors group-hover:text-orange-400">
            /llms.txt{" "}
            <span
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              ↗
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
