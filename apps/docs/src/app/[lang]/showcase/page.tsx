import { ShowcaseGrid } from "@/components/showcase/showcase-grid";
import type { Metadata } from "next";
import { getServerTranslations } from "@/i18n/get-server-translations";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const t = await getServerTranslations(params.lang, "showcase");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <ShowcaseGrid />
    </div>
  );
}
