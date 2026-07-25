import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { FrameworksIndexBody } from "@/page/docs/guide-pages";

const path = "/docs/frameworks";

export const metadata: Metadata = {
  title: "Frameworks — Next.js, React, Svelte, Vue, Solid, Qwik, Angular",
  description:
    "Pick the SSGOI setup guide for Next.js, React Router, TanStack Router, SvelteKit, Nuxt, SolidStart, Qwik City, or Angular.",
  alternates: { canonical: path },
  openGraph: buildOpenGraph({ path }),
};

export default function FrameworksPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Frameworks", path },
        ])}
      />
      <PageHeading
        title="Frameworks"
        lead="Find your stack and copy its setup: where the provider goes and how the boundary is keyed."
      />
      <FrameworksIndexBody />
    </>
  );
}
