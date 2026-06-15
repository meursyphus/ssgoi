"use client";

import { Activity, useState } from "react";
import type { CSSProperties } from "react";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/react";
import { drill } from "@ssgoi/react/view-transitions";

/**
 * React `<Activity>` smoke test for ssgoi core — using the `drill` transition,
 * which (like most transitions) leaks inline styles onto the OUTGOING node
 * (pointer-events:none, z-index, …) and never resets them, because it assumes
 * that node is a throwaway clone. In hidden mode the outgoing node is the REAL
 * reused element, so those must be cleaned up or the page comes back
 * non-interactive / behind everything. The per-page click counters verify the
 * pages stay interactive after navigating back and forth.
 */

const A = "/activity/a";
const B = "/activity/b";

const config: SsgoiConfig = {
  transitions: drill({ enter: B, exit: A }),
};

const page = (bg: string): CSSProperties => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 16,
  background: bg,
  color: "white",
  fontSize: 24,
  fontWeight: 600,
});

const btn: CSSProperties = {
  padding: "8px 16px",
  borderRadius: 9999,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  fontSize: 16,
  cursor: "pointer",
};

const navBtn: CSSProperties = { ...btn, fontSize: 14 };

export default function ActivityTestPage() {
  const [active, setActive] = useState<"a" | "b">("a");
  const [draft, setDraft] = useState("");
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: 16,
          color: "#a3a3a3",
          fontSize: 14,
        }}
      >
        <button style={navBtn} onClick={() => setActive("a")}>
          Show A
        </button>
        <button style={navBtn} onClick={() => setActive("b")}>
          Show B
        </button>
        <button
          style={navBtn}
          onClick={() => setActive((p) => (p === "a" ? "b" : "a"))}
        >
          Toggle
        </button>
        <span style={{ marginLeft: "auto", fontFamily: "monospace" }}>
          active: {active}
        </span>
      </div>

      <Ssgoi config={config}>
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          <Activity mode={active === "a" ? "visible" : "hidden"}>
            <div data-ssgoi-transition={A} style={page("#1e3a8a")}>
              <span>Page A</span>
              <button style={btn} onClick={() => setCountA((c) => c + 1)}>
                A clicks: {countA}
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="type, then toggle"
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: "rgba(0,0,0,0.25)",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 400,
                  width: 220,
                  textAlign: "center",
                }}
              />
            </div>
          </Activity>

          <Activity mode={active === "b" ? "visible" : "hidden"}>
            <div data-ssgoi-transition={B} style={page("#7c2d12")}>
              <span>Page B</span>
              <button style={btn} onClick={() => setCountB((c) => c + 1)}>
                B clicks: {countB}
              </button>
            </div>
          </Activity>
        </div>
      </Ssgoi>
    </main>
  );
}
