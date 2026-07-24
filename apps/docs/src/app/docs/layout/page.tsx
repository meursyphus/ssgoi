import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, LayoutBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Layout shell — position and stack SSGOI's OUT page",
  description:
    "The element that wraps <Ssgoi> needs relative, z-0, and overflow-x-clip. Here is why each one matters when a transition looks off.",
  alternates: { canonical: "/docs/layout" },
  openGraph: buildOpenGraph({ path: "/docs/layout" }),
};

export default function DocsLayoutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Layout", path: "/docs/layout" },
        ])}
      />
      <DocsPageHeading
        eyebrow="Setup step 1"
        title="Layout shell"
        lead="Establish the OUT page's containing and stacking context before adding route boundaries."
      />
      <LayoutBody />
    </>
  );
}
