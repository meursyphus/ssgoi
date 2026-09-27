import { product } from "@/demo/gamja-market/api/product";
import ProductPhotosPage from "@/demo/gamja-market/page/product-photos";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await product.find(id);
  return <ProductPhotosPage initialData={data} />;
}
