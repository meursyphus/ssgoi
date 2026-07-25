import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading, inlineCode } from "@/page/docs/ui";
import { LayoutBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Layout shell — the wrapper the leaving page is positioned against",
  description:
    "The element you wrap <Ssgoi> in needs a positioning context and horizontal clipping. Here is what to set, and what breaks when it is missing.",
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
          { name: "Layout shell", path: "/docs/layout" },
        ])}
      />
      <PageHeading
        title="Layout shell"
        lead={
          <>
            The element you wrap{" "}
            <code className={inlineCode}>&lt;Ssgoi&gt;</code> in needs a few
            classes, so the leaving page animates in place instead of jumping.
          </>
        }
      />
      <LayoutBody />
    </>
  );
}
