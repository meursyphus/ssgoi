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
        // The light variant keeps a literal white screen: it stands in for a
        // real phone display, not for a docs surface.
        (dark ? "bg-canvas" : "bg-white")
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
            "text-xs font-semibold " +
            (dark ? "text-ink-dim" : "text-ink-faint")
          }
        >
          SSGOI
        </span>
      </div>
      <div
        className={
          "h-[2px] w-24 overflow-hidden rounded-full " +
          (dark ? "bg-raised" : "bg-line/20")
        }
      >
        <div
          className="h-full w-1/3 rounded-full bg-ink-faint"
          style={{ animation: "ssgoi-loader-slide 1.2s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}
