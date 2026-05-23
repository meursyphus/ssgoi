import { order } from "@/demo/gamja-market/api/order";
import ReviewWritePage from "@/demo/gamja-market/page/review-write";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await order.find(id);
  return <ReviewWritePage initialData={data} />;
}
