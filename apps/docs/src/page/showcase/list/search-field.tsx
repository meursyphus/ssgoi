"use client";

import Image from "next/image";
import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { Layers, Monitor, Smartphone, X } from "lucide-react";
import type {
  AppSuggestion,
  EffectSuggestion,
  ScreenSuggestion,
  Suggestion,
  SuggestionGroups,
} from "@/lib/search/catalog";
import type { ShowcasePlatform } from "../data";

export type SearchPill = {
  id: "effect" | "app";
  label: ReactNode;
  /** Spoken name for the remove button. */
  name: string;
};

/**
 * The catalog's search field: a combobox with removable filter pills and a
 * grouped suggestion list (effects, apps, screens). Arrow keys move, Enter
 * picks, Esc closes the list and then clears; IME composition is left
 * alone. Picking is the parent's job (`onPick`).
 */
export function SearchField({
  inputRef,
  value,
  onChange,
  pills,
  onRemovePill,
  groups,
  onPick,
  platform,
}: {
  inputRef: Ref<HTMLInputElement>;
  value: string;
  onChange: (next: string) => void;
  pills: SearchPill[];
  onRemovePill: (id: SearchPill["id"]) => void;
  groups: SuggestionGroups;
  onPick: (s: Suggestion) => void;
  platform: ShowcasePlatform;
}) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [lastValue, setLastValue] = useState(value);
  const localRef = useRef<HTMLInputElement | null>(null);

  // A new query starts with nothing highlighted: Enter keeps its plain
  // meaning until the user arrows into the list.
  if (value !== lastValue) {
    setLastValue(value);
    setActive(-1);
  }

  const sections = useMemo(() => {
    const out: { label: string; items: Suggestion[] }[] = [];
    if (groups.effects.length)
      out.push({ label: "Effects", items: groups.effects });
    if (groups.apps.length) out.push({ label: "Apps", items: groups.apps });
    if (groups.screens.length)
      out.push({ label: "Screens", items: groups.screens });
    return out;
  }, [groups]);
  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const count = flat.length;
  const expanded = open && count > 0;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const pick = (s: Suggestion) => {
    onPick(s);
    setActive(-1);
    // Keep typing on desktop; on touch put the keyboard away so the
    // filtered cards are visible.
    if (window.matchMedia("(hover: none)").matches) {
      setOpen(false);
      localRef.current?.blur();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!count) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => {
        const next = i < 0 ? (step > 0 ? 0 : count - 1) : i + step;
        return (next + count) % count;
      });
      return;
    }
    if (e.key === "Enter") {
      if (expanded && active >= 0 && flat[active]) {
        e.preventDefault();
        pick(flat[active]);
        return;
      }
      setOpen(false);
      if (window.matchMedia("(hover: none)").matches) e.currentTarget.blur();
      return;
    }
    if (e.key === "Escape") {
      if (expanded) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
        return;
      }
      if (value) {
        e.preventDefault();
        onChange("");
      } else if (pills.length) {
        e.preventDefault();
        for (const p of [...pills].reverse()) onRemovePill(p.id);
      }
      return;
    }
    if (
      e.key === "Backspace" &&
      pills.length &&
      e.currentTarget.selectionStart === 0 &&
      e.currentTarget.selectionEnd === 0
    ) {
      e.preventDefault();
      onRemovePill(pills[pills.length - 1].id);
      return;
    }
    if (e.key === "Tab") setOpen(false);
  };

  let index = 0;

  return (
    <div
      className="relative w-full"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      <label className="flex min-h-[52px] w-full flex-wrap items-center gap-x-2 gap-y-1.5 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-base shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-colors focus-within:border-orange-400/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(251,146,60,0.12)] hover:border-white/25">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="mr-1 h-5 w-5 shrink-0 text-neutral-300"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M20 20l-3-3" />
        </svg>
        {pills.map((pill) => (
          <span
            key={pill.id}
            className="inline-flex h-7 max-w-full shrink-0 items-center gap-1 rounded-full border border-orange-400/30 bg-orange-400/[0.08] pl-2.5 pr-1 text-xs font-medium text-orange-100"
          >
            <span className="truncate">{pill.label}</span>
            <button
              type="button"
              aria-label={`Remove ${pill.name} filter`}
              onClick={(e) => {
                e.preventDefault();
                onRemovePill(pill.id);
                localRef.current?.focus();
              }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-orange-200/70 transition-colors hover:bg-orange-400/15 hover:text-orange-50"
            >
              <X aria-hidden className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={(el) => {
            localRef.current = el;
            if (typeof inputRef === "function") inputRef(el);
            else if (inputRef) inputRef.current = el;
          }}
          type="search"
          role="combobox"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={
            expanded && active >= 0 ? optionId(active) : undefined
          }
          aria-autocomplete="list"
          enterKeyHint="search"
          aria-label="Search demos by app, effect or screen"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={
            pills.length ? "Add a filter…" : "Search — try “zoom” or “youtube”"
          }
          className="peer h-8 min-w-[8rem] flex-1 bg-transparent text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value || pills.length ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onChange("");
              for (const p of [...pills].reverse()) onRemovePill(p.id);
              localRef.current?.focus();
            }}
            className="-my-2 -mr-2 shrink-0 rounded-full px-2.5 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-100"
          >
            Clear
          </button>
        ) : (
          <kbd
            aria-hidden
            className="hidden h-6 min-w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] font-sans text-xs text-neutral-500 peer-focus:!hidden sm:inline-flex"
          >
            /
          </kbd>
        )}
      </label>

      {expanded && (
        <div
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          // Keep focus in the field while clicking a row.
          onMouseDown={(e) => e.preventDefault()}
          className="scrollbar-subtle absolute inset-x-0 top-full z-30 mt-2 max-h-[min(60vh,460px)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#141009]/95 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        >
          {sections.map((section, si) => (
            <div
              key={section.label}
              role="group"
              aria-labelledby={`${baseId}-group-${si}`}
            >
              <div
                id={`${baseId}-group-${si}`}
                className="px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-500"
              >
                {section.label}
              </div>
              {section.items.map((item) => {
                const i = index++;
                return (
                  <SuggestionRow
                    key={rowKey(item)}
                    id={optionId(i)}
                    item={item}
                    active={i === active}
                    platform={platform}
                    onHover={() => setActive(i)}
                    onPick={() => pick(item)}
                  />
                );
              })}
            </div>
          ))}
          <div className="hidden items-center gap-3 px-3 pb-1 pt-2 text-[11px] text-neutral-500 sm:flex">
            <span>↑↓ move</span>
            <span>↵ pick</span>
            <span>esc close</span>
          </div>
        </div>
      )}
    </div>
  );
}

