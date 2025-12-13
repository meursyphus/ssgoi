import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider } from "@solidjs/meta";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/solid";
import { fade, hero } from "@ssgoi/solid/view-transitions";
import "./index.css";

const ssgoiConfig: SsgoiConfig = {
  transitions: [
    // Use hero transition between main and item detail pages
    {
      from: "/",
      to: "/item/*",
      transition: hero(),
      symmetric: true,
    },
  ],
};

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Ssgoi config={ssgoiConfig}>
            <div
              style={{
                position: "relative",
                "min-height": "100vh",
                width: "100%",
              }}
            >
              <Suspense>{props.children}</Suspense>
            </div>
          </Ssgoi>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
