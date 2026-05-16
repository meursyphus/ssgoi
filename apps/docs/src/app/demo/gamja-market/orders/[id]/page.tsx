import { order } from "@/demo/gamja-market/api/order";
import OrderDetailPage from "@/demo/gamja-market/page/order-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await order.find(id);
  return <OrderDetailPage initialData={data} />;
}
