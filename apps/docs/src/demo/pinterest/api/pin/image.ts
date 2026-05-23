export function pinImageUrl(
  image: string,
  aspectRatio: string,
  width: number,
): string {
  const [arW, arH] = aspectRatio.split("/").map((s) => parseInt(s.trim(), 10));
  if (!arW || !arH) return image;
  const height = Math.round((width * arH) / arW);
  return image.replace(/\/\d+\/\d+(?=$|\?)/, `/${width}/${height}`);
}
