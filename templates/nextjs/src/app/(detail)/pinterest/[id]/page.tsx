import PinterestDetail from "@/components/pinterest/detail";

interface PinterestPageProps {
  params: Promise<{ id: string }>;
}

export default async function PinterestPage({ params }: PinterestPageProps) {
  const { id } = await params;
  return <PinterestDetail pinId={id} />;
}
