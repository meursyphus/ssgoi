/**
 * Rounds a number to a specified number of decimal places
 * @param num - The number to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns The rounded number
 *
 * @example
 * round(3.14159, 2) // 3.14
 * round(3.14159, 0) // 3
 * round(3.6) // 4
 */
export function round(num: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}

/**
 * Floors a number to a specified number of decimal places
 * @param num - The number to floor
 * @param decimals - Number of decimal places (default: 0)
 * @returns The floored number
 *
 * @example
 * floor(3.99, 1) // 3.9
 * floor(3.99) // 3
 */
export function floor(num: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.floor(num * multiplier) / multiplier;
}

/**
 * Ceils a number to a specified number of decimal places
 * @param num - The number to ceil
 * @param decimals - Number of decimal places (default: 0)
 * @returns The ceiled number
 *
 * @example
 * ceil(3.01, 1) // 3.1
 * ceil(3.01) // 4
 */
export function ceil(num: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(num * multiplier) / multiplier;
}

/**
 * Formats a number to a fixed number of decimal places
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns The formatted number as a string
 *
 * @example
 * toFixed(3.14159, 2) // "3.14"
 * toFixed(3, 2) // "3.00"
 */
export function toFixed(num: number, decimals: number = 0): string {
  return num.toFixed(decimals);
}
