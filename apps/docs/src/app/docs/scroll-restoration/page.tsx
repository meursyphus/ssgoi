import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { ScrollRestorationBody } from "@/page/docs/guide-pages";

const path = "/docs/scroll-restoration";

export const metadata: Metadata = {
  title: "Scroll restoration — automatic reset and restore defaults",
  description:
    "See how SSGOI restores source pages, resets destination pages, handles ordered routes, and lets one rule override the policy with preserveScroll.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function ScrollRestorationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Scroll restoration", path },
        ])}
      />
      <DocsPageHeading
        title="Scroll restoration"
        lead="SSGOI chooses restore or reset from the matched UX relationship. Override it only when that default is wrong."
      />
      <ScrollRestorationBody />
    </>
  );
}
