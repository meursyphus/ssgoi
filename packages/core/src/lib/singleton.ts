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

  // 1. offer value
  public static get<T>(key: any, value: T, isOverwrite?: boolean): T;
  // 2. only get value
  public static get<T>(key: any): T | undefined;
  // implement
  public static get<T>(key: any, value?: T, isOverwrite: boolean = false): T | undefined {
    const workspace = this.ensureWorkspace();

    if (value !== undefined) {
      console.log('isOverwrite: ', isOverwrite);

      if (!workspace.has(key) || isOverwrite) {
        workspace.set(key, value);
      }

      return workspace.get(key);
    } else {
      return workspace.get(key);
    }
  }

  public static has(key: any): boolean {
    const workspace = this.ensureWorkspace();
    return workspace.has(key);
  }

  public static remove(key: any): boolean {
    const workspace = this.ensureWorkspace();
    return workspace.delete(key);
  }

  public static clear(): void {
    const workspace = this.ensureWorkspace();
    workspace.clear();
  }
}