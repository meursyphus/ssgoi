import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { CoreOptionsBody } from "@/page/docs/core-options";

export const metadata: Metadata = {
  title: "Scroll & middleware — SSGOI's core options, explained",
  description:
    "How rule-local scroll restoration and middleware work underneath, and when to use them.",
  alternates: { canonical: "/docs/core-options" },
  openGraph: buildOpenGraph({ path: "/docs/core-options" }),
};

export default function DocsCoreOptionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Scroll & middleware", path: "/docs/core-options" },
        ])}
      />
      <DocsPageHeading
        title="Scroll & middleware"
        lead="Automatic scroll restoration and route middleware, explained from config to runtime."
      />
      <CoreOptionsBody />
    </>
  );
}
