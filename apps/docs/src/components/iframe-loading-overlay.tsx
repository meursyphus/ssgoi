import Image from "next/image";

type Variant = "light" | "dark";

type Props = {
  visible: boolean;
  variant?: Variant;
  /** Optional inline style — useful for top offset to clear a status/Chrome bar. */
  style?: React.CSSProperties;
};

/**
 * Overlay shown over an iframe until its `load` event fires.
 * Fades out smoothly once `visible` flips to false.
 */
export function IframeLoadingOverlay({
  visible,
  variant = "light",
  style,
}: Props) {
  const dark = variant === "dark";
  return (
    <div
      aria-hidden={!visible}
      style={style}
      className={
        "pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 " +
        (visible ? "opacity-100" : "opacity-0") +
        " " +
        (dark ? "bg-neutral-950" : "bg-white")
      }
    >
      <div className="flex items-center gap-2">
        <Image
          src="/ssgoi-logo.png"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 animate-pulse"
        />
        <span
          className={
            "text-[11px] font-semibold tracking-[0.22em] " +
            (dark ? "text-neutral-300" : "text-neutral-700")
          }
        >
          SSGOI
        </span>
      </div>
      <div
        className={
          "h-[2px] w-24 overflow-hidden rounded-full " +
          (dark ? "bg-white/10" : "bg-black/10")
        }
      >
        <div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-orange-400 to-amber-300"
          style={{ animation: "ssgoi-loader-slide 1.2s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}
