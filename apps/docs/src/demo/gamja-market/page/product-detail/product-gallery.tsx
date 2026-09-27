import { Link } from "@/lib/link";
import type { ProductImage } from "@/demo/gamja-market/state/product";
import { routes } from "@/demo/gamja-market/page/shared/routes";

export function ProductGallery({
  productId,
  images,
  alt,
}: {
  productId: string;
  images: ProductImage[];
  alt: string;
}) {
  const cover = images[0];
  return (
    <Link
      href={routes.photos(productId)}
      scroll={false}
      aria-label="사진 크게 보기"
      className="relative block aspect-square w-full bg-neutral-100"
    >
      {/* Zoom source for the full-screen photo viewer. */}
      <img
        src={cover.src}
        alt={alt}
        width={cover.width}
        height={cover.height}
        className="h-full w-full object-cover"
        data-zoom-exit-key={productId}
      />
      {images.length > 1 ? (
        <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
          1 / {images.length}
        </div>
      ) : null}
    </Link>
  );
}
