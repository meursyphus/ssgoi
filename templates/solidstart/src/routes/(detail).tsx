import type { JSX } from "solid-js";
import { SsgoiLayoutBoundary } from "@ssgoi/solid";

export default function DetailLayout(props: { children?: JSX.Element }) {
  // Depth 1: one detail page replaces another.
  return (
    <SsgoiLayoutBoundary class="flex-1 bg-[#121212]">
      {props.children}
    </SsgoiLayoutBoundary>
  );
}
