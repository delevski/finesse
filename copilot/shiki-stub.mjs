// Minimal functional stand-in for shiki (streamdown's syntax highlighter).
// The full shiki pulls every language grammar + a wasm regex engine (MBs);
// the gallery assistant only needs readable code blocks, so highlighting is
// plain escaped <pre><code> with the same call shapes streamdown uses.
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export const bundledLanguages = {};
export const bundledThemes = {};
export const createdHighlighter = null;

export async function createHighlighter() {
  return {
    codeToHtml: (code) => `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`,
    codeToTokens: (code) => ({ tokens: [[{ content: String(code) }]] }),
    getLoadedLanguages: () => [],
    getLoadedThemes: () => [],
    loadLanguage: async () => {},
    loadTheme: async () => {},
    dispose: () => {},
  };
}

export async function getHighlighter() {
  return createHighlighter();
}

export async function codeToHtml(code) {
  return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
}

export function createJavaScriptRegexEngine() {
  return { createRegExp: (p) => new RegExp(p) };
}

export function createOnigurumaEngine() {
  return createJavaScriptRegexEngine();
}

export default { createHighlighter, getHighlighter, codeToHtml, createJavaScriptRegexEngine, bundledLanguages, bundledThemes };
