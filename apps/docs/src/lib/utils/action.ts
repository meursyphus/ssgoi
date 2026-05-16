import { flow } from "es-toolkit";
import { isProxy, snapshot } from "comwit";
import { ActionError } from "./action-error";

/**
 * comwit proxy(state)를 plain object로 깊게 변환한다.
 * - 최상위가 proxy면 한 번에 snapshot
 * - plain object/array 안에 proxy가 섞여 있으면 재귀적으로 처리
 * - 그 외 값(primitive, Date, File, Blob, Map, class 인스턴스 등)은 그대로 통과
 */
function deproxy<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (isProxy(value)) return snapshot(value as object) as T;
  if (Array.isArray(value)) return value.map(deproxy) as unknown as T;
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) return value;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(value as object)) {
    out[k] = deproxy((value as Record<string, unknown>)[k]);
  }
  return out as T;
}

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

function safeAction<A extends unknown[], T>(fn: (...args: A) => Promise<T>) {
  return async (...args: A): Promise<ActionResult<T>> => {
    try {
      return { ok: true, data: await fn(...args) };
    } catch (e) {
      if (e instanceof ActionError) return { ok: false, error: e.message };
      throw e;
    }
  };
}

function parallelAction<A extends unknown[], T>(
  fn: (...args: A) => Promise<T>,
) {
  return async (...args: A) => [fn(...args)] as const;
}

async function runParallelAction<T>(result: Promise<readonly [Promise<T>]>) {
  return (await result)[0];
}

/**
 * server action 정의 시 사용. safe + parallel 합성.
 * 모든 api/actions/*.ts export는 이걸로 감싸야 한다 (api-create-action 룰).
 */
export const createAction = flow(safeAction, parallelAction);

type ActionFn = (
  ...args: never[]
) => Promise<readonly [Promise<ActionResult<unknown>>]>;

type RunnableActionFn = (
  ...args: unknown[]
) => Promise<readonly [Promise<ActionResult<unknown>>]>;

type Resolved<T extends Record<string, ActionFn>> = {
  [K in keyof T]: T[K] extends (
    ...args: infer A
  ) => Promise<readonly [Promise<ActionResult<infer R>>]>
    ? (...args: A) => Promise<R>
    : never;
};

/**
 * api/{domain}/index.ts 에서 actions를 모아 export 할 때 사용.
 * parallel 풀이 + result 풀이를 한 번에 처리하여 호출 측에선 일반 함수처럼 쓰인다.
 * ActionError로 throw된 메시지는 Error로 다시 throw되어 try/catch로 잡힌다.
 */
export function resolveActions<T extends Record<string, ActionFn>>(
  actions: T,
): Resolved<T> {
  const resolved = {} as Record<string, unknown>;
  for (const key in actions) {
    const action = actions[key];
    resolved[key] = async (...args: unknown[]) => {
      const safeArgs = args.map(deproxy);
      const runAction = action as unknown as RunnableActionFn;
      const result = await runParallelAction(runAction(...safeArgs));
      if (!result.ok) throw new Error(result.error);
      return result.data;
    };
  }
  return resolved as Resolved<T>;
}
