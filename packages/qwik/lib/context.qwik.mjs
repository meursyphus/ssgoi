import { createContextId, useContext } from "@builder.io/qwik";
const SsgoiContextId = createContextId("ssgoi-context");
const useSsgoi = () => {
  const contextSignal = useContext(SsgoiContextId);
  return contextSignal;
};
export {
  SsgoiContextId,
  useSsgoi
};