function rowKey(s: Suggestion) {
  if (s.kind === "effect") return `e:${s.effect}`;
  if (s.kind === "app") return `a:${s.app.showcase.slug}`;
  return `s:${s.app.showcase.slug}:${s.screen.key}`;
}

function SuggestionRow({
  id,
  item,
  active,
  platform,
  onHover,
  onPick,
}: {
  id: string;
  item: Suggestion;
  active: boolean;
  platform: ShowcasePlatform;
  onHover: () => void;
  onPick: () => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      data-active={active || undefined}
      onPointerMove={onHover}
      onClick={onPick}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-1.5 data-[active]:bg-white/[0.07]"
    >
      {item.kind === "effect" ? (
        <EffectRow item={item} platform={platform} />
      ) : item.kind === "app" ? (
        <AppRow item={item} />
      ) : (
        <ScreenRow item={item} />
      )}
    </div>
  );
}

function EffectRow({
  item,
  platform,
}: {
  item: EffectSuggestion;
  platform: ShowcasePlatform;
}) {
  const elsewhere = item.total - item.here;
  return (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-400/10 text-orange-200">
        <Layers aria-hidden className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-neutral-100">
          {item.effect}
        </span>
        {item.synonyms.length > 0 && (
          <span className="block truncate text-xs text-neutral-500">
            {item.synonyms.join(" · ")}
          </span>
        )}
      </span>
      <span className="shrink-0 text-right text-xs tabular-nums text-neutral-400">
        {item.here} {item.here === 1 ? "demo" : "demos"}
        {elsewhere > 0 && (
          <span className="block text-[10px] text-neutral-600">
            +{elsewhere} {platform === "mobile" ? "web" : "mobile"}
          </span>
        )}
      </span>
    </>
  );
}

function AppRow({ item }: { item: AppSuggestion }) {
  const { showcase } = item.app;
  const Platform = item.platform === "web" ? Monitor : Smartphone;
  return (
    <>
      {showcase.logo ? (
        <Image
          src={showcase.logo}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-lg"
        />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-300 text-xs font-semibold text-neutral-900">
          {showcase.name[0]}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-neutral-100">
          {showcase.name}
        </span>
        <span className="block truncate text-xs text-neutral-500">
          {item.app.effects.join(" · ")}
        </span>
      </span>
      <Platform aria-hidden className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
    </>
  );
}

function ScreenRow({ item }: { item: ScreenSuggestion }) {
  const { screen, app } = item;
  return (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.05]">
        {app.showcase.logo ? (
          <Image
            src={app.showcase.logo}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 rounded-md"
          />
        ) : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-neutral-100">
          {screen.label}
        </span>
        <span className="block truncate text-xs text-neutral-500">
          {app.showcase.name} · {screen.originLabel} → {screen.toLabel}
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
        {screen.transition}
      </span>
    </>
  );
}
