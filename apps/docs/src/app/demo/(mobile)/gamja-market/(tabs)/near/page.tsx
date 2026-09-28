import { product } from "@/demo/gamja-market/api/product";
import NearPage from "@/demo/gamja-market/page/near";

export default async function Page() {
  const products = await product.findAll();
  return <NearPage products={products} />;
}
