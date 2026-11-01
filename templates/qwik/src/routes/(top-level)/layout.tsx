import { Slot, component$ } from "@builder.io/qwik";
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";
import { BottomNav } from "~/components/bottom-nav";

export default component$(() => {
  // Depth 1: only the tab content moves between tabs.
  const boundary = useSsgoiLayoutBoundary();

  return (
    <div class="flex-1 flex flex-col">
      <div
        key={boundary.value.key}
        data-ssgoi-transition={boundary.value.id}
        class="flex-1 flex flex-col bg-[#121212]"
      >
        <Slot />
      </div>

      {/* Outside the depth-1 boundary, inside the depth-0 one. */}
      <BottomNav />
    </div>
  );
});
