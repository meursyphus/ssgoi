"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, type ReactNode } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { drill } from "@ssgoi/react/view-transitions";

const config: SsgoiConfig = {
  transitions: [
    {
      on: "/activity-next/**",
      transition: drill(),
    },
  ],
};

export function ActivityNextProvider({ children }: { children: ReactNode }) {
  return (
    <Ssgoi config={config}>
      <main className="min-h-dvh bg-neutral-950 text-white">{children}</main>
    </Ssgoi>
  );
}

export function ActivityRouteBoundary({
  label,
  otherHref,
  stableScope,
}: {
  label: string;
  otherHref: string;
  stableScope: boolean;
}) {
  const pathname = usePathname();
  const instanceId = useId();
  const [count, setCount] = useState(0);
  const [draft, setDraft] = useState("");

  return (
    <section
      key={stableScope ? "persistent-route-shell" : pathname}
      data-ssgoi-transition={pathname}
      data-activity-test={label}
      data-instance-id={instanceId}
      className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-gradient-to-br from-slate-950 via-indigo-950 to-neutral-950 p-8"
    >
      <p className="font-mono text-xs text-indigo-300">
        Next 16.3 cacheComponents ·{" "}
        {stableScope ? "stable key" : "pathname key"}
      </p>
      <h1 className="text-4xl font-bold">{label}</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-xs">
        <dt className="text-white/50">usePathname</dt>
        <dd data-current-pathname>{pathname}</dd>
        <dt className="text-white/50">instance</dt>
        <dd data-current-instance>{instanceId}</dd>
      </dl>
      <button
        type="button"
        onClick={() => setCount((value) => value + 1)}
        className="rounded-full border border-white/20 bg-white/10 px-5 py-2"
      >
        local clicks: <span data-local-count>{count}</span>
      </button>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="type, navigate, come back"
        aria-label={`${label} draft`}
        className="w-72 rounded-lg border border-white/20 bg-black/30 px-4 py-2 text-center"
      />
      <Link
        href={otherHref}
        className="rounded-full bg-indigo-500 px-6 py-3 font-semibold"
      >
        Navigate to the other page
      </Link>
      <nav className="flex gap-4 text-sm text-white/60">
        <Link href="/activity-next/keyed/a">keyed test</Link>
        <Link href="/activity-next/stable/a">stable-scope test</Link>
      </nav>
    </section>
  );
}
