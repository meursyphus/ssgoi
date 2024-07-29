# remark-unwrap-images

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[remark][]** plugin to remove the wrapping paragraph for images.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin that searches for paragraphs
which contain only images (possibly in links) and nothing else, and then remove
those surrounding paragraphs.

## When should I use this?

This project can make it simpler to style images with CSS, for example
displaying them at the full available width, because paragraph styles no longer
interfere with them.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install remark-unwrap-images
```

In Deno with [`esm.sh`][esmsh]:

```js
import remarkUnwrapImages from 'https://esm.sh/remark-unwrap-images@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import remarkUnwrapImages from 'https://esm.sh/remark-unwrap-images@4?bundle'
</script>
```

## Use

Say we have the following file `example.md`.

```markdown
# Saturn

Saturn is the sixth planet from the Sun and the second-largest in the Solar
System, after Jupiter.

![Saturn](//upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg)
```

…and a module `example.js`:

```js
import {unified} from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkUnwrapImages from 'remark-unwrap-images'
import {read} from 'to-vfile'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(remarkUnwrapImages)
  .use(rehypeStringify)
  .process(await read('example.md'))

console.log(String(file))
```

…then running `node example.js` yields:

```html
<h1>Saturn</h1>
<p>Saturn is the sixth planet from the Sun and the second-largest in the Solar
System, after Jupiter.</p>
<p><img src="//upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/300px-Saturn_during_Equinox.jpg" alt="Saturn"></p>
```

## API

This package exports no identifiers.
The default export is [`remarkUnwrapImages`][api-remark-unwrap-images].

#### `unified().use(remarkUnwrapImages)`

Remove the wrapping paragraph for images.

###### Parameters

There are no parameters.

###### Returns

Transform ([`Transformer`][unified-transformer]).

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `remark-unwrap-images@^4`,
compatible with Node.js 16.

This plugin works with `unified` version 6+ and `remark` version 7+.

## Security

Use of `remark-unwrap-images` does not involve **[rehype][]** (**[hast][]**) or
user content, it only removes some existing nodes, so there are no openings for
[cross-site scripting (XSS)][wiki-xss] attacks.

## Related

*   [`remark-images`](https://github.com/remarkjs/remark-images)
    — add a simpler image syntax
*   [`remark-embed-images`](https://github.com/remarkjs/remark-embed-images)
    — embed local images as data URIs, inlining files as base64-encoded values

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © Compositor and Vercel, Inc.

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-unwrap-images/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-unwrap-images/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-unwrap-images.svg

[coverage]: https://codecov.io/github/remarkjs/remark-unwrap-images

[downloads-badge]: https://img.shields.io/npm/dm/remark-unwrap-images.svg

[downloads]: https://www.npmjs.com/package/remark-unwrap-images

[size-badge]: https://img.shields.io/bundlejs/size/remark-unwrap-images

[size]: https://bundlejs.com/?q=remark-unwrap-images

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

[hast]: https://github.com/syntax-tree/hast

[rehype]: https://github.com/rehypejs/rehype

[remark]: https://github.com/remarkjs/remark

[typescript]: https://www.typescriptlang.org

[unified]: https://github.com/unifiedjs/unified

[unified-transformer]: https://github.com/unifiedjs/unified#transformer

[wiki-xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[api-remark-unwrap-images]: #unifieduseremarkunwrapimages
