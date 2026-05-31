import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import ShowcaseDetailPage from "@/page/showcase/detail";
import { findShowcase, showcases } from "@/page/showcase/data";

export function generateStaticParams() {
  return showcases.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const showcase = findShowcase(slug);

  if (!showcase) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const title = `${showcase.name} — ${showcase.category} page transitions on the web`;
  const description = `${showcase.tagline} See ${showcase.transitions.join(
    ", ",
  )} transitions from ${showcase.name}, rebuilt on the web with SSGOI.`;
  const url = `/showcase/${showcase.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: buildOpenGraph({
      type: "article",
      path: url,
      title: `${title} | SSGOI`,
      description,
    }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const showcase = findShowcase(slug);

  return (
    <>
      {showcase && (
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: showcase.name, path: `/showcase/${showcase.slug}` },
          ])}
        />
      )}
      <ShowcaseDetailPage slug={slug} />
    </>
  );
}
