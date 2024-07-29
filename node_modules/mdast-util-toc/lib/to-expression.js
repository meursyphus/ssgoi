/**
 * Transform a string into an applicable expression.
 *
 * @param {string} value
 * @returns {RegExp}
 */
export function toExpression(value) {
  return new RegExp('^(' + value + ')$', 'i')
}
