import { component$, isDev } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { useSsgoiProvider, type SsgoiSerializableConfig } from "@ssgoi/qwik";

import "./global.css";

// Use serializable config that can be passed to the hook
const ssgoiConfig: SsgoiSerializableConfig = {
  transitions: [
    // Use hero transition between main and item detail pages
    {
      from: "/",
      to: "/item/*",
      transition: {
        type: "hero",
        options: { spring: { stiffness: 5, damping: 1 } }
      },
      symmetric: true,
    },
  ],
};

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  // Initialize SSGOI provider with config
  useSsgoiProvider(ssgoiConfig);

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
          <RouterOutlet />
        </div>
      </body>
    </QwikCityProvider>
  );
});
