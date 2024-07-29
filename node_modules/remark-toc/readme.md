# remark-toc

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[remark][]** plugin to generate a table of contents.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkToc[, options])`](#unifieduseremarktoc-options)
    *   [`Options`](#options)
*   [Examples](#examples)
    *   [Example: a different heading](#example-a-different-heading)
    *   [Example: ordered, loose list](#example-ordered-loose-list)
    *   [Example: including and excluding headings](#example-including-and-excluding-headings)
    *   [Example: adding a prefix](#example-adding-a-prefix)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin to generate a table of
contents of the document such as the one above.

## When should I use this?

This project is useful when authors are writing docs in markdown that are
sometimes quite long and so would benefit from automated overviews inside them.
It is assumed that headings define the structure of documents and that they can
be linked to.
When this plugin is used, authors can add a certain heading (say, `## Contents`)
to documents and this plugin will populate those sections with lists that link
to all following sections.

GitHub and similar services automatically add IDs (and anchors that
link-to-self) to headings.
You can add similar features when combining remark with [rehype][] through
[`remark-rehype`][remark-rehype] after this plugin.
Then it’s possible to use the rehype plugins [`rehype-slug`][rehype-slug] (for
IDs on headings) and [`rehype-autolink-headings`][rehype-autolink-headings] (for
anchors that link-to-self).

This plugin does not generate a table of contents for the *whole* document or
expose it to other plugins.
You can use the underlying mdast utility [`mdast-util-toc`][mdast-util-toc] and
[create a plugin][unified-create-a-plugin] yourself to do that and more.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install remark-toc
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkToc from 'https://esm.sh/remark-toc@9'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkToc from 'https://esm.sh/remark-toc@9?bundle'
</script>
```

## Use

Say we have the following file `example.md`:

```markdown
# Pluto

Pluto is a dwarf planet in the Kuiper belt.

## Contents

## History

### Discovery

In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the
position of…

### Name and symbol

The name Pluto is for the Roman god of the underworld, from a Greek epithet for
Hades…

### Planet X disproved

Once Pluto was found, its faintness and lack of a viewable disc cast doubt…

## Orbit

Pluto’s orbital period is about 248 years…
```

…and a module `example.js`:

```js
import {remark} from 'remark'
import remarkToc from 'remark-toc'
import {read} from 'to-vfile'

const file = await remark()
  .use(remarkToc)
  .process(await read('example.md'))

console.error(String(file))
```

…then running `node example.js` yields:

```markdown
# Pluto

Pluto is a dwarf planet in the Kuiper belt.

## Contents

