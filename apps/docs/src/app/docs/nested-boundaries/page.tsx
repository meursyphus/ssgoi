import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { NestedBoundariesBody } from "@/page/docs/nested-boundaries";

export const metadata: Metadata = {
  title: "Nested boundaries — a bottom nav that survives tab moves",
  description:
    "Nest a second <Ssgoi> provider to keep a bottom tab bar still on tab↔tab transitions while it still drills away with the page on tab→detail.",
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
          { name: "Nested boundaries", path: "/docs/nested-boundaries" },
        ])}
      />
      <DocsPageHeading
        eyebrow="For app shells"
        title="Nested boundaries"
        lead="A bottom nav must ignore tab↔tab transitions but leave with the page on tab→detail. One provider can't do both — nest a second one."
      />
      <NestedBoundariesBody />
    </>
  );
}
