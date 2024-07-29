/**
 * @typedef {import('hast').Nodes} Nodes
 * @typedef {import('hast').Parents} Parents
 */
/**
 * Get the plain-text value of a hast node.
 *
 * @param {Nodes} node
 *   Node to serialize.
 * @returns {string}
 *   Serialized node.
 */
export function toString(node: Nodes): string;
export type Nodes = import('hast').Nodes;
export type Parents = import('hast').Parents;
