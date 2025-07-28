const WORKSPACE_SYMBOL = Symbol.for('__SSGOI_CONTEXT_WORKSPACE');
const getGlobalContext = (): any => {
  if (typeof window === 'undefined') {
    throw Error('This singleton manager only working on browser.');
  }
  return window;
}

const ensureWorkspace = (): Map<symbol, unknown> => {
  const global = getGlobalContext();
  if (!global[WORKSPACE_SYMBOL]) {
    global[WORKSPACE_SYMBOL] = new Map();
  }
  return global[WORKSPACE_SYMBOL];
}

export const registSingleton = <T>(key: string, target: T) => {
  const workspace = ensureWorkspace();
  const symbol = Symbol.for(key);

  if (!workspace.has(symbol)) {
    workspace.set(symbol, target);
  }

  return workspace.get(symbol);
}

export const getSingleton = <T>(key: string) => {
  const workspace = ensureWorkspace();
  const symbol = Symbol.for(key);

  return workspace.get(symbol) as T;
}

export const hasSingleton = (key: string) => {
  const workspace = ensureWorkspace();
  const symbol = Symbol.for(key);

  return workspace.has(symbol);
}

export const removeSingleton = (key: string) => {
  const workspace = ensureWorkspace();
  const symbol = Symbol.for(key);

  return workspace.delete(symbol);
}

export const clearSingleton = () => {
  const workspace = ensureWorkspace();
  workspace.clear();
}