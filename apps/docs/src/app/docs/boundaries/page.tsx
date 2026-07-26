import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { BoundariesBody } from "@/page/docs/guide-pages";

const path = "/docs/boundaries";

export const metadata: Metadata = {
  title: "Route boundaries — keys and transition ids",
  description:
    "A route boundary does two jobs: the framework key decides when the page remounts, and the transition id is what config rules match on.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function BoundariesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Route boundaries", path },
        ])}
      />
      <PageHeading
        title="Route boundaries"
        lead="Mark each page so SSGOI can tell which one just left and which one arrived."
      />
      <BoundariesBody />
    </>
  );
}
