import { listing } from "@/demo/air-bnb/api/listing";
import ListingDetailPage from "@/demo/air-bnb/page/listing-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await listing.find(id);
  return <ListingDetailPage initialData={data} />;
}
