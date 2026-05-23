import { airBnbShowcase } from "@/demo/air-bnb/showcase";
import { gamjaMarketShowcase } from "@/demo/gamja-market/showcase";
import { materialMailShowcase } from "@/demo/material-mail/showcase";
import { honeydropShowcase } from "@/demo/honeydrop/showcase";
import { instagramShowcase } from "@/demo/instagram/showcase";
import { kakaoTalkShowcase } from "@/demo/kakao-talk/showcase";
import { lumenShowcase } from "@/demo/lumen/showcase";
import { noraHaleShowcase } from "@/demo/nora-hale/showcase";
import { pinterestShowcase } from "@/demo/pinterest/showcase";
import { silentRoomShowcase } from "@/demo/silent-room/showcase";
import { ssgoiDocsShowcase } from "@/demo/ssgoi-docs/showcase";
import { youtubeMusicWebShowcase } from "@/demo/youtube-music-web/showcase";
import { yuzuClubShowcase } from "@/demo/yuzu-club/showcase";
import type { ShowcaseApp } from "./types";

export type { ShowcaseApp, ShowcaseClip, ShowcasePlatform } from "./types";

/** GitHub tree URL prefix — paths in showcase data are repo-root-relative folders. */
export const GITHUB_BASE = "https://github.com/meursyphus/ssgoi/tree/latest";

export function githubUrl(path: string): string {
  return `${GITHUB_BASE}/${path.replace(/^\//, "")}`;
}

export const showcases: ShowcaseApp[] = [
  instagramShowcase,
  pinterestShowcase,
  ssgoiDocsShowcase,
  youtubeMusicWebShowcase,
  lumenShowcase,
  yuzuClubShowcase,
  silentRoomShowcase,
  honeydropShowcase,
  noraHaleShowcase,
  kakaoTalkShowcase,
  airBnbShowcase,
  gamjaMarketShowcase,
  materialMailShowcase,
];

export function findShowcase(slug: string): ShowcaseApp | undefined {
  return showcases.find((s) => s.slug === slug);
}

/** All transition names across the catalog, deduped, sorted. */
export function allTransitions(): string[] {
  const seen = new Set<string>();
  for (const s of showcases) for (const t of s.transitions) seen.add(t);
  return [...seen].sort();
}
