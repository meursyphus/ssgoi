import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { TroubleshootingBody } from "@/page/docs/guide-pages";

const path = "/docs/troubleshooting";

export const metadata: Metadata = {
  title: "Troubleshooting — diagnose SSGOI route transitions",
  description:
    "Fix a transition that never runs, moves the wrong part of the page, jumps, flickers, or lands at the wrong scroll position.",
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
      <PageHeading
        title="Troubleshooting"
        lead="Work out why nothing moved, the wrong thing moved, or the page jumped."
      />
      <TroubleshootingBody />
    </>
  );
}
