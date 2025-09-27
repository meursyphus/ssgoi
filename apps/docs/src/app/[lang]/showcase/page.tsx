import { ShowcaseGrid } from "@/components/showcase/showcase-grid";
import type { Metadata } from "next";
import { getServerTranslations } from "@/i18n/get-server-translations";
import { SsgoiTransition } from "@/components/docs/ssgoi";
import { createSEOMetadata } from "@/lib/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getServerTranslations("showcase", lang);

  const metadata = createSEOMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
  });

  return metadata;
}

export default function ShowcasePage() {
  return (
    <SsgoiTransition className="page" id="/ssgoi/showcase">
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <ShowcaseGrid />
      </div>
    </SsgoiTransition>
  );
}
