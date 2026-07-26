import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { TransitionsCatalog } from "@/page/docs/transitions-catalog";

export const metadata: Metadata = {
  title: "Transitions — twelve documented SSGOI transitions",
  description:
    "drill, fade, slide, axis, scroll, sheet, hero, zoom, strip, film, rotate, jaemin. Each has its own page with variants, route config, published demos, and a self-contained .txt of the full API.",
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
      <PageHeading
        title="Transitions"
        lead="Twelve documented effects. Pick the one that matches the navigation you are building."
      />
      <TransitionsCatalog />
    </>
  );
}