* [History](#history)
  * [Discovery](#discovery)
  * [Name and symbol](#name-and-symbol)
  * [Planet X disproved](#planet-x-disproved)
* [Orbit](#orbit)

## History

### Discovery

In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the
position of…

### Name and symbol

The name Pluto is for the Roman god of the underworld, from a Greek epithet for
Hades…

### Planet X disproved

Once Pluto was found, its faintness and lack of a viewable disc cast doubt…

## Orbit

Pluto’s orbital period is about 248 years…
```

## API

This package exports no identifiers.
The default export is [`remarkToc`][api-remark-toc].

### `unified().use(remarkToc[, options])`

Generate a table of contents (TOC).

Looks for the first heading matching `options.heading` (case insensitive),
removes everything between it and an equal or higher next heading, and replaces
that with a list representing the rest of the document structure, linking to
all further headings.

###### Parameters

*   `options` ([`Options`][api-options], optional)
    — configuration

###### Returns

Transform ([`Transformer`][unified-transformer]).

### `Options`

Configuration (TypeScript type).

###### Fields

*   `heading` (`string`, default: `'(table[ -]of[ -])?contents?|toc'`)
    — heading to look for, wrapped in `new RegExp('^(' + value + ')$', 'i')`
*   `maxDepth` (`number`, default: `6`)
    — max heading depth to include in the table of contents; this is inclusive:
    when set to `3`, level three headings are included (those with three hashes,
    `###`)
*   `skip` (`string`, optional)
    — headings to skip, wrapped in `new RegExp('^(' + value + ')$', 'i')`;
    any heading matching this expression will not be present in the table of
    contents
*   `parents` ([`Test` from `unist-util-is`][unist-util-is-test], default:
    `tree`)
    — allow headings to be children of certain node types
*   `tight` (`boolean`, default: `true`)
    — whether to compile list items tightly, otherwise space is added around
    items
*   `ordered` (`boolean`, default: `false`)
    — whether to compile list items as an ordered list, otherwise they are
    unordered
*   `prefix` (`string`, optional, example: `'user-content-'`)
    — add a prefix to links to headings in the table of contents;
    useful for example when later going from markdown to HTML and sanitizing
    with [`rehype-sanitize`][rehype-sanitize]

## Examples

### Example: a different heading

The option `heading` can be set to search for a different heading.
The example from before can be changed to search for different headings like so:

```diff
@@ -3,7 +3,7 @@ import remarkToc from 'remark-toc'
 import {read} from 'to-vfile'

 const file = await remark()
-  .use(remarkToc)
+  .use(remarkToc, {heading: 'structure'})
   .process(await read('example.md'))

 console.error(String(file))
```

…that would search for `structure` (case-insensitive) headings.

### Example: ordered, loose list

The options `ordered` and `tight` can be toggled to change the list.
The example from before can be changed to generate a tight, ordered list like
so:

```diff
@@ -3,7 +3,7 @@ import remarkToc from 'remark-toc'
 import {read} from 'to-vfile'

 const file = await remark()
-  .use(remarkToc)
+  .use(remarkToc, {ordered: true, tight: false})
   .process(await read('example.md'))

 console.error(String(file))
```

…that would generate the following list:

```markdown
1. [History](#history)

   1. [Discovery](#discovery)
   2. [Name and symbol](#name-and-symbol)
   3. [Planet X disproved](#planet-x-disproved)

2. [Orbit](#orbit)
```

### Example: including and excluding headings

The options `maxDepth`, `parents`, and `skip` can be used to include and
exclude certain headings from list.
The example from before can be changed to only include level 1, 2, and 3
headings, to include headings directly in list items, and to exclude headings
with the text `delta` (case-insensitive, full match):

```diff
@@ -3,7 +3,7 @@ import remarkToc from 'remark-toc'
 import {read} from 'to-vfile'

 const file = await remark()
-  .use(remarkToc)
+  .use(remarkToc, {maxDepth: 3, parents: ['listItem', 'root'], skip: 'delta'})
   .process(await read('example.md'))

 console.error(String(file))
```

### Example: adding a prefix

The `prefix` option can set to prepend a string to all links to headings in the
generated list:

```diff
@@ -3,7 +3,7 @@ import remarkToc from 'remark-toc'
 import {read} from 'to-vfile'

 const file = await remark()
-  .use(remarkToc)
+  .use(remarkToc, {prefix: 'user-content-'})
   .process(await read('example.md'))

 console.error(String(file))
```

…that would generate the following list:

```markdown
* [History](#user-content-history)
  * [Discovery](#user-content-discovery)
  * [Name and symbol](#user-content-name-and-symbol)
  * [Planet X disproved](#user-content-planet-x-disproved)
* [Orbit](#user-content-orbit)
```

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Options`][api-options].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `remark-toc@^9`, compatible
with Node.js 16.

This plugin works with `unified` version 3+ and `remark` version 4+.

## Security

Use of `remark-toc` involves user content and changes the tree, so it can open
you up for a [cross-site scripting (XSS)][wiki-xss] attack.

Existing nodes are copied into the table of contents.
The following example shows how an existing script is copied into the table of
contents.

The following markdown:

```markdown
# Contents

## Bravo<script>alert(1)</script>

## Charlie
```

Yields:

```markdown
# Contents

-   [Bravo<script>alert(1)</script>](#bravoscriptalert1script)
-   [Charlie](#charlie)

## Bravo<script>alert(1)</script>

## Charlie
```

This may become a problem if the markdown is later transformed to
**[rehype][]** (**[hast][]**) or opened in an unsafe markdown viewer.

## Related

*   [`remark-normalize-headings`](https://github.com/remarkjs/remark-normalize-headings)
    — make sure that there is only one top-level heading by normalizing heading
    ranks
*   [`remark-collapse`](https://github.com/Rokt33r/remark-collapse)
    – make some sections collapsible
*   [`remark-contributors`](https://github.com/remarkjs/remark-contributors)
    – generate a contributors section
*   [`remark-license`](https://github.com/remarkjs/remark-license)
    – generate a license section
*   [`remark-package-dependencies`](https://github.com/unlight/remark-package-dependencies)
    – generate a dependencies section
*   [`remark-usage`](https://github.com/remarkjs/remark-usage)
    – generate a usage section

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-toc/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-toc/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-toc.svg

[coverage]: https://codecov.io/github/remarkjs/remark-toc

[downloads-badge]: https://img.shields.io/npm/dm/remark-toc.svg

[downloads]: https://www.npmjs.com/package/remark-toc

[size-badge]: https://img.shields.io/bundlejs/size/remark-toc

[size]: https://bundlejs.com/?q=remark-toc

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/main/contributing.md

[support]: https://github.com/remarkjs/.github/blob/main/support.md

[coc]: https://github.com/remarkjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[hast]: https://github.com/syntax-tree/hast

[mdast-util-toc]: https://github.com/syntax-tree/mdast-util-toc

[rehype]: https://github.com/rehypejs/rehype

[rehype-autolink-headings]: https://github.com/rehypejs/rehype-autolink-headings

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[rehype-slug]: https://github.com/rehypejs/rehype-slug

[remark]: https://github.com/remarkjs/remark

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[unified-create-a-plugin]: https://unifiedjs.com/learn/guide/create-a-plugin/

[unist-util-is-test]: https://github.com/syntax-tree/unist-util-is#test

[wiki-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[api-options]: #options

[api-remark-toc]: #unifieduseremarktoc-options
