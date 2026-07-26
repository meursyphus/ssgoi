import { Link } from "@/lib/link";
import type { TransitionLabPreset, TransitionLabSide } from "./presets";

const SHARED_KEY = "transition-lab-editorial-cover";

type MarkerProps = {
  "data-hero-enter-key"?: string;
  "data-hero-exit-key"?: string;
  "data-zoom-enter-key"?: string;
  "data-zoom-exit-key"?: string;
};

function getMarkerProps(
  preset: TransitionLabPreset,
  side: TransitionLabSide,
): MarkerProps {
  if (preset.startsWith("hero-")) {
    return side === "a"
      ? { "data-hero-exit-key": SHARED_KEY }
      : { "data-hero-enter-key": SHARED_KEY };
  }

  if (preset.startsWith("zoom-")) {
    return side === "a"
      ? { "data-zoom-exit-key": SHARED_KEY }
      : { "data-zoom-enter-key": SHARED_KEY };
  }

  return {};
}

function EditorialArtwork({
  compact,
  markers,
}: {
  compact?: boolean;
  markers: MarkerProps;
}) {
  return (
    <div
      {...markers}
      className={[
        "relative isolate w-full overflow-hidden bg-[#d96b43]",
        compact ? "h-[218px] rounded-[22px]" : "h-[326px] rounded-[28px]",
      ].join(" ")}
    >
      <div
        aria-hidden
        className="absolute -right-[18%] -top-[18%] aspect-square w-[86%] rounded-full bg-[#f3bd69]"
      />
      <div
        aria-hidden
        className="absolute -left-[18%] bottom-[17%] h-[42%] w-[88%] rotate-[-9deg] rounded-[50%] bg-[#5b654a]"
      />
      <div
        aria-hidden
        className="absolute -bottom-[20%] right-[-14%] h-[58%] w-[100%] rotate-[8deg] rounded-[50%] bg-[#1e3b39]"
      />
      <div
        aria-hidden
        className="absolute inset-x-[14%] top-[13%] h-px bg-[#fff8e9]/60"
      />

      <div className="absolute inset-x-[14%] top-[17%] flex items-start justify-between text-[#fff8e9]">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em]">
          Vol. 07
        </span>
        <span className="text-[10px]">35.1796° N</span>
      </div>

      <div className="absolute inset-x-[14%] bottom-[13%] text-[#fff8e9]">
        <p
          className={[
            "font-serif leading-[0.86] tracking-[-0.05em]",
            compact ? "text-[31px]" : "text-[48px]",
          ].join(" ")}
        >
          Quiet
          <br />
          Coordinates
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-px w-7 bg-[#fff8e9]/70" aria-hidden />
          <span className="font-mono text-[8px] uppercase tracking-[0.18em]">
            Field notes
          </span>
        </div>
      </div>
    </div>
  );
}

