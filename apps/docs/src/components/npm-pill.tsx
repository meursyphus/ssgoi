import { CopyPill } from "@/components/copy-pill";

/**
 * `sm` drops the `npm i` prefix: in a row of six packages the prefix is the
 * same six times over, and the clipboard still gets the whole command.
 */
export function NpmPill({
  pkg,
  size = "md",
}: {
  pkg: string;
  size?: "sm" | "md";
}) {
  return (
    <CopyPill value={`npm i ${pkg}`} label={`Copy: npm i ${pkg}`} size={size}>
      <span>
        {size === "md" && "npm i "}
        <span className="text-ink">{pkg}</span>
      </span>
    </CopyPill>
  );
}
