import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { PageHeading } from "@/page/docs/ui";
import { FrameworkDetailBody } from "@/page/docs/framework-detail";
import {
  FRAMEWORK_DOCS,
  LEGACY_FRAMEWORK_PATHS,
  getFrameworkDoc,
  getLegacyFrameworkPath,
} from "@/page/docs/frameworks-data";

type Params = { framework: string };

export function generateStaticParams(): Params[] {
  return [
    ...FRAMEWORK_DOCS.map((doc) => ({ framework: doc.slug })),
    ...Object.keys(LEGACY_FRAMEWORK_PATHS).map((framework) => ({ framework })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { framework } = await params;
  const alias = getLegacyFrameworkPath(framework);
  const doc = getFrameworkDoc(
    alias ? alias.split("/").at(-1)!.split("#")[0] : framework,
  );
  if (!doc) return {};

  const path = `/docs/frameworks/${doc.slug}`;
  // Lead with the phrase people search for ("Next.js page transitions"), not
  // the library name; the router names are what most of those searches use.
  const kind = doc.slug === "react-native" ? "screen" : "page";
  const routers = new Intl.ListFormat("en", { type: "conjunction" }).format(
    doc.routers.map((router) => router.name),
  );
  return {
    title: `${doc.name} ${kind} transitions for ${routers}`,
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
  const alias = getLegacyFrameworkPath(framework);
  if (alias) permanentRedirect(alias);
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
