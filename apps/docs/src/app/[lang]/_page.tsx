import { getServerTranslations } from "@/i18n";
import { Metadata } from "next";
import { createSEOMetadata } from "@/lib/seo-metadata";
import { HomePageContent } from "@/components/home";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getServerTranslations("metadata", lang);

  return createSEOMetadata(
    {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: `/${lang}`,
    },
    lang,
  );
}

export default async function Home({ params }: HomePageProps) {
  const { lang } = await params;

  return <HomePageContent lang={lang} />;
}
