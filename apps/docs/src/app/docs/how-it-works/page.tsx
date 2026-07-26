import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { HowItWorksBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "How it works — unmount, reinsert, and animate",
  description:
    "SSGOI keeps the real leaving node, puts it back with position: absolute while the new page mounts in place, animates both, then removes it.",
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
      <PageHeading
        title="How it works"
        lead="The page you just left is kept alive and animated out while the new one mounts in place."
      />
      <HowItWorksBody />
    </>
  );
}
