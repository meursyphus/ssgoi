import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { TroubleshootingBody } from "@/page/docs/guide-pages";

const path = "/docs/troubleshooting";

export const metadata: Metadata = {
  title: "Troubleshooting — diagnose SSGOI route transitions",
  description:
    "Diagnose missing animations, wrong transition regions, layout jumps, flicker, and unexpected scroll before reading SSGOI engine internals.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function TroubleshootingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Troubleshooting", path },
        ])}
      />
      <DocsPageHeading
        title="Troubleshooting"
        lead="Check provider, markers, boundary ownership, the winning rule, and the layout shell—in that order."
      />
      <TroubleshootingBody />
    </>
  );
}
