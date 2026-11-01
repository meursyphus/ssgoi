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
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
  createUrlTreeFromSnapshot,
  provideRouter,
  type ActivatedRouteSnapshot,
} from "@angular/router";
import {
  Ssgoi,
  SsgoiLayoutBoundary,
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
    const route = injector.get(ActivatedRoute).snapshot;
    const router = injector.get(Router);
    return {
      pathname: router.serializeUrl(
        createUrlTreeFromSnapshot(route, [], null, null),
      ),
      route,
    };
  },
  onNavigate: (injector, callback) => {
    const subscription = injector.get(Router).events.subscribe((event) => {
      if (event instanceof NavigationEnd) callback();
    });
    return () => subscription.unsubscribe();
  },
};

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template:
    '<article *ssgoiLayoutBoundary="let route"><input /><span>{{ route.id }}</span></article>',
})
class Page {}

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template:
    "<article *ssgoiLayoutBoundary=\"'shell'; let route\"><input /><span>{{ route.id }}</span></article>",
})
class Shell {}

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template:
    "<article *ssgoiLayoutBoundary=\"{ id: '/feed' }; let route\"><input />{{ route.key }}</article>",
})
class Feed {}

@Component({
  standalone: true,
  imports: [SsgoiLayoutBoundary],
  template:
    '<article *ssgoiLayoutBoundary="boundary; let route">{{ route.key }}</article>',
})
class Resolved {
  // A function may annotate the extra fields `getRoute` returns.
  boundary = ({
    route,
  }: {
    pathname: string;
    route: ActivatedRouteSnapshot;
  }) => ({
    id: `/resolved/${route.paramMap.get("id")}`,
    key: "resolved",
  });
}

// What strict template checking does for the `boundary` binding above.
export const boundaryIsAssignable: SsgoiLayoutBoundary["ssgoiLayoutBoundary"] =
  new Resolved().boundary;

@Component({
  standalone: true,
  imports: [RouterOutlet, Ssgoi],
  template: '<main ssgoi [ssgoiFramework]="framework"><router-outlet /></main>',
})
class App {
  framework = framework;
}

@Component({
  standalone: true,
  imports: [Ssgoi, SsgoiLayoutBoundary],
  template:
    '<main ssgoi [ssgoiFramework]="framework"><article *ssgoiLayoutBoundary="let route">{{ route.id }}</article></main>',
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
        { path: "shell/:id", component: Shell },
        { path: "resolved/:id", component: Resolved },
        { path: "feed/:id", component: Feed },
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

const article = (fixture: ComponentFixture<unknown>) =>
  (fixture.nativeElement as HTMLElement).querySelector("article")!;

it("replaces a reused parameterized page before patching its outgoing DOM", async () => {
  const fixture = await create(App, "/posts/1");
  const outgoing = article(fixture);
  outgoing.querySelector("input")!.value = "draft";
  await navigate(fixture, "/posts/2");
  const incoming = article(fixture);
  expect(incoming).not.toBe(outgoing);
  expect(incoming.getAttribute("data-ssgoi-transition")).toBe("/posts/2");
  expect(outgoing.textContent).toBe("/posts/1");
  expect(outgoing.querySelector("input")!.value).toBe("draft");
  expect(incoming.querySelector("input")!.value).toBe("");
});

it("preserves the page on query-only and cancelled navigation", async () => {
  const fixture = await create(App, "/posts/1?q=one");
  const page = article(fixture);
  await navigate(fixture, "/posts/1?q=two#section");
  expect(article(fixture)).toBe(page);
  expect(page.getAttribute("data-ssgoi-transition")).toBe("/posts/1");
  await navigate(fixture, "/blocked");
  expect(article(fixture)).toBe(page);
});

it("keeps a string boundary as the key and updates its id without losing local input", async () => {
  const fixture = await create(App, "/shell/1");
  const shell = article(fixture);
  shell.querySelector("input")!.value = "draft";
  await navigate(fixture, "/shell/2");
  expect(article(fixture)).toBe(shell);
  expect(shell.getAttribute("data-ssgoi-transition")).toBe("/shell/2");
  expect(shell.querySelector("input")!.value).toBe("draft");
});

it("uses a fixed id from an object boundary as the default key", async () => {
  const fixture = await create(App, "/feed/1");
  const feed = article(fixture);
  expect(feed.getAttribute("data-ssgoi-transition")).toBe("/feed");
  expect(feed.textContent).toBe("/feed");
  await navigate(fixture, "/feed/2");
  expect(article(fixture)).toBe(feed);
});

it("passes the route getRoute returns to a boundary function", async () => {
  const fixture = await create(App, "/resolved/7");
  const page = article(fixture);
  expect(page.getAttribute("data-ssgoi-transition")).toBe("/resolved/7");
  expect(page.textContent).toBe("resolved");
  await navigate(fixture, "/resolved/8");
  expect(article(fixture)).toBe(page);
  expect(page.getAttribute("data-ssgoi-transition")).toBe("/resolved/8");
});

it("reads [ssgoiFramework] bound in the same template", async () => {
  const fixture = await create(App, "/inline/3");
  expect(article(fixture).getAttribute("data-ssgoi-transition")).toBe(
    "/inline/3",
  );
});

it("throws without a framework on [ssgoi]", async () => {
  const fixture = TestBed.createComponent(AppWithoutFramework);
  await expect(navigate(fixture, "/posts/1")).rejects.toThrow(
    /^SSGOI: SsgoiLayoutBoundary requires a framework/,
  );
});
