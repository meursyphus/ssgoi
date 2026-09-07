// Execute current TypeScript sources rather than a copy or stale dist.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const core = fileURLToPath(
  new URL("../../../../packages/core/", import.meta.url),
);
const require = createRequire(import.meta.url);
const viteRequire = createRequire(require.resolve("vite", { paths: [core] }));
const { build } = viteRequire("esbuild");
const bundled = await build({
  stdin: {
    contents: `export { SpringIntegrator, DoubleSpringIntegrator, InertiaIntegrator } from './src/lib/animation/integrator';
export { simulate } from './src/lib/animation/web-animation';`,
    resolveDir: core,
    loader: "ts",
  },
  tsconfig: path.join(core, "tsconfig.json"),
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  logLevel: "silent",
});
const engine = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`
);
const input = JSON.parse(readFileSync(0, "utf8"));
const result = input.map(
  ({
    model,
    params,
    initialVelocity = 0,
    restDelta = 0.01,
    restSpeed = 0.01,
  }) => {
    const config = { ...params, restDelta, restSpeed };
    const integrator =
      model === "inertia"
        ? new engine.InertiaIntegrator(config)
        : model === "doubleSpring"
          ? new engine.DoubleSpringIntegrator({
              ...config,
              follower: params.doubleSpring,
            })
          : new engine.SpringIntegrator(config);
    return engine.simulate(integrator, 0, 1, initialVelocity);
  },
);
process.stdout.write(JSON.stringify(result));
