import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { RouteRulesBody } from "@/page/docs/guide-pages";

const path = "/docs/route-rules";

export const metadata: Metadata = {
  title: "Route rules — on, except, from, to, and ordered",
  description:
    "Choose SSGOI transitions with on and except route scopes, precise from/to pairs, ordered route sets, path patterns, specificity, and priority.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function RouteRulesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Route rules", path },
        ])}
      />
      <DocsPageHeading
        title="Route rules"
        lead="Describe the navigation relationship once; SSGOI resolves matching, direction, and scroll defaults from it."
      />
      <RouteRulesBody />
    </>
  );
}
