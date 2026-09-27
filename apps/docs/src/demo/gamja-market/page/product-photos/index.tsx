"use client";

import {
  useProduct,
  type ProductDetail,
} from "@/demo/gamja-market/state/product";
import { ViewerHeader } from "./viewer-header";
import { ViewerImage } from "./viewer-image";
import { ViewerCaption } from "./viewer-caption";

export default function ProductPhotosPage({
  initialData,
}: {
  initialData: ProductDetail;
}) {
  const product = useProduct((state) => ({ actions: state.actions }));
  product.actions.init(initialData);
  return (
    // Viewport-locked viewer: the photo is centred, nothing scrolls.
    <div className="relative flex h-full flex-col bg-black">
      <ViewerHeader
        productId={initialData.id}
        count={initialData.images.length}
      />
      <ViewerImage
        productId={initialData.id}
        image={initialData.images[0]}
        alt={initialData.name}
      />
      <ViewerCaption product={initialData} />
    </div>
  );
}
