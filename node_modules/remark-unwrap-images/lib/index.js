/**
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').LinkReference} LinkReference
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').Root} Root
 */

import {whitespace} from 'hast-util-whitespace'
import {SKIP, visit} from 'unist-util-visit'

const unknown = 1
const containsImage = 2
const containsOther = 3

/**
 * Remove the wrapping paragraph for images.
 *
 * @returns
 *   Transform.
 */
export default function remarkUnwrapImages() {
  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'paragraph', function (node, index, parent) {
      if (
        parent &&
        typeof index === 'number' &&
        applicable(node, false) === containsImage
      ) {
        parent.children.splice(index, 1, ...node.children)
        return [SKIP, index]
      }
    })
  }
}

/**
 * Check if a node can be unraveled.
 *
 * @param {Link | LinkReference | Paragraph} node
 *   Node.
 * @param {boolean} inLink
 *   Whether the node is in a link.
 * @returns {1 | 2 | 3}
 *   Info.
 */
function applicable(node, inLink) {
  /** @type {1 | 2 | 3} */
  let image = unknown
  let index = -1

  while (++index < node.children.length) {
    const child = node.children[index]

    if (child.type === 'text' && whitespace(child.value)) {
      // Whitespace is fine.
    } else if (child.type === 'image' || child.type === 'imageReference') {
      image = containsImage
    } else if (
      !inLink &&
      (child.type === 'link' || child.type === 'linkReference')
    ) {
      const linkResult = applicable(child, true)

      if (linkResult === containsOther) {
        return containsOther
      }

      if (linkResult === containsImage) {
        image = containsImage
      }
    } else {
      return containsOther
    }
  }

  return image
}
