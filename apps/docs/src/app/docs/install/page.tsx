import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading, InstallBody } from "@/page/docs/sections";

export const metadata: Metadata = {
  title: "Install SSGOI — one package per framework",
  description:
    "Install SSGOI for React, Svelte, Vue, Solid, or Angular. One package per framework, same API across all of them.",
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
        title="Install"
        lead="Add the package that matches your framework. The API is identical across all of them."
      />
      <InstallBody />
    </>
  );
}
