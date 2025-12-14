import { createUnplugin, type UnpluginFactory } from "unplugin";
import { transformSync } from "@babel/core";

export interface SsgoiAutoKeyOptions {
  /**
   * File extensions to process
   * @default ['.tsx', '.jsx']
   */
  include?: string[];
  /**
   * File patterns to exclude
   * @default [/node_modules/]
   */
  exclude?: (string | RegExp)[];
}

const defaultOptions: Required<SsgoiAutoKeyOptions> = {
  include: [".tsx", ".jsx"],
  exclude: [/node_modules/],
};

/**
 * Babel plugin for SSGOI auto key injection
 * Extracted as a function for use in unplugin transform
 */
function createBabelPlugin() {
  return function babelPluginSsgoiAutoKey({
    types: t,
  }: {
    types: typeof import("@babel/types");
  }) {
    return {
      name: "babel-plugin-ssgoi-auto-key",
      visitor: {
        CallExpression(
          path: import("@babel/traverse").NodePath<
            import("@babel/types").CallExpression
          >,
          state: { filename?: string },
        ) {
          const callee = path.node.callee;
          if (!t.isIdentifier(callee) || callee.name !== "transition") {
            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((path.node as any)._ssgoiProcessed) {
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (path.node as any)._ssgoiProcessed = true;

          const args = path.node.arguments;
          if (args.length === 0) {
            return;
          }

          const firstArg = args[0];

          if (
            t.isObjectExpression(firstArg) &&
            firstArg.properties.length >= 2 &&
            t.isSpreadElement(firstArg.properties[0]) &&
            t.isObjectProperty(
              firstArg.properties[firstArg.properties.length - 1],
            ) &&
            t.isIdentifier(
              (
                firstArg.properties[
                  firstArg.properties.length - 1
                ] as import("@babel/types").ObjectProperty
              ).key,
            ) &&
            (
              (
                firstArg.properties[
                  firstArg.properties.length - 1
                ] as import("@babel/types").ObjectProperty
              ).key as import("@babel/types").Identifier
            ).name === "key"
          ) {
            return;
          }

          const filename = state.filename || "unknown";
          const shortFilename = filename.split("/").pop() || filename;
          const loc = path.node.loc;
          const line = loc?.start?.line ?? 0;
          const column = loc?.start?.column ?? 0;
          const baseKey = `${shortFilename}:${line}:${column}`;

          let jsxKeyValue: import("@babel/types").Expression | null = null;
          const jsxParent = path.findParent(
            (p) => p.isJSXElement() || p.isJSXFragment(),
          );

          if (jsxParent && t.isJSXElement(jsxParent.node)) {
            const keyAttr = jsxParent.node.openingElement.attributes.find(
              (attr): attr is import("@babel/types").JSXAttribute =>
                t.isJSXAttribute(attr) &&
                t.isJSXIdentifier(attr.name) &&
                attr.name.name === "key",
            );

            if (keyAttr) {
              if (t.isJSXExpressionContainer(keyAttr.value)) {
                if (!t.isJSXEmptyExpression(keyAttr.value.expression)) {
                  jsxKeyValue = keyAttr.value.expression;
                }
              } else if (t.isStringLiteral(keyAttr.value)) {
                jsxKeyValue = keyAttr.value;
              }
            }
          }

          let keyValue: import("@babel/types").Expression;
          if (jsxKeyValue) {
            keyValue = t.templateLiteral(
              [
                t.templateElement({
                  raw: `${baseKey}:`,
                  cooked: `${baseKey}:`,
                }),
                t.templateElement({ raw: "", cooked: "" }, true),
              ],
              [jsxKeyValue],
            );
          } else {
            keyValue = t.stringLiteral(baseKey);
          }

          const keyProperty = t.objectProperty(t.identifier("key"), keyValue);

          if (t.isObjectExpression(firstArg)) {
            const hasKey = firstArg.properties.some(
              (prop) =>
                t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key) &&
                prop.key.name === "key",
            );

            if (hasKey) {
              return;
            }

            firstArg.properties.push(keyProperty);
          } else if (t.isExpression(firstArg) && !t.isSpreadElement(firstArg)) {
            args[0] = t.objectExpression([
              t.spreadElement(firstArg),
              keyProperty,
            ]);
          }
        },
      },
    };
  };
}

function shouldTransform(
  id: string,
  options: Required<SsgoiAutoKeyOptions>,
): boolean {
  const hasValidExtension = options.include.some((ext) => id.endsWith(ext));
  if (!hasValidExtension) return false;

  const isExcluded = options.exclude.some((pattern) => {
    if (typeof pattern === "string") {
      return id.includes(pattern);
    }
    return pattern.test(id);
  });

  return !isExcluded;
}

const unpluginFactory: UnpluginFactory<SsgoiAutoKeyOptions | undefined> = (
  rawOptions,
) => {
  const options: Required<SsgoiAutoKeyOptions> = {
    ...defaultOptions,
    ...rawOptions,
  };

  return {
    name: "unplugin-ssgoi-auto-key",
    enforce: "pre",

    transformInclude(id) {
      return shouldTransform(id, options);
    },

    transform(code, id) {
      if (!shouldTransform(id, options)) {
        return null;
      }

      try {
        const result = transformSync(code, {
          filename: id,
          plugins: [createBabelPlugin()],
          parserOpts: {
            plugins: ["jsx", "typescript"],
          },
          generatorOpts: {
            retainLines: true,
          },
          sourceMaps: true,
          configFile: false,
          babelrc: false,
        });

        if (result && result.code) {
          return {
            code: result.code,
            map: result.map,
          };
        }
      } catch (error) {
        console.error(
          `[unplugin-ssgoi-auto-key] Error transforming ${id}:`,
          error,
        );
      }

      return null;
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
