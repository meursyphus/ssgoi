import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { FrameworkDetailBody } from "@/page/docs/framework-detail";
import { FRAMEWORK_DOCS, getFrameworkDoc } from "@/page/docs/frameworks-data";

type Params = { framework: string };

export function generateStaticParams(): Params[] {
  return FRAMEWORK_DOCS.map((doc) => ({ framework: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { framework } = await params;
  const doc = getFrameworkDoc(framework);
  if (!doc) return {};

  const path = `/docs/frameworks/${doc.slug}`;
  return {
    title: `SSGOI with ${doc.name} — setup and route boundary`,
    description: doc.lead,
    alternates: { canonical: path },
    openGraph: buildOpenGraph({ path }),
  };
}

export default async function FrameworkDocPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { framework } = await params;
  const doc = getFrameworkDoc(framework);
  if (!doc) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Frameworks", path: "/docs/frameworks" },
          { name: doc.name, path: `/docs/frameworks/${doc.slug}` },
        ])}
      />
      <PageHeading title={doc.name} lead={doc.lead} />
      <FrameworkDetailBody doc={doc} />
    </>
  );
}
