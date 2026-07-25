import type { Metadata } from "next";
import { Link } from "@/lib/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import {
  CompatibilityBody,
  DocsPageHeading,
  RoutersBody,
} from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Compatibility — routers and browser support",
  description:
    "SSGOI keeps your existing router and runs its core transition engine through the broadly available Web Animations API.",
  alternates: { canonical: "/docs/compatibility" },
  openGraph: buildOpenGraph({ path: "/docs/compatibility" }),
};

export default function DocsCompatibilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Compatibility", path: "/docs/compatibility" },
        ])}
      />
      <DocsPageHeading
        title="Compatibility"
        lead={
          <>
            Keep your router and ship one transition model across modern
            browsers. SSGOI runs its core engine on the Web Animations API and
            does not require the View Transition API.
          </>
        }
      />

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
          Browser runtime
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Precomputed springs become browser-native keyframes; navigation and
          SSR remain outside the animation engine.
        </p>
        <CompatibilityBody />
      </section>

      <section className="mt-14 border-t border-white/[0.06] pt-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
          Routers and frameworks
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Router-agnostic means the integration follows your framework&apos;s
          existing route lifecycle instead of replacing it.
        </p>
        <RoutersBody />
        <p className="mt-6 font-mono text-xs leading-relaxed text-neutral-500">
          React · Svelte · Vue · Solid · Angular · Qwik · framework-agnostic
          @ssgoi/core
        </p>
        <Link
          href="/docs/frameworks"
          className="mt-6 inline-block text-sm text-neutral-300 underline decoration-white/20 underline-offset-4 hover:text-orange-400"
        >
          Open the framework guides →
        </Link>
      </section>

      <aside className="mt-14 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-6">
        <h2 className="font-semibold tracking-tight text-neutral-100">
          View Transition API support is no longer the dividing line
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
          The browser API is now broadly available. SSGOI keeps its own engine
          because reusable presets such as Zoom, Film, and Sheet blur need
          control over live DOM, measured geometry, runtime layers, and
          interruption policy.
        </p>
        <Link
          href="/docs/view-transition-api"
          className="mt-5 inline-block text-sm text-orange-300 underline decoration-orange-400/40 underline-offset-4 hover:text-orange-200"
        >
          Why SSGOI does not use it internally →
        </Link>
      </aside>
    </>
  );
}
