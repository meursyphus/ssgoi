/* Research-only experiments. Run from this repository with:
 * node research/transition-interruption/experiments.cjs
 * Loads the checked-out TypeScript integrators directly; changes no runtime code.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = function (module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText, filename);
};
const base = path.resolve(__dirname, '../../packages/core/src/lib/animation/integrator');
const { SpringIntegrator } = require(path.join(base, 'spring-integrator.ts'));
const { DoubleSpringIntegrator } = require(path.join(base, 'double-spring-integrator.ts'));
const dt = 1 / 60;
const config = { stiffness: 230, damping: 25, follower: { stiffness: 600, damping: 50 } };
const spring = new SpringIntegrator(config);
const double = new DoubleSpringIntegrator(config);
let state = { position: 0, velocity: 0 };
for (let i = 0; i < 9; i++) state = double.step(state, 1, dt);
const snapshot = JSON.parse(JSON.stringify(state));
let full = state;
let projected = { position: state.position, velocity: state.velocity };
const doubleRows = [{ timeMs: 0, full: full.position, projected: projected.position,
  fullVelocity: full.velocity, projectedVelocity: projected.velocity }];
for (let i = 1; i <= 60; i++) {
  full = double.step(full, 0, dt);
  projected = double.step(projected, 0, dt);
  doubleRows.push({ timeMs: i * dt * 1000, full: full.position, projected: projected.position,
    fullVelocity: full.velocity, projectedVelocity: projected.velocity });
}
const maxDelta = Math.max(...doubleRows.map(r => Math.abs(r.full-r.projected)));
assert(maxDelta > 0.001, 'A two-value snapshot loses double-spring state');

let singleState = { position: 0, velocity: 0 };
for (let i = 0; i < 9; i++) singleState = spring.step(singleState, 1, dt);
const singleSnapshot = { ...singleState };
assert.deepEqual(spring.step(singleState, 0, dt), spring.step(singleSnapshot, 0, dt));

const W = 400, p = 0.4, pVelocity = 2;
const before = { x: W * (1-p), velocity: -W*pVelocity };
const correct = { q: 1-p, qVelocity: -pVelocity, x: W*(1-p), velocity: W*(-pVelocity) };
const naive = { q: p, qVelocity: pVelocity, x: W*p, velocity: W*pVelocity };
assert.equal(before.x, correct.x);
assert.equal(before.velocity, correct.velocity);

function residual(t, x0, v0, omega) {
  const b = v0 + omega*x0;
  return { x: (x0+b*t)*Math.exp(-omega*t),
    v: (b-omega*(x0+b*t))*Math.exp(-omega*t) };
}
const old = { x: 120, v: -450 }, dest = { x: 40, v: 200 };
const r = residual(0, old.x-dest.x, old.v-dest.v, 18);
assert.equal(dest.x+r.x, old.x);
assert.equal(dest.v+r.v, old.v);
const epsilon = 1e-6;
const numericV = (residual(epsilon,80,-650,18).x-residual(-epsilon,80,-650,18).x)/(2*epsilon);
assert(Math.abs(numericV+650)<1e-4, 'Derivative matches exported velocity');

const output = {
  scope: 'Mathematical examples and direct source-integrator checks; not browser rendering benchmarks.',
  commit: require('node:child_process').execFileSync('git',['rev-parse','HEAD'],{cwd:path.resolve(__dirname,'../..'),encoding:'utf8'}).trim(),
  doubleSpring: { config, dt, interruptionMs: 150, snapshot,
    firstStep: doubleRows[1], maxDelta, maxDeltaAt400px: maxDelta*400, samples: doubleRows },
  reparameterization: { before, correct, naive },
  residual: { old, dest, initial: r, numericV },
  assertions: 7
};
fs.writeFileSync(path.join(__dirname,'experiment-results.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({singleSpringSnapshot:'equal',doubleSpring:output.doubleSpring.firstStep,
  maxDelta,maxDeltaAt400px:maxDelta*400,snapshot,reparameterization:output.reparameterization,
  residualDerivative:numericV},null,2));
