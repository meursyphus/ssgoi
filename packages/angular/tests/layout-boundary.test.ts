import "@angular/compiler";
import { afterEach, beforeEach, expect, it } from "vitest";
import {
  Component,
  provideZonelessChangeDetection,
  type Type,
} from "@angular/core";
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import {
  NavigationEnd,
  Router,
  RouterOutlet,
  UrlTree,
  provideRouter,
} from "@angular/router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
  type SsgoiConfig,
  type SsgoiFramework,
} from "../src/public-api";

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
// `[ssgoi]` applies its scroll policy on navigation; jsdom lacks scrollTo.
Element.prototype.scrollTo = () => {};

// The framework the README documents, built from Angular Router.
const framework: SsgoiFramework = {
  getRoute: (injector) => {
    const router = injector.get(Router);
    const { root } = router.parseUrl(router.url);
    return { pathname: router.serializeUrl(new UrlTree(root)) };
  },
  onNavigate: (injector, callback) => {
    const subscription = injector.get(Router).events.subscribe((event) => {
      if (event instanceof NavigationEnd) callback();
    });
    return () => subscription.unsubscribe();
  },
};

const config: SsgoiConfig = {
  layouts: [
    { paths: "/posts/**" },
    { paths: "/products/**", layouts: [{ paths: "/products/*/**" }] },
  ],
};

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template:
    '<article *ssgoiLayoutBoundary="let boundary"><input /><span>{{ boundary.key }}</span></article>',
})
class Page {}

@Component({
  standalone: true,
  imports: [RouterOutlet, SsgoiLayoutBoundary],
  template:
    '<section *ssgoiLayoutBoundary="let boundary"><b>{{ boundary.key }}</b><router-outlet /></section>',
})
class Shell {}

@Component({
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template:
    '<main ssgoi [config]="config" [ssgoiFramework]="framework"><router-outlet /></main>',
})
class App {
  config = config;
  framework = framework;
}

@Component({
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: '<main ssgoi [ssgoiFramework]="framework"><router-outlet /></main>',
})
class AppWithoutLayouts {
  framework = framework;
}

@Component({
  standalone: true,
  imports: [Ssgoi, SsgoiLayoutBoundary],
  template:
    '<main ssgoi [ssgoiFramework]="framework"><article *ssgoiLayoutBoundary="let boundary">{{ boundary.id }}</article></main>',
})
class Inline {
  framework = framework;
}

@Component({
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: "<main ssgoi><router-outlet /></main>",
})
class AppWithoutFramework {}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([
        { path: "posts/:id", component: Page },
        {
          path: "products/:category",
          component: Shell,
          children: [{ path: ":id", component: Page }],
        },
        { path: "inline/:id", component: Inline },
        { path: "blocked", component: Page, canActivate: [() => false] },
      ]),
    ],
  });
});
afterEach(() => TestBed.resetTestingModule());

async function create(root: Type<unknown>, url: string) {
  const fixture = TestBed.createComponent(root);
  await navigate(fixture, url);
  return fixture;
}

async function navigate(fixture: ComponentFixture<unknown>, url: string) {
  await TestBed.inject(Router).navigateByUrl(url);
  await fixture.whenStable();
}

const query = (fixture: ComponentFixture<unknown>, selector: string) =>
  (fixture.nativeElement as HTMLElement).querySelector(selector)!;

it("keys by the route path without config.layouts, replacing a reused page before patching it", async () => {
  const fixture = await create(AppWithoutLayouts, "/posts/1");
  const outgoing = query(fixture, "article");
  outgoing.querySelector("input")!.value = "draft";
  await navigate(fixture, "/posts/2");
  const incoming = query(fixture, "article");
  expect(incoming).not.toBe(outgoing);
  expect(incoming.getAttribute("data-ssgoi-transition")).toBe("/posts/2");
  expect(outgoing.textContent).toBe("/posts/1");
  expect(outgoing.querySelector("input")!.value).toBe("draft");
  expect(incoming.querySelector("input")!.value).toBe("");
});

it("preserves the page on query-only and cancelled navigation", async () => {
  const fixture = await create(AppWithoutLayouts, "/posts/1?q=one");
  const page = query(fixture, "article");
  await navigate(fixture, "/posts/1?q=two#section");
  expect(query(fixture, "article")).toBe(page);
  expect(page.getAttribute("data-ssgoi-transition")).toBe("/posts/1");
  await navigate(fixture, "/blocked");
  expect(query(fixture, "article")).toBe(page);
});

it("keeps a depth-0 boundary mounted inside its scope and updates its id", async () => {
  const fixture = await create(App, "/posts/1");
  const page = query(fixture, "article");
  expect(page.textContent).toBe("0");
  page.querySelector("input")!.value = "draft";
  await navigate(fixture, "/posts/2");
  expect(query(fixture, "article")).toBe(page);
  expect(page.getAttribute("data-ssgoi-transition")).toBe("/posts/2");
  expect(page.querySelector("input")!.value).toBe("draft");
});

it("nests depth through parent boundaries and keys each by its scope instance", async () => {
  const fixture = await create(App, "/products/shoes/1");
  const shell = query(fixture, "section");
  const item = query(fixture, "article");
  expect(query(fixture, "b").textContent).toBe("1");
  expect(item.textContent).toBe("1.0/shoes");

  await navigate(fixture, "/products/shoes/2");
  expect(query(fixture, "section")).toBe(shell);
  expect(query(fixture, "article")).toBe(item);
  expect(item.getAttribute("data-ssgoi-transition")).toBe("/products/shoes/2");

  await navigate(fixture, "/products/hats/1");
  expect(query(fixture, "section")).toBe(shell);
  expect(query(fixture, "article")).not.toBe(item);
  expect(query(fixture, "article").textContent).toBe("1.0/hats");
});

it("reads [ssgoiFramework] bound in the same template", async () => {
  const fixture = await create(App, "/inline/3");
  expect(query(fixture, "article").getAttribute("data-ssgoi-transition")).toBe(
    "/inline/3",
  );
});

it("throws without a framework on [ssgoi]", async () => {
  const fixture = TestBed.createComponent(AppWithoutFramework);
  await expect(navigate(fixture, "/posts/1")).rejects.toThrow(
    /^SSGOI: SsgoiLayoutBoundary requires a framework/,
  );
});
