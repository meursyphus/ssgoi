import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, buildOpenGraph } from "@/lib/seo";
import { DocsPageHeading } from "@/page/docs/sections";
import { TransitionDetailBody } from "@/page/docs/transition-detail";
import {
  TRANSITION_DOCS,
  getTransitionDoc,
} from "@/page/docs/transitions-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return TRANSITION_DOCS.map((t) => ({ transition: t.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ transition: string }>;
}): Promise<Metadata> {
  const { transition } = await params;
  const doc = getTransitionDoc(transition);
  if (!doc)
    return { title: "Not found", robots: { index: false, follow: true } };

  const path = `/docs/transitions/${doc.name}`;
  const variantList = doc.variants.map((v) => v.label).join(", ");
  return {
    title: `${doc.name} — page transition variants & usage | SSGOI`,
    description: `${doc.intro} Variants: ${variantList}.`,
    alternates: { canonical: path },
    openGraph: buildOpenGraph({ path }),
  };
}

export default async function DocsTransitionDetailPage({
  params,
}: {
  params: Promise<{ transition: string }>;
}) {
  const { transition } = await params;
  const doc = getTransitionDoc(transition);
  if (!doc) notFound();

  const path = `/docs/transitions/${doc.name}`;
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
          { name: "Transitions", path: "/docs/transitions" },
          { name: doc.name, path },
        ])}
      />
      <DocsPageHeading eyebrow="Transition" title={doc.name} lead={doc.intro} />
      <TransitionDetailBody doc={doc} />
    </>
  );
}
