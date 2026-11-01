import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, type JSX } from "solid-js";
import { Ssgoi, SsgoiLayoutBoundary } from "@ssgoi/solid";
import { ssgoiConfig } from "./ssgoi-config";
import "./app.css";

export default function App() {
  return (
    <Router root={(props) => <AppFrame>{props.children}</AppFrame>}>
      <FileRoutes />
    </Router>
  );
}

function AppFrame(props: { children?: JSX.Element }) {
  const location = useLocation();
  const framework = { getRoute: () => ({ pathname: location.pathname }) };

  return (
    <div class="h-[100svh] md:h-screen grow flex items-center justify-center bg-[#121212] relative overflow-hidden lg:p-6">
      <div class="w-full max-w-[390px] h-full lg:h-[min(844px,calc(100svh-3rem))] lg:rounded-[2.5rem] overflow-hidden lg:border lg:border-white/10 lg:shadow-2xl lg:shadow-black/50 relative z-10 bg-[#121212]">
        <div class="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50" />
        <div class="h-full min-h-0 bg-[#121212] flex z-0">
          <div class="w-full min-h-0 bg-[#121212] flex flex-col overflow-hidden relative">
            {/* The one scroll container, outside every boundary. */}
            <main
              id="demo-content"
              data-ssgoi-root=""
              class="flex-1 min-h-0 w-full overflow-y-scroll overflow-x-clip relative z-0 bg-[#121212] scrollbar-hide"
            >
              <Ssgoi config={ssgoiConfig} framework={framework}>
                <Suspense>
                  {/* Depth 0: stays while you move between tabs, moves as a
                      whole (bottom nav included) between a tab and a detail. */}
                  <SsgoiLayoutBoundary class="min-h-full flex flex-col bg-[#121212]">
                    {props.children}
                  </SsgoiLayoutBoundary>
                </Suspense>
              </Ssgoi>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
