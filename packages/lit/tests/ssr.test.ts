// @vitest-environment node
import { expect, it, vi } from "vitest";
import { SsgoiController, animate } from "../src/index";

it("imports and constructs with no browser globals or DOM side effects", () => {
  expect(typeof window).toBe("undefined");
  const owner = {
    addController: vi.fn(),
    requestUpdate: vi.fn(),
    updateComplete: Promise.resolve(true),
  };
  const controller = new SsgoiController(owner, { transitions: [] });
  expect(owner.addController).toHaveBeenCalledWith(controller);
  expect(controller.state.status).toBe("idle");
  expect(typeof animate).toBe("function");
});
