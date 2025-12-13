import { component$, Slot, noSerialize } from "@builder.io/qwik";
import { Ssgoi, type SsgoiConfig } from "@ssgoi/qwik";
import { hero } from "@ssgoi/qwik/view-transitions";

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
    <Ssgoi config={noSerialize(ssgoiConfig)}>
      <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
        <Slot />
      </div>
    </Ssgoi>
  );
});
