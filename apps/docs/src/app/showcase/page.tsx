import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL, breadcrumbSchema } from "@/lib/seo";
import { showcases } from "@/page/showcase/data";
import ShowcaseListPage from "@/page/showcase/list";

export const metadata: Metadata = {
  title: "Demos — Real apps rebuilt with SSGOI page transitions",
  description:
    "Live demos of Instagram, Pinterest, Airbnb, Google Photos and more — rebuilt on the web with native app-like page transitions powered by SSGOI.",
  alternates: { canonical: "/showcase" },
  openGraph: {
    title: "SSGOI Demos — Real apps rebuilt with page transitions",
    description:
      "Live demos of Instagram, Pinterest, Airbnb, Google Photos and more — rebuilt on the web with native app-like page transitions powered by SSGOI.",
    url: "/showcase",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SSGOI Demos",
  itemListElement: showcases.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/showcase/${s.slug}`,
    name: s.name,
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Demos", path: "/showcase" },
          ]),
          itemListSchema,
        ]}
      />
      <ShowcaseListPage />
    </>
  );
}
