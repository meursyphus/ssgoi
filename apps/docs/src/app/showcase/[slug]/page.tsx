import ShowcaseDetailPage from "@/page/showcase/detail";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ShowcaseDetailPage slug={slug} />;
}
