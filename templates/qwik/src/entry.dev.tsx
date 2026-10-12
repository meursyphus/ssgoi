import { render, type RenderOptions } from "@qwik.dev/core";
import Root from "./root";

export default function (opts: RenderOptions) {
  return render(document, <Root />, opts);
}
