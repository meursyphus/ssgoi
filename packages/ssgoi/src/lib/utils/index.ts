
export { default as isFunction } from './isFunction.js';

export function normalizePath(path: string): string {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}
