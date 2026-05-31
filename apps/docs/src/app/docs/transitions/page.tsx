import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, TransitionsBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Transitions — the twelve built-in SSGOI transitions",
  description:
    "drill, fade, slide, scroll, sheet, hero, zoom, strip, blind, film, rotate, jaemin. Each transition links to a self-contained .txt with the full API.",
  alternates: { canonical: "/docs/transitions" },
  openGraph: buildOpenGraph({ path: "/docs/transitions" }),
};

export default function DocsTransitionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Transitions", path: "/docs/transitions" },
        ])}
      />
      <DocsPageHeading
        title="Transitions"
        lead="Twelve built-in transitions. Pick one, drop it into your config, and let the AI agent wire up the per-element keys."
      />
      <TransitionsBody />
    </>
  );
}
