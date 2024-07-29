/**
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('./search.js').SearchEntry} SearchEntry
 */

/**
 * @typedef ContentsOptions
 *   Build configuration.
 * @property {boolean | null | undefined} [tight=false]
 *   Whether to compile list items tightly (default: `false`).
 * @property {boolean | null | undefined} [ordered=false]
 *   Whether to compile list items as an ordered list, otherwise they are
 *   unordered (default: `false`).
 * @property {string | null | undefined} [prefix=undefined]
 *   Add a prefix to links to headings in the table of contents (default:
 *   `undefined`).
 *
 *   Useful for example when later going from mdast to hast and sanitizing with
 *   `hast-util-sanitize`.
 */

import structuredClone from '@ungap/structured-clone'

/**
 * Transform a list of heading objects to a markdown list.
 *
 * @param {Array<SearchEntry>} map
 * @param {ContentsOptions} settings
 */
export function contents(map, settings) {
  const {ordered = false, tight = false, prefix} = settings
  /** @type {List} */
  const table = {type: 'list', ordered, spread: false, children: []}
  let minDepth = Number.POSITIVE_INFINITY
  let index = -1

  // Find minimum depth.
  while (++index < map.length) {
    if (map[index].depth < minDepth) {
      minDepth = map[index].depth
    }
  }

  // Normalize depth.
  index = -1

  while (++index < map.length) {
    map[index].depth -= minDepth - 1
  }

  // Add TOC to list.
  index = -1

  while (++index < map.length) {
    insert(map[index], table, {ordered, tight, prefix})
  }

  return table
}

/**
 * Insert an entry into `parent`.
 *
 * @param {SearchEntry} entry
 * @param {List | ListItem} parent
 * @param {ContentsOptions} settings
 */
function insert(entry, parent, settings) {
  let index = -1
  const tail = parent.children[parent.children.length - 1]

  if (parent.type === 'list') {
    if (entry.depth === 1) {
      parent.children.push({
        type: 'listItem',
        spread: false,
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                title: null,
                url: '#' + (settings.prefix || '') + entry.id,
                children: all(entry.children)
              }
            ]
          }
        ]
      })
    } else if (parent.children.length > 0) {
      const tail = parent.children[parent.children.length - 1]
      insert(entry, tail, settings)
    } else {
      /** @type {ListItem} */
      const item = {type: 'listItem', spread: false, children: []}
      parent.children.push(item)
      insert(entry, item, settings)
    }
  }
  // List item.
  else if (tail && tail.type === 'list') {
    entry.depth--
    insert(entry, tail, settings)
  } else {
    /** @type {List} */
    const item = {
      type: 'list',
      ordered: settings.ordered,
      spread: false,
      children: []
    }
    parent.children.push(item)
    entry.depth--
    insert(entry, item, settings)
  }

  if (parent.type === 'list' && !settings.tight) {
    parent.spread = false

    while (++index < parent.children.length) {
      if (parent.children[index].children.length > 1) {
        parent.spread = true
        break
      }
    }
  } else {
    parent.spread = !settings.tight
  }
}

/**
 * @param {Array<PhrasingContent>} nodes
 * @returns {Array<PhrasingContent>}
 */
function all(nodes) {
  /** @type {Array<PhrasingContent>} */
  const results = []
  let index = -1

  while (++index < nodes.length) {
    const result = one(nodes[index])

    if (Array.isArray(result)) {
      results.push(...result)
    } else {
      results.push(result)
    }
  }

  return results
}

/**
 * @param {PhrasingContent} node
 * @returns {Array<PhrasingContent> | PhrasingContent}
 */
function one(node) {
  if (node.type === 'footnoteReference') {
    return []
  }

  if (node.type === 'link' || node.type === 'linkReference') {
    return all(node.children)
  }

  if ('children' in node) {
    const {children, position, ...copy} = node
    return Object.assign(structuredClone(copy), {
      children: all(node.children)
    })
  }

  const {position, ...copy} = node
  return structuredClone(copy)
}
