import {
  createPresence,
  reconcilePresence,
  settlePresence,
} from "../src/presence";

const screen = (key: string, path = "/posts/42") => ({
  key,
  path,
  value: { key },
  target: { key },
});

test("pushes of the same path keep separate instances and resolve pop direction from keys", () => {
  const a = screen("a");
  const b = screen("b");
  let state = createPresence([a], "a");
  state = reconcilePresence(state, [a, b], "b");
  expect(state.transition).toMatchObject({
    from: a,
    to: b,
    direction: "forward",
  });
  state = settlePresence(state, state.generation);
  expect(state.entries).toEqual([a, b]);
  state = reconcilePresence(state, [a], "a");
  expect(state.transition).toMatchObject({
    from: b,
    to: a,
    direction: "backward",
  });
  expect(state.entries).toEqual([a, b]);
  expect(state.transition?.from.target).toBe(b.target);
  expect(state.transition?.to.target).toBe(a.target);
  state = settlePresence(state, state.generation);
  expect(state.entries).toEqual([a]);
});

test("replace retains the removed instance until completion", () => {
  const a = screen("a"),
    b = screen("b");
  const state = reconcilePresence(createPresence([a], "a"), [b], "b");
  expect(state.entries).toEqual([b, a]);
  expect(settlePresence(state, state.generation).entries).toEqual([b]);
});

test("stale completions cannot release a screen reclaimed by a newer navigation", () => {
  const a = screen("a"),
    b = screen("b"),
    c = screen("c");
  const first = reconcilePresence(createPresence([a], "a"), [b], "b");
  const next = reconcilePresence(first, [c], "c");
  expect(next.entries).toEqual([c, b]);
  expect(settlePresence(next, first.generation)).toBe(next);
  expect(settlePresence(next, next.generation).entries).toEqual([c]);
});

test("query and descriptor updates keep the same native screen", () => {
  const a = screen("a", "/posts?sort=one");
  const updated = screen("a", "/posts?sort=two");
  const state = reconcilePresence(createPresence([a], "a"), [updated], "a");
  expect(state.transition).toBeNull();
  expect(state.entries).toEqual([updated]);
});

test("empty/reset states release pending screens without inventing an incoming route", () => {
  const a = screen("a"),
    b = screen("b");
  const transition = reconcilePresence(createPresence([a], "a"), [a, b], "b");
  expect(reconcilePresence(transition, [], null).entries).toEqual([]);
  expect(reconcilePresence(transition, [], null).transition).toBeNull();
});
