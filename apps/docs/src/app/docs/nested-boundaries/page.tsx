import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { NestedBoundariesBody } from "@/page/docs/nested-boundaries";

export const metadata: Metadata = {
  title: "Route boundaries — keys, ids, and persistent layouts",
  description:
    "Use named route-boundary resolvers to control React lifetime, keep layouts mounted, and include or exclude navigation from page transitions.",
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
          { name: "Route boundaries", path: "/docs/nested-boundaries" },
        ])}
      />
      <DocsPageHeading
        title="Route boundaries"
        lead="A key creates the unmount SSGOI observes; a route id selects the transition. Name each owned region once."
      />
      <NestedBoundariesBody />
    </>
  );
}
