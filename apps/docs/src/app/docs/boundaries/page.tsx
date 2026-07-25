import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { BoundariesBody } from "@/page/docs/guide-pages";

const path = "/docs/boundaries";

export const metadata: Metadata = {
  title: "Route boundary basics — keys and transition ids",
  description:
    "Understand the two jobs of an SSGOI route boundary: the framework key that controls lifetime and the transition id matched by config rules.",
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
          { name: "Boundaries", path },
        ])}
      />
      <DocsPageHeading
        title="Route boundary basics"
        lead="The key controls framework lifetime. The transition id tells SSGOI which logical route is moving."
      />
      <BoundariesBody />
    </>
  );
}
