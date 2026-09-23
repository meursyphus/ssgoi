import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { InstallBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Quick start — add SSGOI to your app",
  description:
    "One provider file, plus one edit to the layout you already have: write the config, import the route boundary, wire them into the layout, then check your first page transition. Copy-paste ready for React and Next.js.",
  alternates: { canonical: "/docs/install" },
  openGraph: buildOpenGraph({ path: "/docs/install" }),
};

export default function DocsInstallPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Quick start", path: "/docs/install" },
        ])}
      />
      <PageHeading
        title="Quick start"
        lead="One provider file, plus one edit to the layout you already have, and your first page transition runs."
      />
      <InstallBody />
    </>
  );
}
