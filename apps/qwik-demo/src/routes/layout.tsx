import { component$, Slot } from "@builder.io/qwik";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/qwik";
import { fade, hero } from "@ssgoi/qwik/view-transitions";

const ssgoiConfig: SsgoiConfig = {
  transitions: [
    {
      from: "/",
      to: "/item/*",
      transition: hero({ spring: { stiffness: 5, damping: 1 } }),
      symmetric: true,
    },
  ],
};

export default component$(() => {
  return (
    <Ssgoi config={ssgoiConfig}>
      <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
        <Slot />
      </div>
    </Ssgoi>
  );
});
