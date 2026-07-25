import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { ScrollRestorationBody } from "@/page/docs/guide-pages";

const path = "/docs/scroll-restoration";

export const metadata: Metadata = {
  title: "Scroll behavior — automatic reset and restore defaults",
  description:
    "How SSGOI decides whether a page comes back where you left it or starts at the top, and how one rule overrides that with preserveScroll.",
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
          { name: "Scroll behavior", path },
        ])}
      />
      <PageHeading
        title="Scroll behavior"
        lead="A page you go back to keeps its scroll position; a page you open fresh starts at the top."
      />
      <ScrollRestorationBody />
    </>
  );
}
