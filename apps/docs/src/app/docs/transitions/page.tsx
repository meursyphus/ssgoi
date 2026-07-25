import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { TransitionsCatalog } from "@/page/docs/transitions-catalog";

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
        lead="Start from the mobile interaction you are building, then open an effect for its variants, route config, and live demos."
      />
      <TransitionsCatalog />
    </>
  );
}
