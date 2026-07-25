import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { MiddlewareBody } from "@/page/docs/guide-pages";

const path = "/docs/middleware";

export const metadata: Metadata = {
  title: "Route middleware — normalize ids before matching",
  description:
    "Normalize locale prefixes, tenant slugs, and rewritten URLs before SSGOI route matching while keeping transition and scroll identity consistent.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function MiddlewarePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Middleware", path },
        ])}
      />
      <DocsPageHeading
        title="Route middleware"
        lead="Remove incidental URL structure once, before rules match and scroll state is recorded."
      />
      <MiddlewareBody />
    </>
  );
}
