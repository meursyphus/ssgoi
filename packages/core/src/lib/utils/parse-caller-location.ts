const START_STACK_INDEX_IN_FRAMEWORKS = 1;

// Skip internal library files to find the actual user code location
const SKIP_PATTERNS = [
  // SSGOI library internal files
  /packages[\\/]core[\\/]dist/,
  /packages[\\/]react[\\/]dist/,
  /packages[\\/]svelte[\\/]dist/,
  /packages[\\/]solid[\\/]dist/,
  /@ssgoi[\\/]core/,
  /@ssgoi[\\/]react/,
  /@ssgoi[\\/]svelte/,
  /@ssgoi[\\/]solid/,
  // Node modules (framework internals)
  /node_modules/,
];

const shouldSkipPath = (filePath: string): boolean => {
  return SKIP_PATTERNS.some((pattern) => pattern.test(filePath));
};

export const parseCallerLocation = (
  stack?: string,
): { file: string; line: string; column: string } | null => {
  if (!stack) return null;

  const lines = stack.split("\n").map((l) => l.trim());

  // NOTE: This is a hack to derive the caller location from a stack trace.
  // We scan through the stack frames, skipping internal library files,
  // to find the first user code location (the actual call site).
  // We look for the first line matching /\(?([^):]+):(\d+):(\d+)\)?$/,
  // which captures the file path, line, and column numbers in the stack trace.

  for (
    let i = START_STACK_INDEX_IN_FRAMEWORKS;
    i < Math.min(lines.length, 10);
    i++
  ) {
    const line = lines[i];
    const match = line?.match(/\(?([^):]+):(\d+):(\d+)\)?$/);
    if (!match) {
      continue;
    }
    const filePath = (match[1] ?? "") as string;

    // Skip internal library files
    if (shouldSkipPath(filePath)) {
      continue;
    }

    const lineNum = (match[2] ?? "0") as string;
    const colNum = (match[3] ?? "0") as string;
    const file = filePath.split(/[\\/]/).pop() || filePath;
    return { file, line: lineNum, column: colNum };
  }

  return null;
};
