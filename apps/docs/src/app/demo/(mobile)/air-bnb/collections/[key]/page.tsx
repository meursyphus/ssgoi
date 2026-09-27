import { notFound } from "next/navigation";
import { listing } from "@/demo/air-bnb/api/listing";
import {
  CollectionPage,
  SavedCollectionPage,
} from "@/demo/air-bnb/page/collection";
import { SAVED_COLLECTION_KEY } from "@/demo/air-bnb/page/collection/keys";

export default async function Page({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  // The saved wishlist changes on the client (hearts), so it is only ever
  // read through the client query — never from this server module.
  if (key === SAVED_COLLECTION_KEY) return <SavedCollectionPage />;
  const data = await listing.findCollection(key).catch(() => null);
  if (!data) notFound();
  return <CollectionPage initialData={data} />;
}
