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

  private static getKey(keyOrObject: Object|string): symbol {
    let key: symbol;
    if (typeof keyOrObject === 'string') {
      key = Symbol.for(keyOrObject);
    } else if (typeof keyOrObject === 'function') {
      key = Symbol.for(keyOrObject.name);
    } else {
      key = Symbol.for(keyOrObject.constructor.name);
    }

    return key;
  }

  public static create<T extends new (...args: any[]) => any>(
    Constructor: T,
    customKey?: string
  ): T {
    return new Proxy(Constructor, {
      construct(target, argumentList, newTarget) {
        const workspace = Singleton.ensureWorkspace();
        const key = Symbol.for(customKey || target.name);

        if (!workspace.has(key)) {
          const instance = Reflect.construct(target, argumentList, newTarget);
          workspace.set(key, instance);
        } else {
          throw new Error(`Singleton: ${customKey || target.name} already exists.`);
        }

        return workspace.get(key);
      }
    });
  }

  public static get<T>(keyOrObject: Object|string): T|undefined {
    const workspace = Singleton.ensureWorkspace();
    const key = Singleton.getKey(keyOrObject);

    return workspace.get(key) as T;
  }

  public static has(keyOrObject: Object|string): boolean {
    const workspace = Singleton.ensureWorkspace();
    const key = Singleton.getKey(keyOrObject);

    return workspace.has(key);
  }

  public static remove(keyOrObject: Object|string): boolean {
    const workspace = Singleton.ensureWorkspace();
    const key = Singleton.getKey(keyOrObject);

    return workspace.delete(key);
  }

  public static clear(): void {
    const workspace = Singleton.ensureWorkspace();

    workspace.clear();
  }
}