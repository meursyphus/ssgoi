/**
 * Delays execution for a specified amount of milliseconds
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified delay
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
