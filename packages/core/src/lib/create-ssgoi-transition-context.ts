import type {
  SsgoiConfig,
  SsgoiContext,
  GetTransitionConfig,
  Transition,
} from "./types";
import { getScrollingElement } from "./utils";

/**
 * SSGOI Transition Context 동작 원리
 *
 * 페이지 전환 시나리오: /home → /about
 *
 * 1. OUT 애니메이션 시작 (/home 페이지가 사라질 때)
 *    - getTransition('unique-id', 'out', '/home') 호출
 *    - pendingTransitions에 { from: '/home' } 저장
 *    - Promise 생성하고 outResolve 저장 (아직 resolve 안됨)
 *    - checkAndResolve 호출 → to가 없어서 대기
 *
 * 2. IN 애니메이션 시작 (/about 페이지가 나타날 때)
 *    - getTransition('unique-id', 'in', '/about') 호출
 *    - 기존 pending에 { to: '/about' } 추가
 *    - Promise 생성하고 inResolve 저장
 *    - checkAndResolve 호출 → from과 to가 모두 있음!
 *
 * 3. 트랜지션 매칭 및 해결
 *    - from: '/home', to: '/about'로 적절한 transition 찾기
 *    - 찾은 transition의 out과 in 설정으로 각각 resolve
 *    - pendingTransitions에서 해당 id 삭제
 *
 * 핵심: OUT과 IN이 서로를 기다리며, 둘 다 준비되면 from/to 정보로
 *      적절한 transition을 찾아 동시에 resolve합니다.
 *
 * 문제 상황:
 * - 새로고침이나 첫 진입 시 OUT 애니메이션이 없음
 * - IN만 호출되면 from이 없어서 checkAndResolve가 동작하지 않음
 * - Promise가 resolve되지 않아 애니메이션이 시작되지 않음
 */

type PendingTransition = {
  from?: string;
  to?: string;
  outResolve?: (transition: GetTransitionConfig) => void;
  inResolve?: (transition: GetTransitionConfig) => void;
};

/**
 * Creates a transition configuration
 *
 * @example
 * const config = createSggoiTransitionConfig({
 *   transitions: [
 *     { from: '/home', to: '/about', transition: fade() },
 *     { from: '/products', to: '/products/*', transition: slide() }
 *   ],
 *   defaultTransition: fade()
 * });
 */
export function createSggoiTransitionContext(
  options: SsgoiConfig
): SsgoiContext {
  let pendingTransition: PendingTransition | null = null;

  // Scroll tracking
  let scrollContainer: HTMLElement | null = null;
  const scrollPositions: Map<string, { x: number; y: number }> = new Map();
  let currentPath: string | null = null;

  // Scroll listener
  const scrollListener = () => {
    if (scrollContainer && currentPath) {
      scrollPositions.set(currentPath, {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      });
    }
  };

  // Start tracking scroll for a path
  const startScrollTracking = (element: HTMLElement, path: string) => {
    // Initialize scroll container once
    if (!scrollContainer) {
      scrollContainer = getScrollingElement(element);
      scrollContainer.addEventListener("scroll", scrollListener, {
        passive: true,
      });
    }

    // Update current path
    currentPath = path;
  };

  // Calculate scroll offset
  const calculateScrollOffset = (): { x: number; y: number } => {
    const from = pendingTransition?.from;
    const to = pendingTransition?.to;

    const fromScroll =
      from && scrollPositions.has(from)
        ? scrollPositions.get(from)!
        : { x: 0, y: 0 };

    const toScroll =
      to && scrollPositions.has(to) ? scrollPositions.get(to)! : { x: 0, y: 0 };

    return {
      x: -toScroll.x + fromScroll.x,
      y: -toScroll.y + fromScroll.y,
    };
  };

  function checkAndResolve() {
    if (pendingTransition?.from && pendingTransition?.to) {
      const transition = findMatchingTransition(
        pendingTransition.from,
        pendingTransition.to,
        options.transitions
      );
      const result = transition || options.defaultTransition;
      const scrollOffset = calculateScrollOffset();
      const context = { scrollOffset };

      if (result) {
        if (result.out && pendingTransition.outResolve) {
          pendingTransition.outResolve((element) =>
            result.out!(element, context)
          );
        }
        if (result.in && pendingTransition.inResolve) {
          pendingTransition.inResolve((element) =>
            result.in!(element, context)
          );
        }
      }

      pendingTransition = null;
    }
  }

  const getTransition = async (path: string, type: "out" | "in") => {
    if (type === "in") {
      // IN이 호출됐는데 OUT이 대기 중이 아니면 트랜지션 없음
      if (!pendingTransition || !pendingTransition.from) {
        return () => ({}); // 빈 트랜지션 반환
      }
    }

    if (!pendingTransition) {
      pendingTransition = {};
    }

    if (type === "out") {
      pendingTransition.from = path;
      return new Promise<GetTransitionConfig>((resolve) => {
        pendingTransition!.outResolve = resolve;
        checkAndResolve();
      });
    } else {
      pendingTransition.to = path;
      return new Promise<GetTransitionConfig>((resolve) => {
        pendingTransition!.inResolve = resolve;
        checkAndResolve();
      });
    }
  };

  return (path: string) => {
    return {
      key: path,
      in: async (element: HTMLElement) => {
        // Start scroll tracking for this path
        startScrollTracking(element, path);

        const transitionConfig = await getTransition(path, "in");
        return transitionConfig(element);
      },
      out: async (element: HTMLElement) => {
        const transitionConfig = await getTransition(path, "out");
        return transitionConfig(element);
      },
    };
  };
}

/**
 * Matches a path against a pattern
 * Supports exact matches and wildcard patterns
 *
 * @example
 * matchPath('/products', '/products') // true
 * matchPath('/products/123', '/products/*') // true
 * matchPath('/products/123', '/products') // false
 * matchPath('/anything', '*') // true
 */
function findMatchingTransition<TContext>(
  from: string,
  to: string,
  transitions: Array<{
    from: string;
    to: string;
    transition: Transition<TContext>;
  }>
): Transition<TContext> | null {
  // First try to find exact match
  for (const config of transitions) {
    if (matchPath(from, config.from) && matchPath(to, config.to)) {
      return config.transition;
    }
  }

  // Then try wildcard matches
  for (const config of transitions) {
    if (
      (config.from === "*" || matchPath(from, config.from)) &&
      (config.to === "*" || matchPath(to, config.to))
    ) {
      return config.transition;
    }
  }

  return null;
}

function matchPath(path: string, pattern: string): boolean {
  // Universal match
  if (pattern === "*") {
    return true;
  }

  // Wildcard match
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2);
    return path === prefix || path.startsWith(prefix + "/");
  }

  // Exact match
  return path === pattern;
}
