import { Slot, component$ } from "@builder.io/qwik";
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";
import { BottomNav } from "~/components/bottom-nav";

export default component$(() => {
  // Depth 0: stays while you move between tabs and leaves as a whole (bottom
  // nav included) for a detail page. Each tab page's root is a depth-1
  // boundary, so between tabs only the content above the nav moves.
  const boundary = useSsgoiLayoutBoundary();

  return (
    <div
      key={boundary.value.key}
      data-ssgoi-transition={boundary.value.id}
      class="min-h-full flex flex-col bg-[#121212]"
    >
      <div class="flex-1 flex flex-col">
        <Slot />
      </div>
      <BottomNav />
    </div>
  );
});
