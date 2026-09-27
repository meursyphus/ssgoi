/** Result sections of the site search, in their default display order. */
export type SearchGroup =
  | "docs"
  | "transitions"
  | "frameworks"
  | "demos"
  | "blog";

export type SearchKind = "page" | "section" | "demo";

export type SearchPlatform = "web" | "mobile" | "both";

/** A demo clip; its position in `SearchDoc.clips` is the `#clip-i` anchor. */
export type SearchClip = { title: string; transition: string };

export type SearchDoc = {
  group: SearchGroup;
  kind: SearchKind;
  title: string;
  /** "Route rules", "Configure", "Airbnb", a post title… */
  parent?: string;
  /** Unique; includes the #anchor for sections. */
  href: string;
  /** One-line snippet shown under the title. */
  text?: string;
  /** Matched but never shown: SEO copy, slug words, tags, packages. */
  terms?: string;
  /** Other names for the thing itself (유튜브, 카톡, gmail). */
  aliases?: string[];
  /** What people call a transition instead (bottom sheet, shared element). */
  synonyms?: string[];
  platform?: SearchPlatform;
  /** Demo app icon under /public. */
  icon?: string;
  transitions?: string[];
  clips?: SearchClip[];
};

export type SearchIndex = { v: 1; docs: SearchDoc[] };
