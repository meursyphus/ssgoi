const WORKSPACE_SYMBOL = Symbol.for('__SSGOI_CONTEXT_WORKSPACE');
const getGlobalContext = (): any => {
  if (typeof window === 'undefined') {
    throw Error('This singleton manager only working on browser.');
  }
  return window;
}

const ensureWorkspace = <K>(): Map<K, any> => {
  const global = getGlobalContext();
  if (!global[WORKSPACE_SYMBOL]) {
    global[WORKSPACE_SYMBOL] = new Map<K, any>();
  }
  return global[WORKSPACE_SYMBOL];
}

export const singletonFactory = <K, T>(key: K, target: T): [() => T | undefined, () => void] => {
  const workspace = ensureWorkspace<K>();

  if (!workspace.has(key)) {
    workspace.set(key, target);
  }

  return [
    () => getSingleton<K, T>(key),
    () => removeSingleton<K>(key),
  ];
}

export const getSingleton = <K, T>(key: K) => {
  const workspace = ensureWorkspace<K>();

  return workspace.get(key) as T | undefined;
}

export const hasSingleton = <K>(key: K) => {
  const workspace = ensureWorkspace<K>();

  return workspace.has(key);
}

export const removeSingleton = <K>(key: K) => {
  const workspace = ensureWorkspace<K>();

  return workspace.delete(key);
}

export const clearSingleton = <K>() => {
  const workspace = ensureWorkspace<K>();
  workspace.clear();
}