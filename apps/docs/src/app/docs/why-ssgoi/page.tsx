import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { WhySsgoiBody } from "@/page/docs/guide-pages";

const path = "/docs/why-ssgoi";

export const metadata: Metadata = {
  title: "Why SSGOI — mobile route transitions without replacing your router",
  description:
    "Add native app-like mobile page transitions with two new files and one layout edit, keeping your router, with route boundaries and scroll behavior handled for you.",
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
      <PageHeading
        title="Why SSGOI"
        lead="Keep the router you have and give every navigation the sense of direction a native app has."
      />
      <WhySsgoiBody />
    </>
  );
}
