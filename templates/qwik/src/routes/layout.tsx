import { Slot, component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useSsgoi, useSsgoiLayoutBoundary } from "@ssgoi/qwik";
import { ssgoiConfig$ } from "../lib/ssgoi-config";

export default component$(() => {
  const location = useLocation();
  const ssgoiRoot = useSignal<HTMLElement>();

  useSsgoi(ssgoiRoot, {
    config$: ssgoiConfig$,
    framework: { location },
  });
  // Depth 0, in the same component as useSsgoi: stays while you move between
  // tabs, moves as a whole (bottom nav included) between a tab and a detail.
  const boundary = useSsgoiLayoutBoundary();

  return (
    <div class="h-[100svh] md:h-screen grow flex items-center justify-center bg-[#121212] relative overflow-hidden lg:p-6">
      <div class="w-full max-w-[390px] h-full lg:h-[min(844px,calc(100svh-3rem))] lg:rounded-[2.5rem] overflow-hidden lg:border lg:border-white/10 lg:shadow-2xl lg:shadow-black/50 relative z-10 bg-[#121212]">
        <div class="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>
        <div class="h-full min-h-0 bg-[#121212] flex z-0">
          <div class="w-full min-h-0 bg-[#121212] flex flex-col overflow-hidden relative">
            {/* The one scroll container, outside every boundary. */}
            <main
              ref={ssgoiRoot}
              data-ssgoi-root=""
              id="demo-content"
              class="flex-1 min-h-0 w-full overflow-y-scroll overflow-x-hidden relative z-0 bg-[#121212] scrollbar-hide"
            >
              <div
                key={boundary.value.key}
                data-ssgoi-transition={boundary.value.id}
                class="min-h-full flex flex-col bg-[#121212]"
              >
                <Slot />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
});
