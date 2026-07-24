import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, TransitionsBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Transitions — the thirteen built-in SSGOI transitions",
  description:
    "drill, fade, slide, axis, scroll, sheet, hero, zoom, strip, blind, film, rotate, jaemin. Each links to its variants, usage, live demos, and a self-contained .txt with the full API.",
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
        lead="Choose an effect, then attach it to an on, from/to, or ordered route rule."
      />
      <TransitionsBody />
    </>
  );
}
