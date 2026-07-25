import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, HowItWorksBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "How it works — unmount, reinsert, and animate",
  description:
    "SSGOI preserves the detached leaving page and temporarily reinserts it with position: absolute while the new page mounts in place.",
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
        lead="Unmount, reinsert, and animate. The lifecycle behind every SSGOI route transition."
      />
      <HowItWorksBody />
    </>
  );
}
