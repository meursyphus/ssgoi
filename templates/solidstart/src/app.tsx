import { Router, A, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, type JSX } from "solid-js";
import { Ssgoi } from "@ssgoi/solid";
import { ssgoiConfig } from "./ssgoi-config";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <AppFrame>
          <Suspense>{props.children}</Suspense>
        </AppFrame>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

function AppFrame(props: { children?: JSX.Element }) {
  const location = useLocation();
  const active = (prefix: string) => location.pathname.startsWith(prefix);

  return (
    <div class="h-[100svh] md:h-screen grow flex items-center justify-center bg-[#121212] relative overflow-hidden lg:p-6">
      <div class="w-full max-w-[390px] h-full lg:h-[min(844px,calc(100svh-3rem))] lg:rounded-[2.5rem] overflow-hidden lg:border lg:border-white/10 lg:shadow-2xl lg:shadow-black/50 relative z-10 bg-[#121212]">
        <div class="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50" />
        <div class="h-full min-h-0 bg-[#121212] flex z-0">
          <div class="w-full min-h-0 bg-[#121212] flex flex-col overflow-hidden relative">
            <main
              id="demo-content"
              data-ssgoi-root=""
              class="flex-1 min-h-0 w-full overflow-y-scroll overflow-x-clip relative z-0 bg-[#121212] scrollbar-hide"
            >
              <Ssgoi config={ssgoiConfig}>{props.children}</Ssgoi>
            </main>

            <nav class="flex justify-around items-center bg-[#121212] border-t border-white/5 py-2 flex-shrink-0">
              <NavItem href="/posts" label="Posts" active={active("/posts")}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </NavItem>
              <NavItem
                href="/products/all"
                label="Shop"
                active={active("/products")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </NavItem>
              <NavItem
                href="/pinterest"
                label="Gallery"
                active={active("/pinterest")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </NavItem>
              <NavItem
                href="/profile"
                label="Profile"
                active={active("/profile")}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </NavItem>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem(props: {
  href: string;
  label: string;
  active: boolean;
  children: JSX.Element;
}) {
  return (
    <A
      href={props.href}
      inactiveClass=""
      activeClass=""
      class={`flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200 ${
        props.active ? "text-white" : "text-neutral-500 hover:text-neutral-400"
      }`}
    >
      <div class="w-5 h-5">{props.children}</div>
      <span>{props.label}</span>
    </A>
  );
}
