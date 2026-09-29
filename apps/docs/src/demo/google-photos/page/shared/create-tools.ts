import {
  BookImage,
  Film,
  LayoutGrid,
  Play,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BASE } from "./paths";

export type CreateToolKey =
  | "collage"
  | "highlight"
  | "cinematic"
  | "animation"
  | "album"
  | "shared";

export type CreateTool = {
  key: CreateToolKey;
  label: string;
  Icon: LucideIcon;
  bg: string;
  fg: string;
  /** Picker header title */
  title: string;
  /** Picker hint shown until something is selected */
  hint: string;
  min: number;
  max: number;
  /** Picker confirm button */
  action: string;
  /** Toast after confirming */
  done: string;
};

export const CREATE_TOOLS: Record<CreateToolKey, CreateTool> = {
  album: {
    key: "album",
    label: "Album",
    Icon: BookImage,
    bg: "bg-[#E8F0FE]",
    fg: "text-[#1967D2]",
    title: "New album",
    hint: "Select photos",
    min: 1,
    max: 50,
    action: "Create",
    done: "Album created",
  },
  collage: {
    key: "collage",
    label: "Collage",
    Icon: LayoutGrid,
    bg: "bg-[#E8F0FE]",
    fg: "text-[#1A73E8]",
    title: "New collage",
    hint: "Select 1–6 photos",
    min: 1,
    max: 6,
    action: "Create",
    done: "Collage saved",
  },
  highlight: {
    key: "highlight",
    label: "Highlight video",
    Icon: Sparkles,
    bg: "bg-[#FCE8E6]",
    fg: "text-[#D93025]",
    title: "Highlight video",
    hint: "Select up to 50 photos & videos",
    min: 1,
    max: 50,
    action: "Create",
    done: "Highlight video saved",
  },
  cinematic: {
    key: "cinematic",
    label: "Cinematic photo",
    Icon: Film,
    bg: "bg-[#E6F4EA]",
    fg: "text-[#188038]",
    title: "Cinematic photo",
    hint: "Select 1 photo",
    min: 1,
    max: 1,
    action: "Create",
    done: "Cinematic photo saved",
  },
  animation: {
    key: "animation",
    label: "Animation",
    Icon: Play,
    bg: "bg-[#FEF7E0]",
    fg: "text-[#B06000]",
    title: "Animation",
    hint: "Select 2–50 photos",
    min: 2,
    max: 50,
    action: "Create",
    done: "Animation saved",
  },
  shared: {
    key: "shared",
    label: "Shared album",
    Icon: Users,
    bg: "bg-[#F3E8FD]",
    fg: "text-[#8430CE]",
    title: "Shared album",
    hint: "Select photos to share",
    min: 1,
    max: 50,
    action: "Share",
    done: "Shared album created",
  },
};

/** The plain /collage path stays the collage picker (showcase clip path). */
export function pickerHref(key: CreateToolKey): string {
  return key === "collage" ? `${BASE}/collage` : `${BASE}/collage?tool=${key}`;
}

export function toToolKey(value: unknown): CreateToolKey {
  return typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(CREATE_TOOLS, value)
    ? (value as CreateToolKey)
    : "collage";
}
