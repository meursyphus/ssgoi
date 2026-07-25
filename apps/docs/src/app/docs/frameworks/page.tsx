import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { FrameworksIndexBody } from "@/page/docs/guide-pages";

const path = "/docs/frameworks";

export const metadata: Metadata = {
  title: "Framework guides — Next.js, React, Svelte, Vue, Solid, Qwik, Angular",
  description:
    "Choose the SSGOI setup guide for Next.js, React Router, TanStack Router, SvelteKit, Nuxt, SolidStart, Qwik City, or Angular.",
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
      <DocsPageHeading
        title="Framework guides"
        lead="Pick the stack that owns your routed DOM. The transition config stays portable; the boundary wiring changes."
      />
      <FrameworksIndexBody />
    </>
  );
}
