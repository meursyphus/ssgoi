import type { Metadata } from "next";
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
    "SSGOI is router-agnostic (Next.js, React Router, TanStack, SvelteKit, Nuxt, Qwik City) and runs on every modern browser — Chrome 84+, Safari 13.1+, Firefox 75+, Edge 84+.",
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
            Use your router, ship to every browser. SSGOI runs on the Web
            Animations API — unlike View Transitions, which only Chrome
            supports.
          </>
        }
      />

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
          Routers
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Router-agnostic, SSR included.
        </p>
        <RoutersBody />
      </section>

      <section className="mt-14 border-t border-white/[0.06] pt-10">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
          Why not View Transitions?
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Two reasons. SSGOI answers both — on every browser below.
        </p>
        <CompatibilityBody />
      </section>
    </>
  );
}
