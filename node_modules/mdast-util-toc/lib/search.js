/**
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('mdast').Nodes} Nodes
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('unist-util-is').Test} Test
 */

/**
 * @typedef {Heading['depth']} Rank
 *
 */

/**
 * @typedef SearchOptions
 *   Search configuration.
 * @property {Rank | null | undefined} [maxDepth=6]
 *   Maximum heading depth to include in the table of contents (default: `6`).
 *
 *   This is inclusive: when set to `3`, level three headings are included
 *   (those with three hashes, `###`).
 * @property {Rank | null | undefined} [minDepth=1]
 *   Minimum heading depth to include in the table of contents (default: `1`).
 *
 *   This is inclusive: when set to `3`, level three headings are included
 *   (those with three hashes, `###`).
 * @property {string | null | undefined} [skip]
 *   Headings to skip, wrapped in `new RegExp('^(' + value + ')$', 'i')`
 *   (default: `undefined`).
 *
 *   Any heading matching this expression will not be present in the table of
 *   contents.
 * @property {Test} [parents]
 *   Allow headings to be children of certain node types (default: the to `toc`
 *   given `tree`, to only allow top-level headings) (default:
 *   `d => d === tree`).
 *
 *   Internally, uses `unist-util-is` to check, so `parents` can be any
 *   `is`-compatible test.
 *
 * @typedef SearchEntry
 *   Entry.
 * @property {string} id
 *   ID of entry.
 * @property {Array<PhrasingContent>} children
 *   Contents of entry.
 * @property {Rank} depth
 *   Rank of entry.
 *
 * @typedef SearchResult
 *   Results.
 * @property {number} index
 *   Where the contents section starts, if looking for a heading.
 * @property {number} endIndex
 *   Where the contents section ends, if looking for a heading.
 * @property {Array<SearchEntry>} map
 *   List of entries.
 */

import Slugger from 'github-slugger'
import {toString} from 'mdast-util-to-string'
import {convert} from 'unist-util-is'
import {visit} from 'unist-util-visit'
import {toExpression} from './to-expression.js'

const slugs = new Slugger()

/**
 * Search a node for a toc.
 *
 * @param {Nodes} root
 * @param {RegExp | undefined} expression
 * @param {SearchOptions} settings
 * @returns {SearchResult}
 */
export function search(root, expression, settings) {
  const max = 'children' in root ? root.children.length : 0
  const skip = settings.skip ? toExpression(settings.skip) : undefined
  const parents = convert(
    settings.parents ||
      function (d) {
        return d === root
      }
  )
  /** @type {Array<SearchEntry>} */
  const map = []
  /** @type {number | undefined} */
  let index
  /** @type {number | undefined} */
  let endIndex
  /** @type {Heading | undefined} */
  let opening

  slugs.reset()

  // Visit all headings in `root`.  We `slug` all headings (to account for
  // duplicates), but only create a TOC from top-level headings (by default).
  visit(root, 'heading', function (node, position, parent) {
    const value = toString(node, {includeImageAlt: false})
    /** @type {string} */
    // @ts-expect-error `hProperties` from <https://github.com/syntax-tree/mdast-util-to-hast>
    const id = node.data && node.data.hProperties && node.data.hProperties.id
    const slug = slugs.slug(id || value)

    if (!parents(parent)) {
      return
    }

    // Our opening heading.
    if (
      position !== undefined &&
      expression &&
      !index &&
      expression.test(value)
    ) {
      index = position + 1
      opening = node
      return
    }

    // Our closing heading.
    if (
      position !== undefined &&
      opening &&
      !endIndex &&
      node.depth <= opening.depth
    ) {
      endIndex = position
    }

    // A heading after the closing (if we were looking for one).
    if (
      (endIndex || !expression) &&
      (!settings.minDepth || node.depth >= settings.minDepth) &&
      (!settings.maxDepth || node.depth <= settings.maxDepth) &&
      (!skip || !skip.test(value))
    ) {
      map.push({depth: node.depth, children: node.children, id: slug})
    }
  })

  return {
    index: index === undefined ? -1 : index,
    endIndex: index === undefined ? -1 : endIndex || max,
    map
  }
}
