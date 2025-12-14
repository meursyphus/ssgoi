import { HomePageContent } from "@/components/home";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  return <HomePageContent lang={lang} />;
}
