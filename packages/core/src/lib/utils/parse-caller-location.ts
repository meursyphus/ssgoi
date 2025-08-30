const START_STACK_INDEX_IN_FRAMEWORKS = 3;

export const parseCallerLocation = (stack?: string): { file: string; line: string; column: string } | null => {
  if (!stack) return null;

  const lines = stack.split("\n").map((l) => l.trim());

  // NOTE: This is a hack to derive the caller location from a stack trace.
  // It's not perfect, but it's the most practical approach with the data we have.
  // We start scanning at index 3 because, in the built output, the frames at 0–2
  // are framework/runtime wrappers; from index 3 onward the stack shows the
  // actual component and source file that executed.
  // We look for the first line matching /\(?([^):]+):(\d+):(\d+)\)?$/,
  // which captures the file path, line, and column numbers in the stack trace.

  for (let i = START_STACK_INDEX_IN_FRAMEWORKS; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    const match = line?.match(/\(?([^):]+):(\d+):(\d+)\)?$/);
    if (!match) {
      continue;
    }
    const filePath = (match[1] ?? "") as string;
    const lineNum = (match[2] ?? "0") as string;
    const colNum = (match[3] ?? "0") as string;
    const file = filePath.split(/[\\/]/).pop() || filePath;
    return { file, line: lineNum, column: colNum };
  }

  return null;
}