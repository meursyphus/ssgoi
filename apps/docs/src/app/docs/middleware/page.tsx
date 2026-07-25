import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { MiddlewareBody } from "@/page/docs/guide-pages";

const path = "/docs/middleware";

export const metadata: Metadata = {
  title: "Middleware — rewrite route ids before matching",
  description:
    "Strip locale prefixes, tenant slugs, and rewritten URLs before SSGOI matches a rule, so one set of rules covers every variant of a path.",
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
      <PageHeading
        title="Middleware"
        lead="Rewrite the path SSGOI matches on, so a locale or tenant prefix does not need its own rules."
      />
      <MiddlewareBody />
    </>
  );
}
