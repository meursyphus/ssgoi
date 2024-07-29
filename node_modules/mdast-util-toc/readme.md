# mdast-util-toc

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[mdast][] utility to generate a table of contents.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`toc(tree[, options])`](#toctree-options)
  * [`Options`](#options)
  * [`Result`](#result)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Related](#related)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is a utility that generates a table of contents from a document.

## When should I use this?

This utility is useful to generate a section so users can more easily navigate
through a document.

This package is wrapped in [`remark-toc`][remark-toc] for ease of use with
[remark][], where it also injects the table of contents into the document.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install mdast-util-toc
```

In Deno with [`esm.sh`][esmsh]:

```js
import {toc} from 'https://esm.sh/mdast-util-toc@7'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {toc} from 'https://esm.sh/mdast-util-toc@7?bundle'
</script>
```

## Use

```js
import {toc} from 'mdast-util-toc'

/** @type {import('mdast').Root} */
const tree = {
  type: 'root',
  children: [
    {type: 'heading', depth: 1, children: [{type: 'text', value: 'Alpha'}]},
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'Bravo'}]},
    {type: 'heading', depth: 3, children: [{type: 'text', value: 'Charlie'}]},
    {type: 'heading', depth: 2, children: [{type: 'text', value: 'Delta'}]}
  ]
}

const table = toc(tree)

console.dir(table, {depth: 3})
```

Yields:

```javascript
{
  index: undefined,
  endIndex: undefined,
  map: {
    type: 'list',
    ordered: false,
    spread: true,
    children: [ { type: 'listItem', spread: true, children: [Array] } ]
  }
}
```

## API

This package exports the identifier [`toc`][api-toc].
There is no default export.

### `toc(tree[, options])`

Generate a table of contents from `tree`.

Looks for the first heading matching `options.heading` (case insensitive) and
returns a table of contents (a list) for all following headings.
If no `heading` is specified, creates a table of contents for all headings in
`tree`.
`tree` is not changed.

Links in the list to headings are based on GitHub’s style.
Only top-level headings (those not in blockquotes or lists), are used.
This default behavior can be changed by passing `options.parents`.

###### Parameters

* `tree` ([`Node`][node])
  — tree to search and generate from
* `options` ([`Options`][api-options], optional)
  — configuration

###### Returns

Results ([`Result`][api-result]).

### `Options`

Configuration (TypeScript type).

###### Fields

* `heading` (`string`, optional)
  — heading to look for, wrapped in `new RegExp('^(' + value + ')$', 'i')`
* `maxDepth` (`number`, default: `6`)
  — maximum heading depth to include in the table of contents.
  This is inclusive: when set to `3`, level three headings are included
  (those with three hashes, `###`)
* `minDepth` (`number`, default: `1`)
  — minimum heading depth to include in the table of contents.
  This is inclusive: when set to `3`, level three headings are included
  (those with three hashes, `###`)
* `skip` (`string`, optional)
  — headings to skip, wrapped in `new RegExp('^(' + value + ')$', 'i')`.
  Any heading matching this expression will not be present in the table of
  contents
* `parents` ([`Test`][test], default: `tree`)
  — allow headings to be children of certain node types.
  Can by any [`unist-util-is`][is] compatible test
* `tight` (`boolean`, default: `false`)
  — whether to compile list items tightly
* `ordered` (`boolean`, default: `false`)
  — whether to compile list items as an ordered list, otherwise they are
  unordered
* `prefix` (`string`, optional)
  — add a prefix to links to headings in the table of contents.
  Useful for example when later going from mdast to hast and sanitizing with
  `hast-util-sanitize`.

### `Result`

Results (TypeScript type).

###### Fields

* `index` (`number` or `undefined`)
  — index of the node right after the table of contents heading, `-1` if no
  heading was found, `undefined` if no `heading` was given
* `endIndex` (`number` or `undefined`)
  — index of the first node after `heading` that is not part of its section,
  `-1` if no heading was found, `undefined` if no `heading` was given, same as
  `index` if there are no nodes between `heading` and the first heading in
  the table of contents
* `map` ([`List`][list] or `undefined`)
  — list representing the generated table of contents, `undefined` if no
  table of contents could be created, either because no heading was found or
  because no following headings were found

## Types

This package is fully typed with [TypeScript][].
It exports the types [`Options`][api-options] and [`Result`][api-result].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `mdast-util-toc@^7`,
compatible with Node.js 16.

## Security

Use of `mdast-util-toc` does not involve [hast][], user content, or change the
tree, so there are no openings for [cross-site scripting (XSS)][xss] attacks.

Injecting `map` into the syntax tree may open you up to XSS attacks as existing
nodes are copied into the table of contents.
The following example shows how an existing script is copied into the table of
contents.

For the following Markdown:

```markdown
# Alpha

## Bravo<script>alert(1)</script>

## Charlie
```

Yields in `map`:

```markdown
-   [Alpha](#alpha)

    -   [Bravo<script>alert(1)</script>](#bravoscriptalert1script)
    -   [Charlie](#charlie)
```

Always use [`hast-util-santize`][sanitize] when transforming to [hast][].

## Related

* [`github-slugger`](https://github.com/Flet/github-slugger)
  — generate a slug just like GitHub does
* [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
  — visit nodes
* [`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents)
  — like `visit`, but with a stack of parents

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Jonathan Haines][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/mdast-util-toc/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/mdast-util-toc/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-toc.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-toc

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-toc.svg

[downloads]: https://www.npmjs.com/package/mdast-util-toc

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=mdast-util-toc

[size]: https://bundlejs.com/?q=mdast-util-toc

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://barrythepenguin.github.io

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[is]: https://github.com/syntax-tree/unist-util-is

[list]: https://github.com/syntax-tree/mdast#list

[node]: https://github.com/syntax-tree/mdast#node

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[remark]: https://github.com/remarkjs/remark

[remark-toc]: https://github.com/remarkjs/remark-toc

[test]: https://github.com/syntax-tree/unist-util-is#test

[api-toc]: #toctree-options

[api-options]: #options

[api-result]: #result
