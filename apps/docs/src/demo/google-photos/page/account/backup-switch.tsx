"use client";

/** Material 3 style switch — track + thumb that grows when on. */
export function BackupSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-[52px] shrink-0 rounded-full border-2 transition-colors duration-200 ${
        checked
          ? "border-[#1A73E8] bg-[#1A73E8]"
          : "border-neutral-400 bg-neutral-100"
      }`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out ${
          checked
            ? "left-[22px] h-6 w-6 bg-white"
            : "left-[6px] h-4 w-4 bg-neutral-500"
        }`}
      />
    </button>
  );
}
