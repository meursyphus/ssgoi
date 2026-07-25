import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { RouteRulesBody } from "@/page/docs/guide-pages";

const path = "/docs/route-rules";

export const metadata: Metadata = {
  title: "Route rules — on, except, from, to, and ordered",
  description:
    "Pick SSGOI transitions with on and except scopes, from/to pairs, and ordered route sets, plus how path patterns, specificity, and priority resolve a winner.",
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
      <PageHeading
        title="Route rules"
        lead="Say which navigation gets which transition, and SSGOI works out the direction and scroll from that."
      />
      <RouteRulesBody />
    </>
  );
}
