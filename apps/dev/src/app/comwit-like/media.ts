export const ITEM_COUNT = 60;

/** Inline SVG so the fixture needs no network and every image decodes at once. */
export function itemImage(id: number): string {
  const hue = (id * 47) % 360;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>` +
    `<rect width='400' height='400' fill='hsl(${hue} 60% 40%)'/>` +
    `<circle cx='200' cy='200' r='120' fill='hsl(${(hue + 60) % 360} 70% 60%)'/>` +
    `<text x='200' y='225' font-size='96' text-anchor='middle' fill='white' font-family='sans-serif'>${id}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
