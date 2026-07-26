import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { ViewTransitionApiBody } from "@/page/docs/guide-pages";

const path = "/docs/view-transition-api";

export const metadata: Metadata = {
  title: "Why SSGOI doesn't use the View Transition API",
  description:
    "SSGOI animates the real leaving DOM so a preset can measure geometry, add temporary layers, and own interruption and scroll policy.",
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
          { name: "Why not View Transitions", path },
        ])}
      />
      <PageHeading
        title="Why not View Transitions"
        lead="Where the browser's View Transition API stops and SSGOI's presets begin."
      />
      <ViewTransitionApiBody />
    </>
  );
}
