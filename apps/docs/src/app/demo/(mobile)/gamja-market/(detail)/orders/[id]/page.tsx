import { order } from "@/demo/gamja-market/api/order";
import OrderDetailPage from "@/demo/gamja-market/page/order-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Orders placed in this session exist only in the browser's copy of the mock
  // API; the page reads those from state, so a miss here is not an error.
  const data = await order.find(id).catch(() => null);
  return <OrderDetailPage id={id} initialData={data} />;
}
