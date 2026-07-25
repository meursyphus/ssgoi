import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { NestedBoundariesBody } from "@/page/docs/nested-boundaries";

export const metadata: Metadata = {
  title: "Persistent layouts — keep navigation still while routes move",
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
          {
            name: "Persistent layouts",
            path: "/docs/nested-boundaries",
          },
        ])}
      />
      <DocsPageHeading
        title="Persistent layouts"
        lead="Keep a bottom nav or header mounted for inner navigation, then move the whole shell only when the route leaves it."
      />
      <NestedBoundariesBody />
    </>
  );
}
