/**
 * Applies common styles for outgoing page elements
 * Makes the element absolute positioned to allow the incoming page to take its place
 */
export const prepareOutgoing = (element: HTMLElement): void => {
  element.style.position = "absolute";
  element.style.width = "100%";
  element.style.top = "0";
  element.style.left = "0";
};

/**
 * Gets the scrolling element that contains the given element
 * Returns the first scrollable parent element or document.documentElement
 */
export const getScrollingElement = (element: HTMLElement): HTMLElement => {
  let current = element.parentElement;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflow = style.overflow + style.overflowY + style.overflowX;

    // Check if element is scrollable
    if (overflow.includes("auto") || overflow.includes("scroll")) {
      return current;
    }

    // Also check if element has scroll even without explicit overflow
    if (current.scrollHeight > current.clientHeight || current.scrollWidth > current.clientWidth) {
      return current;
    }

    current = current.parentElement;
  }

  // Return document element as fallback (handles body/html scrolling)
  return document.documentElement;
};


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
};
