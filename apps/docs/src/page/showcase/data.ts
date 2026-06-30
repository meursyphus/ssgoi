import { airBnbShowcase } from "@/demo/air-bnb/showcase";
import { airbnbPhotoTourShowcase } from "@/demo/airbnb-photo-tour/showcase";
import { gamjaMarketShowcase } from "@/demo/gamja-market/showcase";
import { googlePhotosShowcase } from "@/demo/google-photos/showcase";
import { materialMailShowcase } from "@/demo/material-mail/showcase";
import { honeydropShowcase } from "@/demo/honeydrop/showcase";
import { instagramShowcase } from "@/demo/instagram/showcase";
import { kakaoTalkShowcase } from "@/demo/kakao-talk/showcase";
import { lumenShowcase } from "@/demo/lumen/showcase";
import { noraHaleShowcase } from "@/demo/nora-hale/showcase";
import { pinterestShowcase } from "@/demo/pinterest/showcase";
import { silentRoomShowcase } from "@/demo/silent-room/showcase";
import { ssgoiDocsShowcase } from "@/demo/ssgoi-docs/showcase";
import { voyageShowcase } from "@/demo/voyage/showcase";
import { youtubeMusicWebShowcase } from "@/demo/youtube-music-web/showcase";
import { yuzuClubShowcase } from "@/demo/yuzu-club/showcase";
import type { ShowcaseApp, ShowcaseClip } from "./types";

export type { ShowcaseApp, ShowcaseClip, ShowcasePlatform } from "./types";

/** GitHub tree URL prefix — paths in showcase data are repo-root-relative folders. */
export const GITHUB_BASE = "https://github.com/meursyphus/ssgoi/tree/latest";

export function githubUrl(path: string): string {
  return `${GITHUB_BASE}/${path.replace(/^\//, "")}`;
}

export const showcases: ShowcaseApp[] = [
  //mobile
  googlePhotosShowcase,
  airBnbShowcase,
  instagramShowcase,
  kakaoTalkShowcase,
  pinterestShowcase,
  gamjaMarketShowcase,
  materialMailShowcase,
  voyageShowcase,
  //web
  youtubeMusicWebShowcase,
  airbnbPhotoTourShowcase,
  lumenShowcase,
  yuzuClubShowcase,
  ssgoiDocsShowcase,
  silentRoomShowcase,
  honeydropShowcase,
  noraHaleShowcase,
];

export function findShowcase(slug: string): ShowcaseApp | undefined {
  return showcases.find((s) => s.slug === slug);
}

/** First showcase + clip demonstrating a given transition, in catalog order. */
export function representativeClip(
  transition: string,
): { showcase: ShowcaseApp; clip: ShowcaseClip } | undefined {
  for (const s of showcases) {
    const clip = s.clips.find((c) => c.transition === transition);
    if (clip) return { showcase: s, clip };
  }
  return undefined;
}

/** All transition names across the catalog, deduped, sorted. */
export function allTransitions(): string[] {
  const seen = new Set<string>();
  for (const s of showcases) for (const t of s.transitions) seen.add(t);
  return [...seen].sort();
}
