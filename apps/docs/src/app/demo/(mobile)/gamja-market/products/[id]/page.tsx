import { product } from "@/demo/gamja-market/api/product";
import ProductDetailPage from "@/demo/gamja-market/page/product-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await product.find(id);
  return <ProductDetailPage initialData={data} />;
}
