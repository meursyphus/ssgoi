import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { MigrationV8Body } from "@/page/docs/migration-v8";

const path = "/docs/migration-v8";

export const metadata: Metadata = {
  title: "Migrate to SSGOI 8.0 — every removed API and its replacement",
  description:
    "Upgrade from SSGOI 7.x to 8.0: replace router subpaths with <Ssgoi framework> and SsgoiLayoutBoundary, and update renamed preset options, hero markup and motion helpers.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function MigrationV8Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Migrate to 8.0", path },
        ])}
      />
      <PageHeading
        title="Migrate to 8.0"
        lead="Every API that 8.0 removes, what replaces it, and a before and after for each."
      />
      <MigrationV8Body />
    </>
  );
}
