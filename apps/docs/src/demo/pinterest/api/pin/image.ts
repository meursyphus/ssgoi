export function pinImageUrl(
  image: string,
  aspectRatio: string,
  width: number,
): string {
  const [arW, arH] = aspectRatio
    .split("/")
    .map((value) => Number(value.trim()));
  if (!arW || !arH) return image;
  const dimensions = pinImageDimensions(aspectRatio, width);
  return image.replace(
    /\/\d+\/\d+(?=$|\?)/,
    `/${dimensions.width}/${dimensions.height}`,
  );
}

export function pinImageDimensions(
  aspectRatio: string,
  width: number,
): { width: number; height: number } {
  const [arW, arH] = aspectRatio
    .split("/")
    .map((value) => Number(value.trim()));
  return arW && arH
    ? { width, height: Math.round((width * arH) / arW) }
    : { width, height: width };
}
