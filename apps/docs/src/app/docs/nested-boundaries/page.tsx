import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { NestedBoundariesBody } from "@/page/docs/nested-boundaries";

export const metadata: Metadata = {
  title: "Persistent layout boundaries",
  description:
    "Use pathname-based boundary keys to keep layouts mounted, slide inner tabs, and include or exclude bottom navigation from page transitions.",
  alternates: { canonical: "/docs/nested-boundaries" },
  openGraph: buildOpenGraph({ path: "/docs/nested-boundaries" }),
};

export default function DocsNestedBoundariesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Persistent boundaries", path: "/docs/nested-boundaries" },
        ])}
      />
      <DocsPageHeading
        eyebrow="For app shells"
        title="Persistent boundaries"
        lead="A boundary key decides which layout region remounts. Keep shells stable, remount inner content, and use one SSGOI provider."
      />
      <NestedBoundariesBody />
    </>
  );
}
