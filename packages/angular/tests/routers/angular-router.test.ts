import "@angular/compiler";
import { afterEach, beforeEach, expect, it } from "vitest";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { SsgoiRouteBoundary } from "../../router/src/ssgoi-route-boundary";

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

@Component({
  standalone: true,
  imports: [SsgoiRouteBoundary],
  template:
    '<article *ssgoiRouteBoundary="let route"><input /><span>{{ route.id }}</span></article>',
})
class Page {}

@Component({
  standalone: true,
  imports: [SsgoiRouteBoundary],
  template:
    '<article *ssgoiRouteBoundary="let route; key: 0"><input /><span>{{ route.id }}</span></article>',
})
class Shell {}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([
        { path: "posts/:id", component: Page },
        { path: "shell/:id", component: Shell },
        { path: "blocked", component: Page, canActivate: [() => false] },
      ]),
    ],
  });
});
afterEach(() => TestBed.resetTestingModule());

it("replaces a reused parameterized page before patching its outgoing DOM", async () => {
  const harness = await RouterTestingHarness.create("/posts/1");
  const outgoing = harness.routeNativeElement!.querySelector("article")!;
  outgoing.querySelector("input")!.value = "draft";
  await harness.navigateByUrl("/posts/2", Page);
  const incoming = harness.routeNativeElement!.querySelector("article")!;
  expect(incoming).not.toBe(outgoing);
  expect(incoming.getAttribute("data-ssgoi-transition")).toBe("/posts/2");
  expect(outgoing.textContent).toBe("/posts/1");
  expect(outgoing.querySelector("input")!.value).toBe("draft");
  expect(incoming.querySelector("input")!.value).toBe("");
});

it("preserves the page on query-only and cancelled navigation", async () => {
  const harness = await RouterTestingHarness.create("/posts/1?q=one");
  const page = harness.routeNativeElement!.querySelector("article")!;
  await harness.navigateByUrl("/posts/1?q=two#section", Page);
  expect(harness.routeNativeElement!.querySelector("article")).toBe(page);
  expect(page.getAttribute("data-ssgoi-transition")).toBe("/posts/1");
  await harness.navigateByUrl("/blocked");
  expect(harness.routeNativeElement!.querySelector("article")).toBe(page);
});

it("accepts a stable zero key and updates its logical id without losing local input", async () => {
  const harness = await RouterTestingHarness.create("/shell/1");
  const shell = harness.routeNativeElement!.querySelector("article")!;
  shell.querySelector("input")!.value = "draft";
  await harness.navigateByUrl("/shell/2", Shell);
  expect(harness.routeNativeElement!.querySelector("article")).toBe(shell);
  expect(shell.getAttribute("data-ssgoi-transition")).toBe("/shell/2");
  expect(shell.querySelector("input")!.value).toBe("draft");
});
