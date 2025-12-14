/**
 * Babel plugin for SSGOI auto key injection
 *
 * Automatically injects unique keys into transition() calls based on:
 * - File path + line + column for unique identification
 * - JSX key prop if present (for list items)
 *
 * @example
 * // babel.config.js
 * module.exports = {
 *   presets: ["next/babel"],
 *   plugins: ["@ssgoi/react/plugin/auto-key"],
 * };
 *
 * @example
 * // vite.config.ts
 * import react from "@vitejs/plugin-react";
 *
 * export default {
 *   plugins: [
 *     react({
 *       babel: {
 *         plugins: ["@ssgoi/react/plugin/auto-key"],
 *       },
 *     }),
 *   ],
 * };
 *
 * @example
 * // Before transformation
 * <div ref={transition({ ...fade() })} />
 *
 * // After transformation
 * <div ref={transition({ ...fade(), key: "page.tsx:5:10" })} />
 *
 * @example
 * // Before (with JSX key for list items)
 * <div key={item.id} ref={transition({ ...fade() })} />
 *
 * // After
 * <div key={item.id} ref={transition({ ...fade(), key: `page.tsx:8:10:${item.id}` })} />
 */

module.exports = function (babel) {
  const { types: t } = babel;

  return {
    name: "babel-plugin-ssgoi-auto-key",
    visitor: {
      CallExpression(path, state) {
        // Check if this is a transition() call
        const callee = path.node.callee;
        if (!t.isIdentifier(callee) || callee.name !== "transition") {
          return;
        }

        // Skip if already processed (marked)
        if (path.node._ssgoiProcessed) {
          return;
        }
        path.node._ssgoiProcessed = true;

        // Get the first argument (options object)
        const args = path.node.arguments;
        if (args.length === 0) {
          return;
        }

        const firstArg = args[0];

        // Skip if already wrapped with spread + key pattern
        if (
          t.isObjectExpression(firstArg) &&
          firstArg.properties.length >= 2 &&
          t.isSpreadElement(firstArg.properties[0]) &&
          t.isObjectProperty(firstArg.properties[firstArg.properties.length - 1]) &&
          t.isIdentifier(firstArg.properties[firstArg.properties.length - 1].key) &&
          firstArg.properties[firstArg.properties.length - 1].key.name === "key"
        ) {
          return;
        }

        // Get file info for key generation
        const filename = state.filename || "unknown";
        const shortFilename = filename.split("/").pop() || filename;
        const loc = path.node.loc;
        const line = loc?.start?.line ?? 0;
        const column = loc?.start?.column ?? 0;
        const baseKey = `${shortFilename}:${line}:${column}`;

        // Try to find parent JSX element and its key prop
        let jsxKeyValue = null;
        let jsxParent = path.findParent(
          (p) => p.isJSXElement() || p.isJSXFragment()
        );

        if (jsxParent && t.isJSXElement(jsxParent.node)) {
          const keyAttr = jsxParent.node.openingElement.attributes.find(
            (attr) =>
              t.isJSXAttribute(attr) &&
              t.isJSXIdentifier(attr.name) &&
              attr.name.name === "key"
          );

          if (keyAttr && t.isJSXAttribute(keyAttr)) {
            if (t.isJSXExpressionContainer(keyAttr.value)) {
              jsxKeyValue = keyAttr.value.expression;
            } else if (t.isStringLiteral(keyAttr.value)) {
              jsxKeyValue = keyAttr.value;
            }
          }
        }

        // Create the key value (string or template literal)
        let keyValue;
        if (jsxKeyValue && !t.isJSXEmptyExpression(jsxKeyValue)) {
          // Template literal: `baseKey:${jsxKeyValue}`
          keyValue = t.templateLiteral(
            [
              t.templateElement({ raw: `${baseKey}:`, cooked: `${baseKey}:` }),
              t.templateElement({ raw: "", cooked: "" }, true),
            ],
            [jsxKeyValue]
          );
        } else {
          // Simple string
          keyValue = t.stringLiteral(baseKey);
        }

        // Create key property
        const keyProperty = t.objectProperty(t.identifier("key"), keyValue);

        if (t.isObjectExpression(firstArg)) {
          // Check if key already exists
          const hasKey = firstArg.properties.some(
            (prop) =>
              t.isObjectProperty(prop) &&
              t.isIdentifier(prop.key) &&
              prop.key.name === "key"
          );

          if (hasKey) {
            return; // Skip if key already exists
          }

          // Add key at the end (after spreads)
          firstArg.properties.push(keyProperty);
        } else {
          // For variables, conditionals, function calls, etc.
          // Wrap with spread: { ...originalArg, key: "..." }
          args[0] = t.objectExpression([
            t.spreadElement(firstArg),
            keyProperty,
          ]);
        }
      },
    },
  };
};
