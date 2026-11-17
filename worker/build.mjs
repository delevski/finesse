// Builds the trial worker: injects docs/ assets + island bundle into data.gen.js,
// then bundles main.js (with @copilotkit/runtime + @ai-sdk/openai) into a single
// worker.js for the Cloudflare multipart upload.
// Usage: node worker/build.mjs /path/to/out/worker.js   (filename MUST be worker.js)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const docs = path.join(root, "docs");

const html = readFileSync(path.join(docs, "index.html"), "utf8");
const idx = JSON.parse(readFileSync(path.join(docs, "r", "index.json"), "utf8"));
const heByName = {};
for (const it of idx.items || []) heByName[it.name] = it.titleHe || "";

const reg = {};
const meta = [];
for (const f of readdirSync(path.join(docs, "r")).sort()) {
  if (!f.endsWith(".json")) continue;
  const txt = readFileSync(path.join(docs, "r", f), "utf8");
  let d;
  try { d = JSON.parse(txt); } catch { continue; }
  if (d.type !== "registry:component") continue;
  reg["r/" + f] = txt;
  const name = d.name || f.replace(/\.json$/, "");
  meta.push({ name, title: d.title || "", titleHe: heByName[name] || "", description: d.description || "" });
}

const pngB64 = readFileSync(path.join(docs, "social-preview.png")).toString("base64");
const islandJs = readFileSync(path.join(docs, "copilot-island.js"), "utf8");
const islandCss = readFileSync(path.join(docs, "copilot-island.css"), "utf8");

const data =
  `export const HTML=${JSON.stringify(html)};\n` +
  `export const REG=${JSON.stringify(reg)};\n` +
  `export const META=${JSON.stringify(meta)};\n` +
  `export const PNG_B64=${JSON.stringify(pngB64)};\n` +
  `export const ISLAND_JS=${JSON.stringify(islandJs)};\n` +
  `export const ISLAND_CSS=${JSON.stringify(islandCss)};\n`;
writeFileSync(path.join(here, "data.gen.js"), data);
console.log("data.gen.js:", Object.keys(reg).length, "registry entries,", meta.length, "components");

// workerd has Web Crypto but no node builtins. node:crypto gets a real shim
// (randomUUID); the rest only appear on code paths this worker never runs
// (node listeners, URL-attachment downloads) and get empty modules.
const NODE_BUILTINS = "assert|async_hooks|buffer|child_process|cluster|console|constants|dgram|diagnostics_channel|dns|dns/promises|domain|events|fs|fs/promises|http|http2|https|inspector|module|net|os|path|path/posix|path/win32|perf_hooks|process|punycode|querystring|readline|repl|stream|stream/web|string_decoder|sys|timers|timers/promises|tls|tty|url|util|v8|vm|worker_threads|zlib";
const nodeShims = {
  name: "workerd-node-shims",
  setup(b) {
    b.onResolve({ filter: /^(node:)?crypto$/ }, () => ({ path: "crypto-shim", namespace: "nshim" }));
    b.onResolve({ filter: new RegExp(`^(node:)?(${NODE_BUILTINS})$`) }, (args) => ({ path: args.path, namespace: "nstub" }));
    const CJS_PROXY = `
const real = { randomUUID: () => globalThis.crypto.randomUUID() };
const handler = {
  get: (t, k) => (k in real ? real[k] : (k === Symbol.toPrimitive ? () => "" : stub)),
  apply: () => stub,
  construct: () => stub,
};
const stub = new Proxy(function () {}, handler);
module.exports = stub;
`;
    b.onLoad({ filter: /.*/, namespace: "nshim" }, () => ({ contents: CJS_PROXY, loader: "js" }));
    b.onLoad({ filter: /.*/, namespace: "nstub" }, () => ({ contents: CJS_PROXY, loader: "js" }));
  },
};

const out = process.argv[2] || "/tmp/finesse-copilot-deploy/worker.js";
await build({
  plugins: [nodeShims],
  banner: {
    js: "globalThis.global = globalThis.global || globalThis; globalThis.Buffer = globalThis.Buffer || (() => { class B extends Uint8Array { static from(d, e) { if (typeof d === 'string') { if (e === 'base64') { const bin = atob(d); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new B(u); } return new B(new TextEncoder().encode(d)); } if (d instanceof ArrayBuffer) return new B(d); if (d instanceof Uint8Array) return new B(d); if (Array.isArray(d)) return new B(d); if (typeof d === 'number') return new B(d); return new B(0); } static isBuffer(x) { return x instanceof B; } static concat(a) { let n = 0; for (const x of a) n += x.length; const r = new B(n); let o = 0; for (const x of a) { r.set(x, o); o += x.length; } return r; } static alloc(n) { return new B(n); } static allocUnsafe(n) { return new B(n); } static allocUnsafeSlow(n) { return new B(n); } static byteLength(s) { return typeof s === 'string' ? new TextEncoder().encode(s).length : s.length; } toString(e) { if (e === 'base64') { let bin = ''; for (let i = 0; i < this.length; i++) bin += String.fromCharCode(this[i]); return btoa(bin); } return new TextDecoder().decode(this); } } return B; })(); globalThis.process = globalThis.process || { env: {}, version: 'v20.0.0', versions: { node: '20.0.0' }, platform: 'linux', nextTick: (fn, ...a) => queueMicrotask(() => fn(...a)), cwd: () => '/', on: () => {}, emit: () => false };",
  },
  entryPoints: [path.join(here, "main.js")],
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2022",
  platform: "neutral",
  mainFields: ["browser", "module", "main"],
  conditions: ["worker", "browser", "import", "default"],
  outfile: out,
  logLevel: "info",
});
console.log("worker bundle ->", out);
