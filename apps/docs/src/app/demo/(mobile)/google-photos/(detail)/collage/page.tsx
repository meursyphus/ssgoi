import { photo } from "@/demo/google-photos/api/photo";
import CollagePage from "@/demo/google-photos/page/collage";
import { toToolKey } from "@/demo/google-photos/page/shared/create-tools";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string | string[] }>;
}) {
  const { tool } = await searchParams;
  const { items } = await photo.findAll();
  return <CollagePage photos={items} tool={toToolKey(tool)} />;
}
