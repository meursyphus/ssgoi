import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { NestedBoundariesBody } from "@/page/docs/nested-boundaries";

export const metadata: Metadata = {
  title: "Persistent layouts — keep navigation still while routes move",
  description:
    "Key a boundary by the part of the path that should remount, so a shared shell stays mounted while the pages inside it move.",
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
      <PageHeading
        title="Persistent layouts"
        lead="Keep a bottom nav or header still while the pages under it change."
      />
      <NestedBoundariesBody />
    </>
  );
}
