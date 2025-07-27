const WORKSPACE_SYMBOL = Symbol.for('__SSGOI_CONTEXT_WORKSPACE');
const getGlobalContext = (): any => {
  if (typeof window === 'undefined') {
    throw Error('This singleton manager only working on browser.');
  }
  return window;
}

export class Singleton {
  private static ensureWorkspace(): Map<any, any> {
    const global = getGlobalContext();
    if (!global[WORKSPACE_SYMBOL]) {
      global[WORKSPACE_SYMBOL] = new Map();
    }
    return global[WORKSPACE_SYMBOL];
  }

  public static create<T extends new (...args: any[]) => any>(
    Constructor: T,
    isOverwrite: boolean = false,
    customKey?: string
  ): T {
    return new Proxy(Constructor, {
      construct(target, argumentList, newTarget) {
        const workspace = Singleton.ensureWorkspace();
        const key = Symbol.for(customKey || target.name);

        if (!workspace.has(key) || isOverwrite) {
          const instance = Reflect.construct(target, argumentList, newTarget);
          workspace.set(key, instance);
        }

        return workspace.get(key);
      }
    });
  }

  public static get(keyOrObject: Object|string): Object|undefined {
    const workspace = Singleton.ensureWorkspace();
    const isKey = typeof keyOrObject === 'string';
    const key = isKey ? Symbol.for(keyOrObject) : Symbol.for(keyOrObject.constructor.name);

    return workspace.get(key);
  }

  public static has(keyOrObject: Object|string): boolean {
    const workspace = Singleton.ensureWorkspace();
    const isKey = typeof keyOrObject === 'string';
    const key = isKey ? Symbol.for(keyOrObject) : Symbol.for(keyOrObject.constructor.name);

    return workspace.has(key);
  }

  public static remove(keyOrObject: Object|string): boolean {
    const workspace = Singleton.ensureWorkspace();
    const isKey = typeof keyOrObject === 'string';
    const key = isKey ? Symbol.for(keyOrObject) : Symbol.for(keyOrObject.constructor.name);

    return workspace.delete(key);
  }

  public static clear(): void {
    const workspace = Singleton.ensureWorkspace();

    workspace.clear();
  }
}