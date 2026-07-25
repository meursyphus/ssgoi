import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { ViewTransitionApiBody } from "@/page/docs/guide-pages";

const path = "/docs/view-transition-api";

export const metadata: Metadata = {
  title: "Why SSGOI doesn't use the View Transition API",
  description:
    "SSGOI owns the geometry, temporary visual layers, live outgoing DOM, and navigation policy needed to package complex motion as reusable presets.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function ViewTransitionApiPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "View Transition API", path },
        ])}
      />
      <DocsPageHeading
        title="Why SSGOI doesn't use the View Transition API"
        lead="The native API is capable and broadly available. SSGOI chooses a live DOM control model to package geometry, runtime layers, and navigation policy into reusable presets."
      />
      <ViewTransitionApiBody />
    </>
  );
}
