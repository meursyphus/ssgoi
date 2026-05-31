import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, HowItWorksBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "How it works — clone & absolute, step by step",
  description:
    "SSGOI clones the leaving page and re-inserts it with position: absolute so the OUT animation plays while the new page mounts in place. Here is the full flow.",
  alternates: { canonical: "/docs/how-it-works" },
  openGraph: buildOpenGraph({ path: "/docs/how-it-works" }),
};

export default function DocsHowItWorksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "How it works", path: "/docs/how-it-works" },
        ])}
      />
      <DocsPageHeading
        title="How it works"
        lead="Clone & absolute. The mechanism behind every SSGOI transition."
      />
      <HowItWorksBody />
    </>
  );
}
