export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  return (
    <div className="relative aspect-square w-full bg-neutral-100">
      <img src={images[0]} alt={alt} className="h-full w-full object-cover" />
      {images.length > 1 ? (
        <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white">
          1 / {images.length}
        </div>
      ) : null}
    </div>
  );
}
