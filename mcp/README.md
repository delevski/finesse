# finesse MCP server

A remote [Model Context Protocol](https://modelcontextprotocol.io) server that lets coding agents (Claude Code, Cursor, Codex and others) search the finesse component library and pull ready-to-paste TSX source - straight from the live registry.

**Endpoint:** `https://finesse-demo.orworkdelevski.workers.dev/mcp` (streamable HTTP, stateless, no auth)

## Connect

Claude Code:

```bash
claude mcp add --transport http finesse https://finesse-demo.orworkdelevski.workers.dev/mcp
```

Cursor (`~/.cursor/mcp.json` or project `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "finesse": { "url": "https://finesse-demo.orworkdelevski.workers.dev/mcp" }
  }
}
```

Any MCP client that supports the streamable HTTP transport can use the same URL.

## Tools

| tool | what it does |
| --- | --- |
| `list_components` | Lists all 94 components (name, English + Hebrew title). |
| `search_components` | Keyword search over name/title/description, English or Hebrew. |
| `get_component` | Full registry item for one component, including complete TSX source. |
| `get_usage` | Install instructions (`npx shadcn@latest add .../r/<name>.json`), RTL notes. |

## Developing

`worker.template.js` is the whole demo worker (gallery + `/r/*.json` registry + `/mcp`). `build.py` injects `docs/index.html`, the component JSONs and the social-preview PNG into it:

```bash
python3 mcp/build.py /tmp/demo/worker.js   # output file MUST be named worker.js for the CF upload
```

Deploy with a multipart PUT to the Cloudflare `workers/scripts/finesse-demo` endpoint (same pipeline as the gallery).
