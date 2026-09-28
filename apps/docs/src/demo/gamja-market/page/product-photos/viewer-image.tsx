import type { ProductImage } from "@/demo/gamja-market/state/product";

export function ViewerImage({
  productId,
  image,
  alt,
}: {
  productId: string;
  image: ProductImage;
  alt: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      {/* The only zoom target on this page: the listing photo grows into it. */}
      <img
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        className="h-full w-full object-contain"
        data-zoom-enter-key={productId}
      />
    </div>
  );
}
