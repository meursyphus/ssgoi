import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { WhySsgoiBody } from "@/page/docs/guide-pages";

const path = "/docs/why-ssgoi";

export const metadata: Metadata = {
  title: "Why SSGOI — mobile route transitions without replacing your router",
  description:
    "Adopt native app-like mobile page transitions in 2–3 files, with router-agnostic boundaries, automatic scroll behavior, and Web Animations API control.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function WhySsgoiPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Why SSGOI", path },
        ])}
      />
      <DocsPageHeading
        title="Why SSGOI"
        lead="Keep your router. Add a small boundary. Give each navigation a mobile-native spatial relationship."
      />
      <WhySsgoiBody />
    </>
  );
}
