import { parsers as parsers$1 } from 'prettier/plugins/babel';
import { doc } from 'prettier/standalone';
import { VERSION, parse } from 'svelte/compiler';

// @see http://xahlee.info/js/html5_non-closing_tag.html
const selfClosingTags = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
];
// https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements#Elements
const blockElements = [
    'address',
    'article',
    'aside',
    'blockquote',
    'details',
    'dialog',
    'dd',
    'div',
    'dl',
    'dt',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'header',
    'hgroup',
    'hr',
    'li',
    'main',
    'nav',
    'ol',
    'p',
    'pre',
    'section',
    'table',
    'ul',
];
/**
 * HTML attributes that we may safely reformat (trim whitespace, add or remove newlines)
 */
const formattableAttributes = [
// None at the moment
// Prettier HTML does not format attributes at all
// and to be consistent we leave this array empty for now
];

// Base64 string encoding and decoding module.
// Uses Buffer for Node.js and btoa/atob for browser environments.
// We use TextEncoder/TextDecoder for browser environments because
// they can handle non-ASCII characters, unlike btoa/atob.
const stringToBase64 = typeof Buffer !== 'undefined'
    ? (str) => Buffer.from(str).toString('base64')
    : (str) => btoa(new TextEncoder()
        .encode(str)
        .reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
const base64ToString = typeof Buffer !== 'undefined'
    ? (str) => Buffer.from(str, 'base64').toString()
    : (str) => new TextDecoder().decode(Uint8Array.from(atob(str), (c) => c.charCodeAt(0)));

const snippedTagContentAttribute = '✂prettier:content✂';
const scriptRegex = /<!--[^]*?-->|<script((?:\s+[^=>'"\/\s]+=(?:"[^"]*"|'[^']*'|[^>\s]+)|\s+[^=>'"\/\s]+)*\s*)>([^]*?)<\/script>/g;
const styleRegex = /<!--[^]*?-->|<style((?:\s+[^=>'"\/\s]+=(?:"[^"]*"|'[^']*'|[^>\s]+)|\s+[^=>'"\/\s]+)*\s*)>([^]*?)<\/style>/g;
const langTsRegex = /\slang=["']?ts["']?/;
function snipScriptAndStyleTagContent(source) {
    let scriptMatchSpans = getMatchIndexes('script');
    let styleMatchSpans = getMatchIndexes('style');
    let isTypescript = false;
    const text = snipTagContent(snipTagContent(source, 'script', '{}', styleMatchSpans), 'style', '', scriptMatchSpans);
    return { text, isTypescript };
    function getMatchIndexes(tagName) {
        const regex = getRegexp(tagName);
        const indexes = [];
        let match = null;
        while ((match = regex.exec(source)) != null) {
            if (source.slice(match.index, match.index + 4) !== '<!--') {
                indexes.push([match.index, regex.lastIndex]);
            }
        }
        return indexes;
    }
    function snipTagContent(_source, tagName, placeholder, otherSpans) {
        const regex = getRegexp(tagName);
        let newScriptMatchSpans = scriptMatchSpans;
        let newStyleMatchSpans = styleMatchSpans;
        // Replace valid matches
        const newSource = _source.replace(regex, (match, attributes, content, index) => {
            if (match.startsWith('<!--') || withinOtherSpan(index)) {
                return match;
            }
            if (langTsRegex.test(attributes)) {
                isTypescript = true;
            }
            const encodedContent = stringToBase64(content);
            const newContent = `<${tagName}${attributes} ${snippedTagContentAttribute}="${encodedContent}">${placeholder}</${tagName}>`;
            // Adjust the spans because the source now has a different content length
            const lengthDiff = match.length - newContent.length;
            newScriptMatchSpans = adjustSpans(scriptMatchSpans, newScriptMatchSpans);
            newStyleMatchSpans = adjustSpans(styleMatchSpans, newStyleMatchSpans);
            function adjustSpans(oldSpans, newSpans) {
                return oldSpans.map((oldSpan, idx) => {
                    const newSpan = newSpans[idx];
                    // Do the check using the old spans because the replace function works
                    // on the old spans. Replace oldSpans with newSpans afterwards.
                    if (oldSpan[0] > index) {
                        // span is after the match -> adjust start and end
                        return [newSpan[0] - lengthDiff, newSpan[1] - lengthDiff];
                    }
                    else if (oldSpan[0] === index) {
                        // span is the match -> adjust end only
                        return [newSpan[0], newSpan[1] - lengthDiff];
                    }
                    else {
                        // span is before the match -> nothing to adjust
                        return newSpan;
                    }
                });
            }
            return newContent;
        });
        // Now that the replacement function ran, we can adjust the spans for the next run
        scriptMatchSpans = newScriptMatchSpans;
        styleMatchSpans = newStyleMatchSpans;
        return newSource;
        function withinOtherSpan(idx) {
            return otherSpans.some((otherSpan) => idx > otherSpan[0] && idx < otherSpan[1]);
        }
    }
    function getRegexp(tagName) {
        return tagName === 'script' ? scriptRegex : styleRegex;
    }
}
function hasSnippedContent(text) {
    return text.includes(snippedTagContentAttribute);
}
const regex = /(<\w+.*?)\s*✂prettier:content✂="(.*?)">.*?(?=<\/)/gi;
function unsnipContent(text) {
    return text.replace(regex, (_, start, encodedContent) => {
        const content = base64ToString(encodedContent);
        return `${start}>${content}`;
    });
}

function makeChoice(choice) {
    return { value: choice, description: choice };
}
const options = {
    svelteSortOrder: {
        category: 'Svelte',
        type: 'choice',
        default: 'options-scripts-markup-styles',
        description: 'Sort order for scripts, markup, and styles',
        choices: [
            makeChoice('options-scripts-markup-styles'),
            makeChoice('options-scripts-styles-markup'),
            makeChoice('options-markup-styles-scripts'),
            makeChoice('options-markup-scripts-styles'),
            makeChoice('options-styles-markup-scripts'),
            makeChoice('options-styles-scripts-markup'),
            makeChoice('scripts-options-markup-styles'),
            makeChoice('scripts-options-styles-markup'),
            makeChoice('markup-options-styles-scripts'),
            makeChoice('markup-options-scripts-styles'),
            makeChoice('styles-options-markup-scripts'),
            makeChoice('styles-options-scripts-markup'),
            makeChoice('scripts-markup-options-styles'),
            makeChoice('scripts-styles-options-markup'),
            makeChoice('markup-styles-options-scripts'),
            makeChoice('markup-scripts-options-styles'),
            makeChoice('styles-markup-options-scripts'),
            makeChoice('styles-scripts-options-markup'),
            makeChoice('scripts-markup-styles-options'),
            makeChoice('scripts-styles-markup-options'),
            makeChoice('markup-styles-scripts-options'),
            makeChoice('markup-scripts-styles-options'),
            makeChoice('styles-markup-scripts-options'),
            makeChoice('styles-scripts-markup-options'),
            makeChoice('none'),
        ],
    },
    svelteStrictMode: {
        category: 'Svelte',
        type: 'boolean',
        default: false,
        description: 'More strict HTML syntax: Quotes in attributes, no self-closing DOM tags',
    },
    svelteBracketNewLine: {
        category: 'Svelte',
        type: 'boolean',
        description: 'Put the `>` of a multiline element on a new line',
        deprecated: '2.5.0',
    },
    svelteAllowShorthand: {
        category: 'Svelte',
        type: 'boolean',
        default: true,
        description: 'Option to enable/disable component attribute shorthand if attribute name and expressions are same',
    },
    svelteIndentScriptAndStyle: {
        category: 'Svelte',
        type: 'boolean',
        default: true,
        description: 'Whether or not to indent the code inside <script> and <style> tags in Svelte files',
    },
};
const sortOrderSeparator = '-';
function parseSortOrder(sortOrder = 'options-scripts-markup-styles') {
    if (sortOrder === 'none') {
        return [];
    }
    const order = sortOrder.split(sortOrderSeparator);
    // For backwards compatibility: Add options to beginning if not present
    if (!order.includes('options')) {
        throw new Error('svelteSortOrder is missing option `options`');
    }
    return order;
}
function isBracketSameLine(options) {
    return options.svelteBracketNewLine != null
        ? !options.svelteBracketNewLine
        : options.bracketSameLine != null
            ? options.bracketSameLine
            : false;
}

/**
 * Determines whether or not given node
 * is the root of the Svelte AST.
 */
function isASTNode(n) {
    return n && n.__isRoot;
}
function isPreTagContent(path) {
    const stack = path.stack;
    return stack.some((node) => (node.type === 'Element' && node.name.toLowerCase() === 'pre') ||
        (node.type === 'Attribute' && !formattableAttributes.includes(node.name)));
}
function flatten(arrays) {
    return [].concat.apply([], arrays);
}
function findLastIndex(isMatch, items) {
    for (let i = items.length - 1; i >= 0; i--) {
        if (isMatch(items[i], i)) {
            return i;
        }
    }
    return -1;
}
function replaceEndOfLineWith(text, replacement) {
    const parts = [];
    for (const part of text.split('\n')) {
        if (parts.length > 0) {
            parts.push(replacement);
        }
        if (part.endsWith('\r')) {
            parts.push(part.slice(0, -1));
        }
        else {
            parts.push(part);
        }
    }
    return parts;
}
function getAttributeLine(node, options) {
    const { hardline, line } = doc.builders;
    const hasThisBinding = (node.type === 'InlineComponent' && !!node.expression) ||
        (node.type === 'Element' && !!node.tag);
    const attributes = node.attributes.filter((attribute) => attribute.name !== snippedTagContentAttribute);
    return options.singleAttributePerLine &&
        (attributes.length > 1 || (attributes.length && hasThisBinding))
        ? hardline
        : line;
}
function printWithPrependedAttributeLine(node, options, print) {
    return (path) => path.getNode().name !== snippedTagContentAttribute
        ? [getAttributeLine(node, options), path.call(print)]
        : '';
}

/**
 * Check if doc is a hardline.
 * We can't just rely on a simple equality check because the doc could be created with another
 * runtime version of prettier than what we import, making a reference check fail.
 */
function isHardline(docToCheck) {
    return docToCheck === doc.builders.hardline || deepEqual(docToCheck, doc.builders.hardline);
}
/**
 * Simple deep equal function which suits our needs. Only works properly on POJOs without cyclic deps.
 */
function deepEqual(x, y) {
    if (x === y) {
        return true;
    }
    else if (typeof x == 'object' && x != null && typeof y == 'object' && y != null) {
        if (Object.keys(x).length != Object.keys(y).length)
            return false;
        for (var prop in x) {
            if (y.hasOwnProperty(prop)) {
                if (!deepEqual(x[prop], y[prop]))
                    return false;
            }
            else {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}
function isDocCommand(doc) {
    return typeof doc === 'object' && doc !== null;
}
function isLine(docToCheck) {
    return (isHardline(docToCheck) ||
        (isDocCommand(docToCheck) && docToCheck.type === 'line') ||
        (Array.isArray(docToCheck) && docToCheck.every(isLine)));
}
/**
 * Check if the doc is empty, i.e. consists of nothing more than empty strings (possibly nested).
 */
function isEmptyDoc(doc) {
    if (typeof doc === 'string') {
        return doc.length === 0;
    }
    if (isDocCommand(doc) && doc.type === 'line') {
        return !doc.keepIfLonely;
    }
    if (Array.isArray(doc)) {
        return doc.length === 0;
    }
    const { contents } = doc;
    if (contents) {
        return isEmptyDoc(contents);
    }
    const { parts } = doc;
    if (parts) {
        return isEmptyGroup(parts);
    }
    return false;
}
function isEmptyGroup(group) {
    return !group.find((doc) => !isEmptyDoc(doc));
}
/**
 * Trims both leading and trailing nodes matching `isWhitespace` independent of nesting level
 * (though all trimmed adjacent nodes need to be a the same level). Modifies the `docs` array.
 */
function trim(docs, isWhitespace) {
    trimLeft(docs, isWhitespace);
    trimRight(docs, isWhitespace);
    return docs;
}
/**
 * Trims the leading nodes matching `isWhitespace` independent of nesting level (though all nodes need to be a the same level).
 * If there are empty docs before the first whitespace, they are removed, too.
 */
function trimLeft(group, isWhitespace) {
    let firstNonWhitespace = group.findIndex((doc) => !isEmptyDoc(doc) && !isWhitespace(doc));
    if (firstNonWhitespace < 0 && group.length) {
        firstNonWhitespace = group.length;
    }
    if (firstNonWhitespace > 0) {
        const removed = group.splice(0, firstNonWhitespace);
        if (removed.every(isEmptyDoc)) {
            return trimLeft(group, isWhitespace);
        }
    }
    else {
        const parts = getParts(group[0]);
        if (parts) {
            return trimLeft(parts, isWhitespace);
        }
    }
}
/**
 * Trims the trailing nodes matching `isWhitespace` independent of nesting level (though all nodes need to be a the same level).
 * If there are empty docs after the last whitespace, they are removed, too.
 */
function trimRight(group, isWhitespace) {
    let lastNonWhitespace = group.length
        ? findLastIndex((doc) => !isEmptyDoc(doc) && !isWhitespace(doc), group)
        : 0;
    if (lastNonWhitespace < group.length - 1) {
        const removed = group.splice(lastNonWhitespace + 1);
        if (removed.every(isEmptyDoc)) {
            return trimRight(group, isWhitespace);
        }
    }
    else {
        const parts = getParts(group[group.length - 1]);
        if (parts) {
            return trimRight(parts, isWhitespace);
        }
    }
}
function getParts(doc) {
    if (typeof doc === 'object') {
        if (Array.isArray(doc)) {
            return doc;
        }
        if (doc.type === 'fill') {
            return doc.parts;
        }
        if (doc.type === 'group') {
            return getParts(doc.contents);
        }
    }
}
/**
 * `(foo = bar)` => `foo = bar`
 */
function removeParentheses(doc) {
    return trim([doc], (_doc) => _doc === '(' || _doc === ')')[0];
}

const unsupportedLanguages = ['coffee', 'coffeescript', 'styl', 'stylus', 'sass'];
function isInlineElement(path, options, node) {
    return (node && node.type === 'Element' && !isBlockElement(node, options) && !isPreTagContent(path));
}
function isBlockElement(node, options) {
    return (node &&
        node.type === 'Element' &&
        options.htmlWhitespaceSensitivity !== 'strict' &&
        (options.htmlWhitespaceSensitivity === 'ignore' ||
            blockElements.includes(node.name)));
}
function isSvelteBlock(node) {
    return [
        'IfBlock',
        'SnippetBlock',
        'AwaitBlock',
        'CatchBlock',
        'EachBlock',
        'ElseBlock',
        'KeyBlock',
        'PendingBlock',
        'ThenBlock',
    ].includes(node.type);
}
function isNodeWithChildren(node) {
    return node.children;
}
function getChildren(node) {
    return isNodeWithChildren(node) ? node.children : [];
}
/**
 * Returns siblings, that is, the children of the parent.
 */
function getSiblings(path) {
    let parent = path.getParentNode();
    if (isASTNode(parent)) {
        parent = parent.html;
    }
    return getChildren(parent);
}
/**
 * Returns the next sibling node.
 */
function getNextNode(path, node = path.getNode()) {
    return getSiblings(path).find((child) => child.start === node.end);
}
/**
 * Returns the comment that is above the current node.
 */
function getLeadingComment(path) {
    const siblings = getSiblings(path);
    let node = path.getNode();
    let prev = siblings.find((child) => child.end === node.start);
    while (prev) {
        if (prev.type === 'Comment' &&
            !isIgnoreStartDirective(prev) &&
            !isIgnoreEndDirective(prev)) {
            return prev;
        }
        else if (isEmptyTextNode(prev)) {
            node = prev;
            prev = siblings.find((child) => child.end === node.start);
        }
        else {
            return undefined;
        }
    }
}
/**
 * Did there use to be any embedded object (that has been snipped out of the AST to be moved)
 * at the specified position?
 */
function doesEmbedStartAfterNode(node, path, siblings = getSiblings(path)) {
    // If node is not at the top level of html, an embed cannot start after it,
    // because embeds are only at the top level
    if (!isNodeTopLevelHTML(node, path)) {
        return false;
    }
    const position = node.end;
    const root = path.stack[0];
    const embeds = [root.css, root.html, root.instance, root.js, root.module];
    const nextNode = siblings[siblings.indexOf(node) + 1];
    return embeds.find((n) => n && n.start >= position && (!nextNode || n.end <= nextNode.start));
}
function isNodeTopLevelHTML(node, path) {
    const root = path.stack[0];
    return !!root.html && !!root.html.children && root.html.children.includes(node);
}
function isEmptyTextNode(node) {
    return !!node && node.type === 'Text' && getUnencodedText(node).trim() === '';
}
function isIgnoreDirective(node) {
    return !!node && node.type === 'Comment' && node.data.trim() === 'prettier-ignore';
}
function isIgnoreStartDirective(node) {
    return !!node && node.type === 'Comment' && node.data.trim() === 'prettier-ignore-start';
}
function isIgnoreEndDirective(node) {
    return !!node && node.type === 'Comment' && node.data.trim() === 'prettier-ignore-end';
}
function printRaw(node, originalText, stripLeadingAndTrailingNewline = false) {
    if (node.children.length === 0) {
        return '';
    }
    const firstChild = node.children[0];
    const lastChild = node.children[node.children.length - 1];
    let raw = originalText.substring(firstChild.start, lastChild.end);
    if (!stripLeadingAndTrailingNewline) {
        return raw;
    }
    if (startsWithLinebreak(raw)) {
        raw = raw.substring(raw.indexOf('\n') + 1);
    }
    if (endsWithLinebreak(raw)) {
        raw = raw.substring(0, raw.lastIndexOf('\n'));
        if (raw.charAt(raw.length - 1) === '\r') {
            raw = raw.substring(0, raw.length - 1);
        }
    }
    return raw;
}
function isTextNode(node) {
    return node.type === 'Text';
}
function getAttributeValue(attributeName, node) {
    var _a;
    const attributes = ((_a = node.attributes) !== null && _a !== void 0 ? _a : []);
    const langAttribute = attributes.find((attribute) => attribute.name === attributeName);
    return langAttribute && langAttribute.value;
}
function getAttributeTextValue(attributeName, node) {
    const value = getAttributeValue(attributeName, node);
    if (value != null && typeof value === 'object') {
        const textValue = value.find(isTextNode);
        if (textValue) {
            return textValue.data;
        }
    }
    return null;
}
function getLangAttribute(node) {
    const value = getAttributeTextValue('lang', node) || getAttributeTextValue('type', node);
    if (value != null) {
        return value.replace(/^text\//, '');
    }
    else {
        return null;
    }
}
/**
 * Checks whether the node contains a `lang` or `type` attribute with a value corresponding to
 * a language we cannot format. This might for example be `<template lang="pug">`.
 * If the node does not contain a `lang` attribute, the result is true.
 */
function isNodeSupportedLanguage(node) {
    const lang = getLangAttribute(node);
    return !(lang && unsupportedLanguages.includes(lang));
}
/**
 * Checks whether the node contains a `lang` or `type` attribute which indicates that
 * the script contents are written in TypeScript. Note that the absence of the tag
 * does not mean it's not TypeScript, because the user could have set the default
 * to TypeScript in his settings.
 */
function isTypeScript(node) {
    const lang = getLangAttribute(node) || '';
    return ['typescript', 'ts'].includes(lang);
}
function isJSON(node) {
    const lang = getLangAttribute(node) || '';
    // https://github.com/prettier/prettier/pull/6293
    return lang.endsWith('json') || lang.endsWith('importmap');
}
function isLess(node) {
    const lang = getLangAttribute(node) || '';
    return ['less'].includes(lang);
}
function isScss(node) {
    const lang = getLangAttribute(node) || '';
    return ['sass', 'scss'].includes(lang);
}
function isPugTemplate(node) {
    return node.type === 'Element' && node.name === 'template' && getLangAttribute(node) === 'pug';
}
function isLoneMustacheTag(node) {
    return node !== true && node.length === 1 && node[0].type === 'MustacheTag';
}
function isAttributeShorthand(node) {
    return node !== true && node.length === 1 && node[0].type === 'AttributeShorthand';
}
/**
 * True if node is of type `{a}` or `a={a}`
 */
function isOrCanBeConvertedToShorthand(node) {
    if (isAttributeShorthand(node.value)) {
        return true;
    }
    if (isLoneMustacheTag(node.value)) {
        const expression = node.value[0].expression;
        return expression.type === 'Identifier' && expression.name === node.name;
    }
    return false;
}
function getUnencodedText(node) {
    // `raw` will contain HTML entities in unencoded form
    return node.raw || node.data;
}
function isTextNodeStartingWithLinebreak(node, nrLines = 1) {
    return node.type === 'Text' && startsWithLinebreak(getUnencodedText(node), nrLines);
}
function startsWithLinebreak(text, nrLines = 1) {
    return new RegExp(`^([\\t\\f\\r ]*\\n){${nrLines}}`).test(text);
}
function isTextNodeEndingWithLinebreak(node, nrLines = 1) {
    return node.type === 'Text' && endsWithLinebreak(getUnencodedText(node), nrLines);
}
function endsWithLinebreak(text, nrLines = 1) {
    return new RegExp(`(\\n[\\t\\f\\r ]*){${nrLines}}$`).test(text);
}
function isTextNodeStartingWithWhitespace(node) {
    return node.type === 'Text' && /^\s/.test(getUnencodedText(node));
}
function isTextNodeEndingWithWhitespace(node) {
    return node.type === 'Text' && /\s$/.test(getUnencodedText(node));
}
function trimTextNodeRight(node) {
    node.raw = node.raw && node.raw.trimRight();
    node.data = node.data && node.data.trimRight();
}
function trimTextNodeLeft(node) {
    node.raw = node.raw && node.raw.trimLeft();
    node.data = node.data && node.data.trimLeft();
}
/**
 * Remove all leading whitespace up until the first non-empty text node,
 * and all trailing whitespace from the last non-empty text node onwards.
 */
function trimChildren(children, path) {
    let firstNonEmptyNode = children.findIndex((n) => !isEmptyTextNode(n) && !doesEmbedStartAfterNode(n, path));
    firstNonEmptyNode = firstNonEmptyNode === -1 ? children.length - 1 : firstNonEmptyNode;
    let lastNonEmptyNode = findLastIndex((n, idx) => {
        // Last node is ok to end at the start of an embedded region,
        // if it's not a comment (which should stick to the region)
        return (!isEmptyTextNode(n) &&
            ((idx === children.length - 1 && n.type !== 'Comment') ||
                !doesEmbedStartAfterNode(n, path)));
    }, children);
    lastNonEmptyNode = lastNonEmptyNode === -1 ? 0 : lastNonEmptyNode;
    for (let i = 0; i <= firstNonEmptyNode; i++) {
        const n = children[i];
        if (n.type === 'Text') {
            trimTextNodeLeft(n);
        }
    }
    for (let i = children.length - 1; i >= lastNonEmptyNode; i--) {
        const n = children[i];
        if (n.type === 'Text') {
            trimTextNodeRight(n);
        }
    }
}
/**
 * Check if given node's start tag should hug its first child. This is the case for inline elements when there's
 * no whitespace between the `>` and the first child.
 */
function shouldHugStart(node, isSupportedLanguage, options) {
    if (!isSupportedLanguage) {
        return true;
    }
    if (isBlockElement(node, options)) {
        return false;
    }
    if (!isNodeWithChildren(node)) {
        return false;
    }
    const children = node.children;
    if (children.length === 0) {
        return true;
    }
    if (options.htmlWhitespaceSensitivity === 'ignore') {
        return false;
    }
    const firstChild = children[0];
    return !isTextNodeStartingWithWhitespace(firstChild);
}
/**
 * Check if given node's end tag should hug its last child. This is the case for inline elements when there's
 * no whitespace between the last child and the `</`.
 */
function shouldHugEnd(node, isSupportedLanguage, options) {
    if (!isSupportedLanguage) {
        return true;
    }
    if (isBlockElement(node, options)) {
        return false;
    }
    if (!isNodeWithChildren(node)) {
        return false;
    }
    const children = node.children;
    if (children.length === 0) {
        return true;
    }
    if (options.htmlWhitespaceSensitivity === 'ignore') {
        return false;
    }
    const lastChild = children[children.length - 1];
    return !isTextNodeEndingWithWhitespace(lastChild);
}
/**
 * Check for a svelte block if there's whitespace at the start and if it's a space or a line.
 */
function checkWhitespaceAtStartOfSvelteBlock(node, options) {
    if (!isSvelteBlock(node) || !isNodeWithChildren(node)) {
        return 'none';
    }
    const children = node.children;
    if (children.length === 0) {
        return 'none';
    }
    const firstChild = children[0];
    if (isTextNodeStartingWithLinebreak(firstChild)) {
        return 'line';
    }
    else if (isTextNodeStartingWithWhitespace(firstChild)) {
        return 'space';
    }
    // This extra check is necessary because the Svelte AST might swallow whitespace between
    // the block's starting end and its first child.
    const parentOpeningEnd = options.originalText.lastIndexOf('}', firstChild.start);
    if (parentOpeningEnd > 0 && firstChild.start > parentOpeningEnd + 1) {
        const textBetween = options.originalText.substring(parentOpeningEnd + 1, firstChild.start);
        if (textBetween.trim() === '') {
            return startsWithLinebreak(textBetween) ? 'line' : 'space';
        }
    }
    return 'none';
}
/**
 * Check for a svelte block if there's whitespace at the end and if it's a space or a line.
 */
function checkWhitespaceAtEndOfSvelteBlock(node, options) {
    if (!isSvelteBlock(node) || !isNodeWithChildren(node)) {
        return 'none';
    }
    const children = node.children;
    if (children.length === 0) {
        return 'none';
    }
    const lastChild = children[children.length - 1];
    if (isTextNodeEndingWithLinebreak(lastChild)) {
        return 'line';
    }
    else if (isTextNodeEndingWithWhitespace(lastChild)) {
        return 'space';
    }
    // This extra check is necessary because the Svelte AST might swallow whitespace between
    // the last child and the block's ending start.
    const parentClosingStart = options.originalText.indexOf('{', lastChild.end);
    if (parentClosingStart > 0 && lastChild.end < parentClosingStart) {
        const textBetween = options.originalText.substring(lastChild.end, parentClosingStart);
        if (textBetween.trim() === '') {
            return endsWithLinebreak(textBetween) ? 'line' : 'space';
        }
    }
    return 'none';
}
function isInsideQuotedAttribute(path, options) {
    const stack = path.stack;
    return stack.some((node) => node.type === 'Attribute' &&
        (!isLoneMustacheTag(node.value) ||
            (options.svelteStrictMode && !options._svelte_is5Plus)));
}
/**
 * Returns true if the softline between `</tagName` and `>` can be omitted.
 */
function canOmitSoftlineBeforeClosingTag(node, path, options) {
    return (isBracketSameLine(options) &&
        (!hugsStartOfNextNode(node, options) || isLastChildWithinParentBlockElement(path, options)));
}
/**
 * Return true if given node does not hug the next node, meaning there's whitespace
 * or the end of the doc afterwards.
 */
function hugsStartOfNextNode(node, options) {
    if (node.end === options.originalText.length) {
        // end of document
        return false;
    }
    return !options.originalText.substring(node.end).match(/^\s/);
}
function isLastChildWithinParentBlockElement(path, options) {
    const parent = path.getParentNode();
    if (!parent || !isBlockElement(parent, options)) {
        return false;
    }
    const children = getChildren(parent);
    const lastChild = children[children.length - 1];
    return lastChild === path.getNode();
}
function assignCommentsToNodes(ast) {
    if (ast.module) {
        ast.module.comments = removeAndGetLeadingComments(ast, ast.module);
    }
    if (ast.instance) {
        ast.instance.comments = removeAndGetLeadingComments(ast, ast.instance);
    }
    if (ast.css) {
        ast.css.comments = removeAndGetLeadingComments(ast, ast.css);
    }
}
/**
 * Returns the comments that are above the current node and deletes them from the html ast.
 */
function removeAndGetLeadingComments(ast, current) {
    const siblings = getChildren(ast.html);
    const comments = [];
    const newlines = [];
    if (!siblings.length) {
        return [];
    }
    let node = current;
    let prev = siblings.find((child) => child.end === node.start);
    while (prev) {
        if (prev.type === 'Comment' &&
            !isIgnoreStartDirective(prev) &&
            !isIgnoreEndDirective(prev)) {
            comments.push(prev);
            if (comments.length !== newlines.length) {
                newlines.push({ type: 'Text', data: '', raw: '', start: -1, end: -1 });
            }
        }
        else if (isEmptyTextNode(prev)) {
            newlines.push(prev);
        }
        else {
            break;
        }
        node = prev;
        prev = siblings.find((child) => child.end === node.start);
    }
    newlines.length = comments.length; // could be one more if first comment is preceeded by empty text node
    for (const comment of comments) {
        siblings.splice(siblings.indexOf(comment), 1);
    }
    for (const text of newlines) {
        siblings.splice(siblings.indexOf(text), 1);
    }
    return comments
        .map((comment, i) => ({
        comment,
        emptyLineAfter: getUnencodedText(newlines[i]).split('\n').length > 2,
    }))
        .reverse();
}

const { join, line, group, indent, dedent, softline, hardline, fill, breakParent, literalline } = doc.builders;
function hasPragma(text) {
    return /^\s*<!--\s*@(format|prettier)\W/.test(text);
}
let ignoreNext = false;
let ignoreRange = false;
let svelteOptionsDoc;
function print(path, options, print) {
    var _a, _b;
    const bracketSameLine = isBracketSameLine(options);
    const n = path.getValue();
    if (!n) {
        return '';
    }
    if (isASTNode(n)) {
        return printTopLevelParts(n, options, path, print);
    }
    const [open, close] = options.svelteStrictMode && !options._svelte_is5Plus ? ['"{', '}"'] : ['{', '}'];
    const printJsExpression = () => [open, printJS(path, print, 'expression'), close];
    const node = n;
    if ((ignoreNext || (ignoreRange && !isIgnoreEndDirective(node))) &&
        (node.type !== 'Text' || !isEmptyTextNode(node))) {
        if (ignoreNext) {
            ignoreNext = false;
        }
        return flatten(options.originalText
            .slice(options.locStart(node), options.locEnd(node))
            .split('\n')
            .map((o, i) => (i == 0 ? [o] : [literalline, o])));
    }
    switch (node.type) {
        case 'Fragment':
            const children = node.children;
            if (children.length === 0 || children.every(isEmptyTextNode)) {
                return '';
            }
            if (!isPreTagContent(path)) {
                trimChildren(node.children, path);
                const output = trim([printChildren(path, print, options)], (n) => isLine(n) ||
                    (typeof n === 'string' && n.trim() === '') ||
                    // Because printChildren may append this at the end and
                    // may hide other lines before it
                    n === breakParent);
                if (output.every((doc) => isEmptyDoc(doc))) {
                    return '';
                }
                return group([...output, hardline]);
            }
            else {
                return group(path.map(print, 'children'));
            }
        case 'Text':
            if (!isPreTagContent(path)) {
                if (isEmptyTextNode(node)) {
                    const hasWhiteSpace = getUnencodedText(node).trim().length < getUnencodedText(node).length;
                    const hasOneOrMoreNewlines = /\n/.test(getUnencodedText(node));
                    const hasTwoOrMoreNewlines = /\n\r?\s*\n\r?/.test(getUnencodedText(node));
                    if (hasTwoOrMoreNewlines) {
                        return [hardline, hardline];
                    }
                    if (hasOneOrMoreNewlines) {
                        return hardline;
                    }
                    if (hasWhiteSpace) {
                        return line;
                    }
                    return '';
                }
                /**
                 * For non-empty text nodes each sequence of non-whitespace characters (effectively,
                 * each "word") is joined by a single `line`, which will be rendered as a single space
                 * until this node's current line is out of room, at which `fill` will break at the
                 * most convenient instance of `line`.
                 */
                return fill(splitTextToDocs(node));
            }
            else {
                let rawText = getUnencodedText(node);
                const parent = path.getParentNode();
                if (parent.type === 'Attribute') {
                    // Direct child of attribute value -> add literallines at end of lines
                    // so that other things don't break in unexpected places
                    if (parent.name === 'class' && path.getParentNode(1).type === 'Element') {
                        // Special treatment for class attribute on html elements. Prettier
                        // will force everything into one line, we deviate from that and preserve lines.
                        rawText = rawText.replace(/([^ \t\n])(([ \t]+$)|([ \t]+(\r?\n))|[ \t]+)/g, 
                        // Remove trailing whitespace in lines with non-whitespace characters
                        // except at the end of the string
                        (match, characterBeforeWhitespace, _, isEndOfString, isEndOfLine, endOfLine) => isEndOfString
                            ? match
                            : characterBeforeWhitespace + (isEndOfLine ? endOfLine : ' '));
                        // Shrink trailing whitespace in case it's followed by a mustache tag
                        // and remove it completely if it's at the end of the string, but not
                        // if it's on its own line
                        rawText = rawText.replace(/([^ \t\n])[ \t]+$/, parent.value.indexOf(node) === parent.value.length - 1 ? '$1' : '$1 ');
                    }
                    return replaceEndOfLineWith(rawText, literalline);
                }
                return rawText;
            }
        case 'Element':
        case 'InlineComponent':
        case 'Slot':
        case 'SlotTemplate':
        case 'Window':
        case 'Head':
        case 'Title': {
            const isSupportedLanguage = !(node.name === 'template' && !isNodeSupportedLanguage(node));
            const isEmpty = node.children.every((child) => isEmptyTextNode(child));
            const isDoctypeTag = node.name.toUpperCase() === '!DOCTYPE';
            const didSelfClose = options.originalText[node.end - 2] === '/';
            const isSelfClosingTag = isEmpty &&
                ((((node.type === 'Element' && !options.svelteStrictMode) ||
                    node.type === 'Head' ||
                    node.type === 'InlineComponent' ||
                    node.type === 'Slot' ||
                    node.type === 'SlotTemplate' ||
                    node.type === 'Title') &&
                    didSelfClose) ||
                    node.type === 'Window' ||
                    selfClosingTags.indexOf(node.name) !== -1 ||
                    isDoctypeTag);
            // Order important: print attributes first
            const attributes = path.map(printWithPrependedAttributeLine(node, options, print), 'attributes');
            const attributeLine = getAttributeLine(node, options);
            const possibleThisBinding = node.type === 'InlineComponent' && node.expression
                ? [attributeLine, 'this=', ...printJsExpression()]
                : node.type === 'Element' && node.tag
                    ? [
                        attributeLine,
                        'this=',
                        ...(typeof node.tag === 'string'
                            ? [`"${node.tag}"`]
                            : [open, printJS(path, print, 'tag'), close]),
                    ]
                    : '';
            if (isSelfClosingTag) {
                return group([
                    '<',
                    node.name,
                    indent(group([
                        possibleThisBinding,
                        ...attributes,
                        bracketSameLine || isDoctypeTag ? '' : dedent(line),
                    ])),
                    ...[bracketSameLine && !isDoctypeTag ? ' ' : '', `${isDoctypeTag ? '' : '/'}>`],
                ]);
            }
            const children = node.children;
            const firstChild = children[0];
            const lastChild = children[children.length - 1];
            // Is a function which is invoked later because printChildren will manipulate child nodes
            // which would wrongfully change the other checks about hugging etc done beforehand
            let body;
            const hugStart = shouldHugStart(node, isSupportedLanguage, options);
            const hugEnd = shouldHugEnd(node, isSupportedLanguage, options);
            if (isEmpty) {
                body =
                    isInlineElement(path, options, node) &&
                        node.children.length &&
                        isTextNodeStartingWithWhitespace(node.children[0]) &&
                        !isPreTagContent(path)
                        ? () => line
                        : () => (bracketSameLine ? softline : '');
            }
            else if (isPreTagContent(path)) {
                body = () => printPre(node, options.originalText, path, print);
            }
            else if (!isSupportedLanguage) {
                body = () => printRaw(node, options.originalText, true);
            }
            else if (isInlineElement(path, options, node) && !isPreTagContent(path)) {
                body = () => printChildren(path, print, options);
            }
            else {
                body = () => printChildren(path, print, options);
            }
            const openingTag = [
                '<',
                node.name,
                indent(group([
                    possibleThisBinding,
                    ...attributes,
                    hugStart && !isEmpty
                        ? ''
                        : !bracketSameLine && !isPreTagContent(path)
                            ? dedent(softline)
                            : '',
                ])),
            ];
            if (!isSupportedLanguage && !isEmpty) {
                // Format template tags so that there's a hardline but no indention.
                // That way the `lang="X"` and the closing `>` of the start tag stay in one line
                // which is the 99% use case.
                return group([
                    ...openingTag,
                    '>',
                    group([hardline, body(), hardline]),
                    `</${node.name}>`,
                ]);
            }
            if (hugStart && hugEnd) {
                const huggedContent = [softline, group(['>', body(), `</${node.name}`])];
                const omitSoftlineBeforeClosingTag = (isEmpty && !bracketSameLine) ||
                    canOmitSoftlineBeforeClosingTag(node, path, options);
                return group([
                    ...openingTag,
                    isEmpty ? group(huggedContent) : group(indent(huggedContent)),
                    omitSoftlineBeforeClosingTag ? '' : softline,
                    '>',
                ]);
            }
            // No hugging of content means it's either a block element and/or there's whitespace at the start/end
            let noHugSeparatorStart = softline;
            let noHugSeparatorEnd = softline;
            if (isPreTagContent(path)) {
                noHugSeparatorStart = '';
                noHugSeparatorEnd = '';
            }
            else {
                let didSetEndSeparator = false;
                if (!hugStart && firstChild && firstChild.type === 'Text') {
                    if (isTextNodeStartingWithLinebreak(firstChild) &&
                        firstChild !== lastChild &&
                        (!isInlineElement(path, options, node) ||
                            isTextNodeEndingWithWhitespace(lastChild))) {
                        noHugSeparatorStart = hardline;
                        noHugSeparatorEnd = hardline;
                        didSetEndSeparator = true;
                    }
                    else if (isInlineElement(path, options, node)) {
                        noHugSeparatorStart = line;
                    }
                    trimTextNodeLeft(firstChild);
                }
                if (!hugEnd && lastChild && lastChild.type === 'Text') {
                    if (isInlineElement(path, options, node) && !didSetEndSeparator) {
                        noHugSeparatorEnd = line;
                    }
                    trimTextNodeRight(lastChild);
                }
            }
            if (hugStart) {
                return group([
                    ...openingTag,
                    indent([softline, group(['>', body()])]),
                    noHugSeparatorEnd,
                    `</${node.name}>`,
                ]);
            }
            if (hugEnd) {
                return group([
                    ...openingTag,
                    '>',
                    indent([noHugSeparatorStart, group([body(), `</${node.name}`])]),
                    canOmitSoftlineBeforeClosingTag(node, path, options) ? '' : softline,
                    '>',
                ]);
            }
            if (isEmpty) {
                return group([...openingTag, '>', body(), `</${node.name}>`]);
            }
            return group([
                ...openingTag,
                '>',
                indent([noHugSeparatorStart, body()]),
                noHugSeparatorEnd,
                `</${node.name}>`,
            ]);
        }
        case 'Options':
            if (options.svelteSortOrder !== 'none') {
                throw new Error('Options tags should have been handled by prepareChildren');
            }
        // else fall through to Body
        case 'Body':
        case 'Document':
            return group([
                '<',
                node.name,
                indent(group([
                    ...path.map(printWithPrependedAttributeLine(node, options, print), 'attributes'),
                    bracketSameLine ? '' : dedent(line),
                ])),
                ...[bracketSameLine ? ' ' : '', '/>'],
            ]);
        case 'Document':
            return group([
                '<',
                node.name,
                indent(group([
                    ...path.map(printWithPrependedAttributeLine(node, options, print), 'attributes'),
                    bracketSameLine ? '' : dedent(line),
                ])),
                ...[bracketSameLine ? ' ' : '', '/>'],
            ]);
        case 'Identifier':
            return node.name;
        case 'AttributeShorthand': {
            return node.expression.name;
        }
        case 'Attribute': {
            if (isOrCanBeConvertedToShorthand(node)) {
                if (options.svelteAllowShorthand) {
                    return ['{', node.name, '}'];
                }
                else {
                    return [node.name, `=${open}`, node.name, close];
                }
            }
            else {
                if (node.value === true) {
                    return [node.name];
                }
                const quotes = !isLoneMustacheTag(node.value) ||
                    ((_a = (options.svelteStrictMode && !options._svelte_is5Plus)) !== null && _a !== void 0 ? _a : false);
                const attrNodeValue = printAttributeNodeValue(path, print, quotes, node);
                if (quotes) {
                    return [node.name, '=', '"', attrNodeValue, '"'];
                }
                else {
                    return [node.name, '=', attrNodeValue];
                }
            }
        }
        case 'MustacheTag':
            return ['{', printJS(path, print, 'expression'), '}'];
        case 'IfBlock': {
            const def = [
                '{#if ',
                printJS(path, print, 'expression'),
                '}',
                printSvelteBlockChildren(path, print, options),
            ];
            if (node.else) {
                def.push(path.call(print, 'else'));
            }
            def.push('{/if}');
            return group([def, breakParent]);
        }
        case 'ElseBlock': {
            // Else if
            const parent = path.getParentNode();
            if (node.children.length === 1 &&
                node.children[0].type === 'IfBlock' &&
                parent.type !== 'EachBlock') {
                const ifNode = node.children[0];
                const def = [
                    '{:else if ',
                    path.map((ifPath) => printJS(ifPath, print, 'expression'), 'children')[0],
                    '}',
                    path.map((ifPath) => printSvelteBlockChildren(ifPath, print, options), 'children')[0],
                ];
                if (ifNode.else) {
                    def.push(path.map((ifPath) => ifPath.call(print, 'else'), 'children')[0]);
                }
                return def;
            }
            return ['{:else}', printSvelteBlockChildren(path, print, options)];
        }
        case 'EachBlock': {
            const def = [
                '{#each ',
                printJS(path, print, 'expression'),
                ' as',
                expandNode(node.context, options.originalText),
            ];
            if (node.index) {
                def.push(', ', node.index);
            }
            if (node.key) {
                def.push(' (', printJS(path, print, 'key'), ')');
            }
            def.push('}', printSvelteBlockChildren(path, print, options));
            if (node.else) {
                def.push(path.call(print, 'else'));
            }
            def.push('{/each}');
            return group([def, breakParent]);
        }
        case 'AwaitBlock': {
            const hasPendingBlock = node.pending.children.some((n) => !isEmptyTextNode(n));
            const hasThenBlock = node.then.children.some((n) => !isEmptyTextNode(n));
            const hasCatchBlock = node.catch.children.some((n) => !isEmptyTextNode(n));
            let block = [];
            if (!hasPendingBlock && hasThenBlock) {
                block.push(group([
                    '{#await ',
                    printJS(path, print, 'expression'),
                    ' then',
                    expandNode(node.value, options.originalText),
                    '}',
                ]), path.call(print, 'then'));
            }
            else if (!hasPendingBlock && hasCatchBlock) {
                block.push(group([
                    '{#await ',
                    printJS(path, print, 'expression'),
                    ' catch',
                    expandNode(node.error, options.originalText),
                    '}',
                ]), path.call(print, 'catch'));
            }
            else {
                block.push(group(['{#await ', printJS(path, print, 'expression'), '}']));
                if (hasPendingBlock) {
                    block.push(path.call(print, 'pending'));
                }
                if (hasThenBlock) {
                    block.push(group(['{:then', expandNode(node.value, options.originalText), '}']), path.call(print, 'then'));
                }
            }
            if ((hasPendingBlock || hasThenBlock) && hasCatchBlock) {
                block.push(group(['{:catch', expandNode(node.error, options.originalText), '}']), path.call(print, 'catch'));
            }
            block.push('{/await}');
            return group(block);
        }
        case 'KeyBlock': {
            const def = [
                '{#key ',
                printJS(path, print, 'expression'),
                '}',
                printSvelteBlockChildren(path, print, options),
            ];
            def.push('{/key}');
            return group([def, breakParent]);
        }
        case 'ThenBlock':
        case 'PendingBlock':
        case 'CatchBlock':
            return printSvelteBlockChildren(path, print, options);
        // Svelte 5 only
        case 'SnippetBlock': {
            const snippet = ['{#snippet ', printJS(path, print, 'expression')];
            snippet.push('}', printSvelteBlockChildren(path, print, options), '{/snippet}');
            return snippet;
        }
        case 'EventHandler':
            return [
                'on:',
                node.name,
                node.modifiers && node.modifiers.length ? ['|', join('|', node.modifiers)] : '',
                node.expression ? ['=', ...printJsExpression()] : '',
            ];
        case 'Binding':
            return [
                'bind:',
                node.name,
                node.expression.type === 'Identifier' &&
                    node.expression.name === node.name &&
                    options.svelteAllowShorthand
                    ? ''
                    : ['=', ...printJsExpression()],
            ];
        case 'Class':
            return [
                'class:',
                node.name,
                node.expression.type === 'Identifier' &&
                    node.expression.name === node.name &&
                    options.svelteAllowShorthand
                    ? ''
                    : ['=', ...printJsExpression()],
            ];
        case 'StyleDirective':
            const prefix = [
                'style:',
                node.name,
                node.modifiers && node.modifiers.length ? ['|', join('|', node.modifiers)] : '',
            ];
            if (isOrCanBeConvertedToShorthand(node) || node.value === true) {
                if (options.svelteAllowShorthand) {
                    return [...prefix];
                }
                else {
                    return [...prefix, `=${open}`, node.name, close];
                }
            }
            else {
                const quotes = !isLoneMustacheTag(node.value) ||
                    ((_b = (options.svelteStrictMode && !options._svelte_is5Plus)) !== null && _b !== void 0 ? _b : false);
                const attrNodeValue = printAttributeNodeValue(path, print, quotes, node);
                if (quotes) {
                    return [...prefix, '=', '"', attrNodeValue, '"'];
                }
                else {
                    return [...prefix, '=', attrNodeValue];
                }
            }
        case 'Let':
            return [
                'let:',
                node.name,
                // shorthand let directives have `null` expressions
                !node.expression ||
                    (node.expression.type === 'Identifier' && node.expression.name === node.name)
                    ? ''
                    : ['=', ...printJsExpression()],
            ];
        case 'DebugTag':
            return [
                '{@debug',
                node.identifiers.length > 0
                    ? [' ', join(', ', path.map(print, 'identifiers'))]
                    : '',
                '}',
            ];
        case 'Ref':
            return ['ref:', node.name];
        case 'Comment': {
            const nodeAfterComment = getNextNode(path);
            if (isIgnoreStartDirective(node) && isNodeTopLevelHTML(node, path)) {
                ignoreRange = true;
            }
            else if (isIgnoreEndDirective(node) && isNodeTopLevelHTML(node, path)) {
                ignoreRange = false;
            }
            else if (
            // If there is no sibling node that starts right after us but the parent indicates
            // that there used to be, that means that node was actually an embedded `<style>`
            // or `<script>` node that was cut out.
            // If so, the comment does not refer to the next line we will see.
            // The `embed` function handles printing the comment in the right place.
            doesEmbedStartAfterNode(node, path) ||
                (isEmptyTextNode(nodeAfterComment) &&
                    doesEmbedStartAfterNode(nodeAfterComment, path))) {
                return '';
            }
            else if (isIgnoreDirective(node)) {
                ignoreNext = true;
            }
            return printComment(node);
        }
        case 'Transition':
            const kind = node.intro && node.outro ? 'transition' : node.intro ? 'in' : 'out';
            return [
                kind,
                ':',
                node.name,
                node.modifiers && node.modifiers.length ? ['|', join('|', node.modifiers)] : '',
                node.expression ? ['=', ...printJsExpression()] : '',
            ];
        case 'Action':
            return ['use:', node.name, node.expression ? ['=', ...printJsExpression()] : ''];
        case 'Animation':
            return ['animate:', node.name, node.expression ? ['=', ...printJsExpression()] : ''];
        case 'RawMustacheTag':
            return ['{@html ', printJS(path, print, 'expression'), '}'];
        // Svelte 5 only
        case 'RenderTag': {
            const render = ['{@render ', printJS(path, print, 'expression'), '}'];
            return render;
        }
        case 'Spread':
            return ['{...', printJS(path, print, 'expression'), '}'];
        case 'ConstTag':
            return ['{@const ', printJS(path, print, 'expression'), '}'];
    }
    console.error(JSON.stringify(node, null, 4));
    throw new Error('unknown node type: ' + node.type);
}
function printTopLevelParts(n, options, path, print) {
    if (options.svelteSortOrder === 'none') {
        const topLevelPartsByEnd = {};
        if (n.module) {
            topLevelPartsByEnd[n.module.end] = n.module;
        }
        if (n.instance) {
            topLevelPartsByEnd[n.instance.end] = n.instance;
        }
        if (n.css) {
            topLevelPartsByEnd[n.css.end] = n.css;
        }
        const children = getChildren(n.html);
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            if (topLevelPartsByEnd[node.start]) {
                children.splice(i, 0, topLevelPartsByEnd[node.start]);
                delete topLevelPartsByEnd[node.start];
            }
        }
        const result = path.call(print, 'html');
        if (options.insertPragma && !hasPragma(options.originalText)) {
            return [`<!-- @format -->`, hardline, result];
        }
        else {
            return result;
        }
    }
    const parts = {
        options: [],
        scripts: [],
        markup: [],
        styles: [],
    };
    // scripts
    if (n.module) {
        parts.scripts.push(path.call(print, 'module'));
    }
    if (n.instance) {
        parts.scripts.push(path.call(print, 'instance'));
    }
    // styles
    if (n.css) {
        parts.styles.push(path.call(print, 'css'));
    }
    // markup
    const htmlDoc = path.call(print, 'html');
    if (htmlDoc) {
        parts.markup.push(htmlDoc);
    }
    if (svelteOptionsDoc) {
        parts.options.push(svelteOptionsDoc);
    }
    const docs = flatten(parseSortOrder(options.svelteSortOrder).map((p) => parts[p]));
    // Need to reset these because they are global and could affect the next formatting run
    ignoreNext = false;
    ignoreRange = false;
    svelteOptionsDoc = undefined;
    // If this is invoked as an embed of markdown, remove the last hardline.
    // The markdown parser tries this, too, but fails because it does not
    // recurse into concats. Doing this will prevent an empty line
    // at the end of the embedded code block.
    if (options.parentParser === 'markdown') {
        const lastDoc = docs[docs.length - 1];
        trimRight([lastDoc], isLine);
    }
    if (options.insertPragma && !hasPragma(options.originalText)) {
        return [`<!-- @format -->`, hardline, group(docs)];
    }
    else {
        return group([join(hardline, docs)]);
    }
}
function printAttributeNodeValue(path, print, quotes, node) {
    const valueDocs = path.map((childPath) => childPath.call(print), 'value');
    if (!quotes || !formattableAttributes.includes(node.name)) {
        return valueDocs;
    }
    else {
        return indent(group(trim(valueDocs, isLine)));
    }
}
function printSvelteBlockChildren(path, print, options) {
    const node = path.getValue();
    const children = node.children;
    if (!children || children.length === 0) {
        return '';
    }
    const whitespaceAtStartOfBlock = checkWhitespaceAtStartOfSvelteBlock(node, options);
    const whitespaceAtEndOfBlock = checkWhitespaceAtEndOfSvelteBlock(node, options);
    const startline = whitespaceAtStartOfBlock === 'none'
        ? ''
        : whitespaceAtEndOfBlock === 'line' || whitespaceAtStartOfBlock === 'line'
            ? hardline
            : line;
    const endline = whitespaceAtEndOfBlock === 'none'
        ? ''
        : whitespaceAtEndOfBlock === 'line' || whitespaceAtStartOfBlock === 'line'
            ? hardline
            : line;
    const firstChild = children[0];
    const lastChild = children[children.length - 1];
    if (isTextNodeStartingWithWhitespace(firstChild)) {
        trimTextNodeLeft(firstChild);
    }
    if (isTextNodeEndingWithWhitespace(lastChild)) {
        trimTextNodeRight(lastChild);
    }
    return [indent([startline, group(printChildren(path, print, options))]), endline];
}
function printPre(node, originalText, path, print) {
    const result = [];
    const length = node.children.length;
    for (let i = 0; i < length; i++) {
        const child = node.children[i];
        if (child.type === 'Text') {
            const lines = originalText.substring(child.start, child.end).split(/\r?\n/);
            lines.forEach((line, j) => {
                if (j > 0)
                    result.push(literalline);
                result.push(line);
            });
        }
        else {
            result.push(path.call(print, 'children', i));
        }
    }
    return result;
}
function printChildren(path, print, options) {
    if (isPreTagContent(path)) {
        return path.map(print, 'children');
    }
    const childNodes = prepareChildren(path.getValue().children, path, print, options);
    // modify original array because it's accessed later through map(print, 'children', idx)
    path.getValue().children = childNodes;
    if (childNodes.length === 0) {
        return '';
    }
    const childDocs = [];
    let handleWhitespaceOfPrevTextNode = false;
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        if (childNode.type === 'Text') {
            handleTextChild(i, childNode);
        }
        else if (isBlockElement(childNode, options)) {
            handleBlockChild(i);
        }
        else if (isInlineElement(path, options, childNode)) {
            handleInlineChild(i);
        }
        else {
            childDocs.push(printChild(i));
            handleWhitespaceOfPrevTextNode = false;
        }
    }
    // If there's at least one block element and more than one node, break content
    const forceBreakContent = childNodes.length > 1 && childNodes.some((child) => isBlockElement(child, options));
    if (forceBreakContent) {
        childDocs.push(breakParent);
    }
    return childDocs;
    function printChild(idx) {
        return path.call(print, 'children', idx);
    }
    /**
     * Print inline child. Hug whitespace of previous text child if there was one.
     */
    function handleInlineChild(idx) {
        if (handleWhitespaceOfPrevTextNode) {
            childDocs.push(group([line, printChild(idx)]));
        }
        else {
            childDocs.push(printChild(idx));
        }
        handleWhitespaceOfPrevTextNode = false;
    }
    /**
     * Print block element. Add softlines around it if needed
     * so it breaks into a separate line if children are broken up.
     * Don't add lines at the start/end if it's the first/last child because this
     * kind of whitespace handling is done in the parent already.
     */
    function handleBlockChild(idx) {
        const prevChild = childNodes[idx - 1];
        if (prevChild &&
            !isBlockElement(prevChild, options) &&
            (prevChild.type !== 'Text' ||
                handleWhitespaceOfPrevTextNode ||
                !isTextNodeEndingWithWhitespace(prevChild))) {
            childDocs.push(softline);
        }
        childDocs.push(printChild(idx));
        const nextChild = childNodes[idx + 1];
        if (nextChild &&
            (nextChild.type !== 'Text' ||
                // Only handle text which starts with a whitespace and has text afterwards,
                // or is empty but followed by an inline element. The latter is done
                // so that if the children break, the inline element afterwards is in a separate line.
                ((!isEmptyTextNode(nextChild) ||
                    (childNodes[idx + 2] && isInlineElement(path, options, childNodes[idx + 2]))) &&
                    !isTextNodeStartingWithLinebreak(nextChild)))) {
            childDocs.push(softline);
        }
        handleWhitespaceOfPrevTextNode = false;
    }
    /**
     * Print text child. First/last child white space handling
     * is done in parent already. By definition of the Svelte AST,
     * a text node always is inbetween other tags. Add hardlines
     * if the users wants to have them inbetween.
     * If the text is trimmed right, toggle flag telling
     * subsequent (inline)block element to alter its printing logic
     * to check if they need to hug or print lines themselves.
     */
    function handleTextChild(idx, childNode) {
        handleWhitespaceOfPrevTextNode = false;
        if (idx === 0 || idx === childNodes.length - 1) {
            childDocs.push(printChild(idx));
            return;
        }
        const prevNode = childNodes[idx - 1];
        const nextNode = childNodes[idx + 1];
        if (isTextNodeStartingWithWhitespace(childNode) &&
            // If node is empty, go straight through to checking the right end
            !isEmptyTextNode(childNode)) {
            if (isInlineElement(path, options, prevNode) &&
                !isTextNodeStartingWithLinebreak(childNode)) {
                trimTextNodeLeft(childNode);
                const lastChildDoc = childDocs.pop();
                childDocs.push(group([lastChildDoc, line]));
            }
            if (isBlockElement(prevNode, options) && !isTextNodeStartingWithLinebreak(childNode)) {
                trimTextNodeLeft(childNode);
            }
        }
        if (isTextNodeEndingWithWhitespace(childNode)) {
            if (isInlineElement(path, options, nextNode) &&
                !isTextNodeEndingWithLinebreak(childNode)) {
                handleWhitespaceOfPrevTextNode = !prevNode || !isBlockElement(prevNode, options);
                trimTextNodeRight(childNode);
            }
            if (isBlockElement(nextNode, options) && !isTextNodeEndingWithLinebreak(childNode, 2)) {
                handleWhitespaceOfPrevTextNode = !prevNode || !isBlockElement(prevNode, options);
                trimTextNodeRight(childNode);
            }
        }
        childDocs.push(printChild(idx));
    }
}
/**
 * `svelte:options` is part of the html part but needs to be snipped out and handled
 * separately to reorder it as configured. The comment above it should be moved with it.
 * Do that here.
 */
function prepareChildren(children, path, print, options) {
    let svelteOptionsComment;
    const childrenWithoutOptions = [];
    const bracketSameLine = isBracketSameLine(options);
    for (let idx = 0; idx < children.length; idx++) {
        const currentChild = children[idx];
        if (currentChild.type === 'Text' && getUnencodedText(currentChild) === '') {
            continue;
        }
        if (isEmptyTextNode(currentChild) && doesEmbedStartAfterNode(currentChild, path)) {
            continue;
        }
        if (options.svelteSortOrder !== 'none') {
            if (isCommentFollowedByOptions(currentChild, idx)) {
                svelteOptionsComment = printComment(currentChild);
                const nextChild = children[idx + 1];
                idx += nextChild && isEmptyTextNode(nextChild) ? 1 : 0;
                continue;
            }
            if (currentChild.type === 'Options') {
                printSvelteOptions(currentChild, idx, path, print);
                continue;
            }
        }
        childrenWithoutOptions.push(currentChild);
    }
    const mergedChildrenWithoutOptions = [];
    for (let idx = 0; idx < childrenWithoutOptions.length; idx++) {
        const currentChild = childrenWithoutOptions[idx];
        const nextChild = childrenWithoutOptions[idx + 1];
        if (currentChild.type === 'Text' && nextChild && nextChild.type === 'Text') {
            // A tag was snipped out (f.e. svelte:options). Join text
            currentChild.raw += nextChild.raw;
            currentChild.data += nextChild.data;
            idx++;
        }
        mergedChildrenWithoutOptions.push(currentChild);
    }
    return mergedChildrenWithoutOptions;
    function printSvelteOptions(node, idx, path, print) {
        svelteOptionsDoc = group([
            [
                '<',
                node.name,
                indent(group([
                    ...path.map(printWithPrependedAttributeLine(node, options, print), 'children', idx, 'attributes'),
                    bracketSameLine ? '' : dedent(line),
                ])),
                ...[bracketSameLine ? ' ' : '', '/>'],
            ],
            hardline,
        ]);
        if (svelteOptionsComment) {
            svelteOptionsDoc = group([svelteOptionsComment, hardline, svelteOptionsDoc]);
        }
    }
    function isCommentFollowedByOptions(node, idx) {
        if (node.type !== 'Comment' || isIgnoreEndDirective(node) || isIgnoreStartDirective(node)) {
            return false;
        }
        const nextChild = children[idx + 1];
        if (nextChild) {
            if (isEmptyTextNode(nextChild)) {
                const afterNext = children[idx + 2];
                return afterNext && afterNext.type === 'Options';
            }
            return nextChild.type === 'Options';
        }
        return false;
    }
}
/**
 * Split the text into words separated by whitespace. Replace the whitespaces by lines,
 * collapsing multiple whitespaces into a single line.
 *
 * If the text starts or ends with multiple newlines, two of those should be kept.
 */
function splitTextToDocs(node) {
    const text = getUnencodedText(node);
    const lines = text.split(/[\t\n\f\r ]+/);
    let docs = join(line, lines).filter((doc) => doc !== '');
    if (startsWithLinebreak(text)) {
        docs[0] = hardline;
    }
    if (startsWithLinebreak(text, 2)) {
        docs = [hardline, ...docs];
    }
    if (endsWithLinebreak(text)) {
        docs[docs.length - 1] = hardline;
    }
    if (endsWithLinebreak(text, 2)) {
        docs = [...docs, hardline];
    }
    return docs;
}
function printJS(path, print, name) {
    return path.call(print, name);
}
function expandNode(node, original) {
    let str = _expandNode(node);
    if (node === null || node === void 0 ? void 0 : node.typeAnnotation) {
        str += ': ' + original.slice(node.typeAnnotation.start, node.typeAnnotation.end);
    }
    return str;
}
function _expandNode(node, parent) {
    if (node === null) {
        return '';
    }
    if (typeof node === 'string') {
        // pre-v3.20 AST
        return ' ' + node;
    }
    switch (node.type) {
        case 'ArrayExpression':
        case 'ArrayPattern':
            return ' [' + node.elements.map(_expandNode).join(',').slice(1) + ']';
        case 'AssignmentPattern':
            return _expandNode(node.left) + ' =' + _expandNode(node.right);
        case 'Identifier':
            return ' ' + node.name;
        case 'Literal':
            return ' ' + node.raw;
        case 'ObjectExpression':
            return ' {' + node.properties.map((p) => _expandNode(p, node)).join(',') + ' }';
        case 'ObjectPattern':
            return ' {' + node.properties.map(_expandNode).join(',') + ' }';
        case 'Property':
            if (node.value.type === 'ObjectPattern' || node.value.type === 'ArrayPattern') {
                return ' ' + node.key.name + ':' + _expandNode(node.value);
            }
            else if ((node.value.type === 'Identifier' && node.key.name !== node.value.name) ||
                (parent && parent.type === 'ObjectExpression')) {
                return _expandNode(node.key) + ':' + _expandNode(node.value);
            }
            else {
                return _expandNode(node.value);
            }
        case 'RestElement':
            return ' ...' + node.argument.name;
    }
    console.error(JSON.stringify(node, null, 4));
    throw new Error('unknown node type: ' + node.type);
}
function printComment(node) {
    let text = node.data;
    if (hasSnippedContent(text)) {
        text = unsnipContent(text);
    }
    return group(['<!--', text, '-->']);
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function getText(node, options, unsnip = false) {
    const leadingComments = node.leadingComments;
    const text = options.originalText.slice(options.locStart(
    // if there are comments before the node they are not included
    // in the `start` of the node itself
    (leadingComments && leadingComments[0]) || node), options.locEnd(node));
    if (!unsnip || !hasSnippedContent(text)) {
        return text;
    }
    return unsnipContent(text);
}

const extractAttributesRegex = /<[a-z]+((?:\s+[^=>'"\/]+=(?:"[^"]*"|'[^']*'|[^>\s]+)|\s+[^=>'"\/]+)*\s*)>/im;
const attributeRegex = /([^\s=]+)(?:=(?:(?:("|')([\s\S]*?)\2)|(?:([^>\s]+?)(?:\s|>|$))))?/gim;
function extractAttributes(html) {
    const [, attributesString] = html.match(extractAttributesRegex);
    const attrs = [];
    let match;
    while ((match = attributeRegex.exec(attributesString))) {
        const [all, name, quotes, valueQuoted, valueUnquoted] = match;
        const value = valueQuoted || valueUnquoted;
        const attrStart = match.index;
        let valueNode;
        if (!value) {
            valueNode = true;
        }
        else {
            let valueStart = attrStart + name.length;
            if (quotes) {
                valueStart += 2;
            }
            valueNode = [
                {
                    type: 'Text',
                    data: value,
                    start: valueStart,
                    end: valueStart + value.length,
                },
            ];
        }
        attrs.push({
            type: 'Attribute',
            name,
            value: valueNode,
            start: attrStart,
            end: attrStart + all.length,
        });
    }
    return attrs;
}

const { builders: { group: group$1, hardline: hardline$1, softline: softline$1, indent: indent$1, dedent: dedent$1, literalline: literalline$1 }, utils: { removeLines }, } = doc;
const leaveAlone = new Set([
    'Script',
    'Style',
    'Identifier',
    'MemberExpression',
    'CallExpression',
    'ArrowFunctionExpression',
]);
const dontTraverse = new Set(['start', 'end', 'type']);
function getVisitorKeys(node, nonTraversableKeys) {
    return Object.keys(node).filter((key) => {
        return !nonTraversableKeys.has(key) && !leaveAlone.has(node.type) && !dontTraverse.has(key);
    });
}
// Embed works like this in Prettier v3:
// - do depth first traversal of all node properties
// - deepest property is calling embed first
// - if embed returns a function, it will be called after the traversal in a second pass, in the same order (deepest first)
// For performance reasons we try to only return functions when we're sure we need to transform something.
function embed(path, _options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const node = path.getNode();
    const options = _options;
    if (!options.locStart || !options.locEnd || !options.originalText) {
        throw new Error('Missing required options');
    }
    if (isASTNode(node)) {
        assignCommentsToNodes(node);
        if (node.module) {
            node.module.type = 'Script';
            node.module.attributes = extractAttributes(getText(node.module, options));
        }
        if (node.instance) {
            node.instance.type = 'Script';
            node.instance.attributes = extractAttributes(getText(node.instance, options));
        }
        if (node.css) {
            node.css.type = 'Style';
            node.css.content.type = 'StyleProgram';
        }
        return null;
    }
    // embed does depth first traversal with deepest node called first, therefore we need to
    // check the parent to see if we are inside an expression that should be embedded.
    const parent = path.getParentNode();
    const printJsExpression = () => {
        var _a;
        return parent.expression
            ? printJS$1(parent, (_a = (options.svelteStrictMode && !options._svelte_is5Plus)) !== null && _a !== void 0 ? _a : false, false, false, 'expression')
            : undefined;
    };
    const printSvelteBlockJS = (name) => printJS$1(parent, false, true, false, name);
    switch (parent.type) {
        case 'IfBlock':
        case 'ElseBlock':
        case 'AwaitBlock':
        case 'KeyBlock':
            printSvelteBlockJS('expression');
            break;
        case 'EachBlock':
            printSvelteBlockJS('expression');
            printSvelteBlockJS('key');
            break;
        case 'SnippetBlock':
            // We merge the two parts into one expression, which future-proofs this for template TS support
            if (node === parent.expression) {
                parent.expression.end =
                    options.originalText.indexOf(')', (_e = (_b = (_a = parent.context) === null || _a === void 0 ? void 0 : _a.end) !== null && _b !== void 0 ? _b : (_d = (_c = parent.parameters) === null || _c === void 0 ? void 0 : _c[parent.parameters.length - 1]) === null || _d === void 0 ? void 0 : _d.end) !== null && _e !== void 0 ? _e : parent.expression.end) + 1;
                parent.context = null;
                parent.parameters = null;
                node.isJS = true;
                node.asFunction = true;
            }
            break;
        case 'Element':
            printJS$1(parent, (_f = (options.svelteStrictMode && !options._svelte_is5Plus)) !== null && _f !== void 0 ? _f : false, false, false, 'tag');
            break;
        case 'MustacheTag':
            printJS$1(parent, isInsideQuotedAttribute(path, options), false, false, 'expression');
            break;
        case 'RawMustacheTag':
            printJS$1(parent, false, false, false, 'expression');
            break;
        case 'Spread':
            printJS$1(parent, false, false, false, 'expression');
            break;
        case 'ConstTag':
            printJS$1(parent, false, false, true, 'expression');
            break;
        case 'RenderTag':
            if (node === parent.expression) {
                // TODO: remove this if block at some point, snippet API changed in .next-..
                if ('argument' in parent || 'arguments' in parent) {
                    parent.expression.end =
                        options.originalText.indexOf(')', (_l = (_h = (_g = parent.argument) === null || _g === void 0 ? void 0 : _g.end) !== null && _h !== void 0 ? _h : (_k = (_j = parent.arguments) === null || _j === void 0 ? void 0 : _j[parent.arguments.length - 1]) === null || _k === void 0 ? void 0 : _k.end) !== null && _l !== void 0 ? _l : parent.expression.end) + 1;
                    parent.argument = null;
                    parent.arguments = null;
                }
                printJS$1(parent, false, false, false, 'expression');
            }
            break;
        case 'EventHandler':
        case 'Binding':
        case 'Class':
        case 'Let':
        case 'Transition':
        case 'Action':
        case 'Animation':
        case 'InlineComponent':
            printJsExpression();
            break;
    }
    if (node.isJS) {
        return (textToDoc) => __awaiter(this, void 0, void 0, function* () {
            try {
                const embeddedOptions = {
                    // Prettier only allows string references as parsers from v3 onwards,
                    // so we need to have another public parser and defer to that
                    parser: options._svelte_ts
                        ? 'svelteTSExpressionParser'
                        : 'svelteExpressionParser',
                    singleQuote: node.forceSingleQuote ? true : options.singleQuote,
                    _svelte_asFunction: node.asFunction,
                };
                // If we have snipped content, it was done wrongly and we need to unsnip it.
                // This happens for example for {@html `<script>{foo}</script>`}
                const text = getText(node, options, true);
                let docs = yield textToDoc(node.asFunction ? forceIntoFunction(text) : forceIntoExpression(text), embeddedOptions);
                if (node.forceSingleLine) {
                    docs = removeLines(docs);
                }
                if (node.removeParentheses) {
                    docs = removeParentheses(docs);
                }
                if (node.asFunction) {
                    if (Array.isArray(docs) && typeof docs[0] === 'string') {
                        docs[0] = docs[0].replace('function ', '');
                        docs.splice(-1, 1);
                    }
                    else {
                        throw new Error('Prettier AST changed, asFunction logic needs to change');
                    }
                }
                return docs;
            }
            catch (e) {
                return getText(node, options, true);
            }
        });
    }
    const embedType = (tag, parser, isTopLevel) => {
        return (textToDoc, print) => __awaiter(this, void 0, void 0, function* () {
            return embedTag(tag, options.originalText, path, (content) => formatBodyContent(content, parser, textToDoc, options), print, isTopLevel, options);
        });
    };
    const embedScript = (isTopLevel) => embedType('script', 
    // Use babel-ts as fallback because the absence does not mean the content is not TS,
    // the user could have set the default language. babel-ts will format things a little
    // bit different though, especially preserving parentheses around dot notation which
    // fixes https://github.com/sveltejs/prettier-plugin-svelte/issues/218
    isTypeScript(node) ? 'typescript' : isJSON(node) ? 'json' : 'babel-ts', isTopLevel);
    const embedStyle = (isTopLevel) => embedType('style', isLess(node) ? 'less' : isScss(node) ? 'scss' : 'css', isTopLevel);
    const embedPug = () => embedType('template', 'pug', false);
    switch (node.type) {
        case 'Script':
            return embedScript(true);
        case 'Style':
            return embedStyle(true);
        case 'Element': {
            if (node.name === 'script') {
                return embedScript(false);
            }
            else if (node.name === 'style') {
                return embedStyle(false);
            }
            else if (isPugTemplate(node)) {
                return embedPug();
            }
        }
    }
    return null;
}
function forceIntoExpression(statement) {
    // note the trailing newline: if the statement ends in a // comment,
    // we can't add the closing bracket right afterwards
    return `(${statement}\n)`;
}
function forceIntoFunction(statement) {
    return `function ${statement} {}`;
}
function preformattedBody(str) {
    if (!str) {
        return '';
    }
    const firstNewline = /^[\t\f\r ]*\n/;
    const lastNewline = /\n[\t\f\r ]*$/;
    // If we do not start with a new line prettier might try to break the opening tag
    // to keep it together with the string. Use a literal line to skip indentation.
    return [literalline$1, str.replace(firstNewline, '').replace(lastNewline, ''), hardline$1];
}
function getSnippedContent(node) {
    const encodedContent = getAttributeTextValue(snippedTagContentAttribute, node);
    if (encodedContent) {
        return base64ToString(encodedContent);
    }
    else {
        return '';
    }
}
function formatBodyContent(content, parser, textToDoc, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield textToDoc(content, { parser });
            if (parser === 'pug' && typeof body === 'string') {
                // Pug returns no docs but a final string.
                // Therefore prepend the line offsets
                const whitespace = options.useTabs
                    ? '\t'
                    : ' '.repeat(options.pugTabWidth && options.pugTabWidth > 0
                        ? options.pugTabWidth
                        : options.tabWidth);
                const pugBody = body
                    .split('\n')
                    .map((line) => (line ? whitespace + line : line))
                    .join('\n');
                return [hardline$1, pugBody];
            }
            const indentIfDesired = (doc) => options.svelteIndentScriptAndStyle ? indent$1(doc) : doc;
            trimRight([body], isLine);
            return [indentIfDesired([hardline$1, body]), hardline$1];
        }
        catch (error) {
            if (process.env.PRETTIER_DEBUG) {
                throw error;
            }
            // We will wind up here if there is a syntax error in the embedded code. If we throw an error,
            // prettier will try to print the node with the printer. That will fail with a hard-to-interpret
            // error message (e.g. "Unsupported node type", referring to `<script>`).
            // Therefore, fall back on just returning the unformatted text.
            console.error(error);
            return preformattedBody(content);
        }
    });
}
function embedTag(tag, text, path, formatBodyContent, print, isTopLevel, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const node = path.getNode();
        const content = tag === 'template' ? printRaw(node, text) : getSnippedContent(node);
        const previousComments = node.type === 'Script' || node.type === 'Style'
            ? node.comments
            : [getLeadingComment(path)]
                .filter(Boolean)
                .map((comment) => ({ comment: comment, emptyLineAfter: false }));
        const canFormat = isNodeSupportedLanguage(node) &&
            !isIgnoreDirective((_a = previousComments[previousComments.length - 1]) === null || _a === void 0 ? void 0 : _a.comment) &&
            (tag !== 'template' ||
                options.plugins.some((plugin) => typeof plugin !== 'string' && plugin.parsers && plugin.parsers.pug));
        const body = canFormat
            ? content.trim() !== ''
                ? yield formatBodyContent(content)
                : content === ''
                    ? ''
                    : hardline$1
            : preformattedBody(content);
        const openingTag = group$1([
            '<',
            tag,
            indent$1(group$1([
                ...path.map(printWithPrependedAttributeLine(node, options, print), 'attributes'),
                isBracketSameLine(options) ? '' : dedent$1(softline$1),
            ])),
            '>',
        ]);
        let result = group$1([openingTag, body, '</', tag, '>']);
        const comments = [];
        for (const comment of previousComments) {
            comments.push('<!--', comment.comment.data, '-->');
            comments.push(hardline$1);
            if (comment.emptyLineAfter) {
                comments.push(hardline$1);
            }
        }
        if (isTopLevel && options.svelteSortOrder !== 'none') {
            // top level embedded nodes have been moved from their normal position in the
            // node tree. if there is a comment referring to it, it must be recreated at
            // the new position.
            return [...comments, result, hardline$1];
        }
        else {
            // Only comments at the top level get the special "move comment" treatment.
            return isTopLevel && comments.length ? [...comments, result] : result;
        }
    });
}
function printJS$1(node, forceSingleQuote, forceSingleLine, removeParentheses, name) {
    const part = node[name];
    if (!part || typeof part !== 'object') {
        return;
    }
    part.isJS = true;
    part.forceSingleQuote = forceSingleQuote;
    part.forceSingleLine = forceSingleLine;
    part.removeParentheses = removeParentheses;
}

const babelParser = parsers$1.babel;
const typescriptParser = parsers$1['babel-ts']; // TODO use TypeScript parser in next major?
const isSvelte5Plus = Number(VERSION.split('.')[0]) >= 5;
function locStart(node) {
    return node.start;
}
function locEnd(node) {
    return node.end;
}
const languages = [
    {
        name: 'svelte',
        parsers: ['svelte'],
        extensions: ['.svelte'],
        vscodeLanguageIds: ['svelte'],
    },
];
const parsers = {
    svelte: {
        hasPragma,
        parse: (text) => {
            try {
                return Object.assign(Object.assign({}, parse(text)), { __isRoot: true });
            }
            catch (err) {
                if (err.start != null && err.end != null) {
                    // Prettier expects error objects to have loc.start and loc.end fields.
                    // Svelte uses start and end directly on the error.
                    err.loc = {
                        start: err.start,
                        end: err.end,
                    };
                }
                throw err;
            }
        },
        preprocess: (text, options) => {
            const result = snipScriptAndStyleTagContent(text);
            text = result.text.trim();
            // Prettier sets the preprocessed text as the originalText in case
            // the Svelte formatter is called directly. In case it's called
            // as an embedded parser (for example when there's a Svelte code block
            // inside markdown), the originalText is not updated after preprocessing.
            // Therefore we do it ourselves here.
            options.originalText = text;
            // Only Svelte 5 can have TS in the template
            options._svelte_ts = isSvelte5Plus && result.isTypescript;
            options._svelte_is5Plus = isSvelte5Plus;
            return text;
        },
        locStart,
        locEnd,
        astFormat: 'svelte-ast',
    },
    svelteExpressionParser: Object.assign(Object.assign({}, babelParser), { parse: (text, options) => {
            const ast = babelParser.parse(text, options);
            let program = ast.program.body[0];
            if (!options._svelte_asFunction) {
                program = program.expression;
            }
            return Object.assign(Object.assign({}, ast), { program });
        } }),
    svelteTSExpressionParser: Object.assign(Object.assign({}, typescriptParser), { parse: (text, options) => {
            const ast = typescriptParser.parse(text, options);
            let program = ast.program.body[0];
            if (!options._svelte_asFunction) {
                program = program.expression;
            }
            return Object.assign(Object.assign({}, ast), { program });
        } }),
};
const printers = {
    'svelte-ast': {
        print,
        embed,
        // @ts-expect-error Prettier's type definitions are wrong
        getVisitorKeys,
    },
};

export { languages, options, parsers, printers };
