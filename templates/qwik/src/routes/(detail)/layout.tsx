import { Slot, component$ } from "@builder.io/qwik";
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";

export default component$(() => {
  // Depth 1: one detail page replaces another.
  const boundary = useSsgoiLayoutBoundary();

  return (
    <div
      key={boundary.value.key}
      data-ssgoi-transition={boundary.value.id}
      class="flex-1 bg-[#121212]"
    >
      <Slot />
    </div>
  );
});
