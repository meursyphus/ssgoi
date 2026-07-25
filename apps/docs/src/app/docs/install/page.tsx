import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, InstallBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Quick start — add SSGOI in 2–3 files",
  description:
    "Install SSGOI, wire the provider, layout shell, and route boundary, and verify your first page transition. Copy-paste ready for React and Next.js.",
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
          { name: "Install", path: "/docs/install" },
        ])}
      />
      <DocsPageHeading
        title="Quick start"
        lead="Change only 2–3 files, then verify. Copy each step as-is — understanding the internals comes later, if ever."
      />
      <InstallBody />
    </>
  );
}
