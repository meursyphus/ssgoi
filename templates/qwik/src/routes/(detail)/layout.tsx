import { Slot, component$ } from "@builder.io/qwik";
import { useSsgoiLayoutBoundary } from "@ssgoi/qwik";

export default component$(() => {
  // Depth 0 for detail pages. Each detail page's root is a depth-1 boundary,
  // so one detail page replaces another inside it.
  const boundary = useSsgoiLayoutBoundary();

  return (
    <div
      key={boundary.value.key}
      data-ssgoi-transition={boundary.value.id}
      class="min-h-full bg-[#121212]"
    >
      <Slot />
    </div>
  );
});
