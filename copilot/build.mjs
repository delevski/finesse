// Bundles the CopilotKit island (React + @copilotkit/react-core/v2) into
// docs/copilot-island.js and docs/copilot-island.css.
// Heavy optional renderers (mermaid/cytoscape/shiki-all-langs/katex/inspector)
// are stubbed: the gallery assistant renders text + small code snippets only.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const SHIKI_RE = /^(shiki|@shikijs)(\/.*)?$/;
const SHIKI_STUB = path.join(here, "shiki-stub.mjs");
const STUB_RE = /^(mermaid|@mermaid-js|cytoscape|katex|@copilotkit\/web-inspector|maplibre-gl)(\/.*)?$/;
const STUB_JS = `
const handler = {
  get: (t, k) => (k === Symbol.toPrimitive ? () => "" : stub),
  apply: () => stub,
  construct: () => stub,
};
const stub = new Proxy(function () {}, handler);
module.exports = stub;
`;
const stubOptional = {
  name: "stub-optional-renderers",
  setup(b) {
    b.onResolve({ filter: SHIKI_RE }, () => ({ path: SHIKI_STUB }));
    b.onResolve({ filter: STUB_RE }, (args) => ({ path: args.path, namespace: "stub-opt" }));
    b.onLoad({ filter: /.*/, namespace: "stub-opt" }, () => ({ contents: STUB_JS, loader: "js" }));
  },
};

await build({
  entryPoints: [path.join(here, "island.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outfile: path.join(root, "docs", "copilot-island.js"),
  loader: { ".json": "json", ".ttf": "empty", ".woff": "empty", ".woff2": "empty" },
  plugins: [stubOptional],
  logLevel: "info",
});
console.log("island bundle -> docs/copilot-island.js (+ .css)");