function IndexScreen({
  preset,
  detailHref,
}: {
  preset: TransitionLabPreset;
  detailHref: string;
}) {
  const markers = getMarkerProps(preset, "a");

  return (
    <main className="relative h-full min-h-dvh overflow-hidden bg-[#f2eee5] px-4 pb-5 pt-4 text-[#1d1a17]">
      <div
        aria-hidden
        className="absolute -right-20 top-16 h-48 w-48 rounded-full bg-[#f1cfa8]/35 blur-3xl"
      />

      <header className="relative flex h-9 items-start justify-between border-b border-[#1d1a17]/10">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#1d1a17]/55">
          North Journal
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#b44d2f]">
          Issue 07
        </span>
      </header>

      <section className="relative pt-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#b44d2f]">
          Selected stories
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h1 className="font-serif text-[38px] leading-[0.9] tracking-[-0.04em]">
            Places that
            <br />
            move slowly.
          </h1>
          <span className="pb-1 text-[9px] leading-relaxed text-[#1d1a17]/45">
            04 / 2026
          </span>
        </div>
      </section>

      <section className="relative mt-5 grid grid-cols-2 gap-3">
        <Link
          href={detailHref}
          aria-label="Open Quiet Coordinates"
          className="group min-w-0 rounded-[24px] outline-none focus-visible:ring-2 focus-visible:ring-[#b44d2f]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2eee5]"
        >
          <EditorialArtwork compact markers={markers} />
          <div className="mt-2 flex items-start justify-between gap-2 px-1">
            <div>
              <h2 className="font-serif text-[17px] leading-none">
                Hushed terrain
              </h2>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.13em] text-[#1d1a17]/45">
                Read the field note
              </p>
            </div>
            <span
              aria-hidden
              className="text-[#b44d2f] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </div>
        </Link>

        <div className="min-w-0 pt-8">
          <div className="relative h-[164px] overflow-hidden rounded-[22px] bg-[#213a36]">
            <div
              aria-hidden
              className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full border-[24px] border-[#d8b76d]"
            />
            <div
              aria-hidden
              className="absolute right-4 top-5 h-16 w-px rotate-[26deg] bg-[#f3e8d5]/50"
            />
            <span className="absolute right-4 top-4 font-mono text-[8px] uppercase tracking-[0.16em] text-[#f3e8d5]">
              No. 18
            </span>
          </div>
          <h2 className="mt-2 px-1 font-serif text-[17px] leading-none">
            Evening forms
          </h2>
          <p className="mt-2 px-1 text-[10px] leading-relaxed text-[#1d1a17]/55">
            A study of light after the city quiets.
          </p>
        </div>
      </section>

      <footer className="absolute inset-x-4 bottom-4 flex items-center justify-between border-t border-[#1d1a17]/10 pt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-[#1d1a17]/45">
        <span>Independent observations</span>
        <span>Busan — Seoul</span>
      </footer>
    </main>
  );
}

function DetailScreen({
  preset,
  indexHref,
}: {
  preset: TransitionLabPreset;
  indexHref: string;
}) {
  const markers = getMarkerProps(preset, "b");

  return (
    <main className="relative h-full min-h-dvh overflow-hidden bg-[#161a18] px-4 pb-5 pt-4 text-[#f7efe2]">
      <header className="relative z-10 flex h-9 items-start justify-between border-b border-white/10">
        <Link
          href={indexHref}
          className="rounded-md font-mono text-[9px] uppercase tracking-[0.18em] text-[#f7efe2]/70 outline-none transition-colors hover:text-[#f7efe2] focus-visible:ring-2 focus-visible:ring-[#f3a266]/70"
        >
          ← Index
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#f3a266]">
          Field note 07
        </span>
      </header>

      <article className="pt-4">
        <EditorialArtwork markers={markers} />

        <div className="px-1 pt-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#f3a266]">
              Latitude of silence
            </p>
            <p className="font-mono text-[8px] tracking-[0.14em] text-[#f7efe2]/40">
              06 MIN
            </p>
          </div>
          <h1 className="mt-2 font-serif text-[34px] leading-[0.94] tracking-[-0.035em]">
            Where the landscape
            <br />
            learns to whisper.
          </h1>
          <p className="mt-3 max-w-[30rem] text-[11px] leading-[1.55] text-[#f7efe2]/58">
            We followed the first warm light beyond the harbor, collecting quiet
            forms, mineral colors, and the small rituals that make a place feel
            remembered.
          </p>
        </div>
      </article>

      <footer className="absolute inset-x-4 bottom-4 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-[#f7efe2]/38">
        <span>North Journal</span>
        <span>Words by Mira Han</span>
      </footer>
    </main>
  );
}

export function TransitionLabScreen({
  preset,
  side,
}: {
  preset: TransitionLabPreset;
  side: TransitionLabSide;
}) {
  const base = `/demo/transition-lab/${preset}`;

  return side === "a" ? (
    <IndexScreen preset={preset} detailHref={`${base}/b`} />
  ) : (
    <DetailScreen preset={preset} indexHref={`${base}/a`} />
  );
}
