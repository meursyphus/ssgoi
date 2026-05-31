import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, LayoutBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Layout — the three classes on the SSGOI wrapper",
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
        eyebrow="For setup & debugging"
        title="Layout"
        lead="Three classes on the wrapper. Skim this when something looks off."
      />
      <LayoutBody />
    </>
  );
}
