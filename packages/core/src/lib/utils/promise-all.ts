/**
 * Resolve every value in an object that may be a Promise. Returns a Promise
 * of the same shape with each value awaited.
 *
 * @example
 * promiseAll({ from: fromPromise, to: toPromise, count: 7 })
 *   .then(({ from, to, count }) => …)
 *
 * Useful inside transition presets that need both `from` and `to` resolved
 * before they can compute layout-derived state.
 */
type Awaited<T> = T extends Promise<infer U> ? U : T;
export type AwaitedObject<T> = { [K in keyof T]: Awaited<T[K]> };

export function promiseAll<T extends Record<string, unknown>>(
  obj: T,
): Promise<AwaitedObject<T>> {
  const keys = Object.keys(obj) as Array<keyof T & string>;
  return Promise.all(keys.map((k) => obj[k])).then((values) => {
    const result = {} as Record<string, unknown>;
    keys.forEach((k, i) => {
      result[k] = values[i];
    });
    return result as AwaitedObject<T>;
  });
}
