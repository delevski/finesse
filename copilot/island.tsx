// finesse gallery assistant - CopilotKit island mounted into the static gallery page.
// Bundled by copilot/build.mjs into docs/copilot-island.js (+ .css).
import React from "react";
import { createRoot } from "react-dom/client";
import {
  CopilotKitProvider,
  CopilotSidebar,
  useAgent,
  useFrontendTool,
  ToolCallStatus,
} from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import "./overrides.css";
import { z } from "zod";
import META from "./meta.json";

type Comp = { name: string; title: string; titleHe: string; description: string };
const COMPS = META as Comp[];

const IS_WORKER = location.hostname.endsWith("workers.dev");
const ORIGIN = IS_WORKER
  ? location.origin
  : "https://finesse-demo.orworkdelevski.workers.dev";
const RUNTIME_URL = `${ORIGIN}/api/copilotkit`;

function searchMeta(query: string, limit = 5) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { c: Comp; score: number }[] = [];
  for (const c of COMPS) {
    const hay = `${c.name} ${c.title} ${c.titleHe} ${c.description}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (c.name.toLowerCase().includes(t)) score += 3;
      else if (c.title.toLowerCase().includes(t)) score += 2;
      else if (hay.includes(t)) score += 1;
    }
    if (score > 0) scored.push({ c, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.c);
}

function highlightDemo(name: string): boolean {
  const btn = document.querySelector(`.tsx-btn[data-tsx="${CSS.escape(name)}"]`);
  const demo = btn?.closest(".demo") as HTMLElement | null;
  if (!demo) return false;
  demo.scrollIntoView({ behavior: "smooth", block: "center" });
  demo.classList.remove("fc-highlight");
  // force reflow so the animation restarts on repeat calls
  void demo.offsetWidth;
  demo.classList.add("fc-highlight");
  window.setTimeout(() => demo.classList.remove("fc-highlight"), 3200);
  return true;
}

function FinesseTools() {
  useFrontendTool({
    name: "search_components",
    description:
      "Search the finesse component library (94 animated RTL Hebrew UI components) by keyword, English or Hebrew. Returns matching component names with titles and descriptions. ALWAYS call this before recommending a component.",
    parameters: z.object({
      query: z.string().describe("keywords, e.g. 'menu', 'button', 'loading', 'תפריט', 'טעינה'"),
    }),
    handler: async ({ query }) => {
      const hits = searchMeta(query);
      if (!hits.length)
        return `No components match "${query}". Try a broader keyword. The library has ${COMPS.length} components.`;
      return hits
        .map(
          (c) =>
            `${c.name} - ${c.title}${c.titleHe ? ` (${c.titleHe})` : ""}: ${c.description}`
        )
        .join("\n");
    },
  });

  useFrontendTool({
    name: "open_component",
    description:
      "Scroll the gallery page to a component's live demo and highlight it. Use when the user wants to see a component. The name must come from search_components results.",
    parameters: z.object({
      name: z.string().describe("exact component name, e.g. 'fan-drawer'"),
    }),
    handler: async ({ name }) => {
      const comp = COMPS.find((c) => c.name === name);
      if (!comp) {
        const suggestions = searchMeta(name, 3).map((c) => c.name);
        return JSON.stringify({
          found: false,
          error: `No component named "${name}".`,
          suggestions,
        });
      }
      const ok = highlightDemo(name);
      return JSON.stringify({
        found: ok,
        name: comp.name,
        title: comp.title,
        note: ok
          ? "The page scrolled to the live demo and highlighted it."
          : "Component exists but its demo block was not found on this page.",
      });
    },
  });

  useFrontendTool({
    name: "show_install_command",
    description:
      "Show the shadcn install command for a component, with a copy button the user can click. Use when the user asks how to install or get the code. Never claim you copied anything - the user copies by clicking the button.",
    parameters: z.object({
      name: z.string().describe("exact component name, e.g. 'fan-drawer'"),
    }),
    handler: async ({ name }) => {
      const comp = COMPS.find((c) => c.name === name);
      if (!comp) return JSON.stringify({ found: false, error: `No component named "${name}".` });
      return `npx shadcn@latest add ${ORIGIN}/r/${comp.name}.json`;
    },
    render: ({ args, status, result }) => {
      const cmd = `npx shadcn@latest add ${ORIGIN}/r/${args.name ?? "..."}.json`;
      if (status !== ToolCallStatus.Complete) {
        return <div className="fc-install fc-install-pending">Preparing install command…</div>;
      }
      if (!result || result.startsWith("{")) return null;
      return (
        <div className="fc-install" dir="ltr">
          <code>{cmd}</code>
          <button
            type="button"
            onClick={(e) => {
              navigator.clipboard?.writeText(cmd);
              const b = e.currentTarget;
              b.textContent = "Copied ✓";
              window.setTimeout(() => (b.textContent = "Copy"), 1500);
            }}
          >
            Copy
          </button>
        </div>
      );
    },
  });

  return null;
}

function messageText(m: any): string {
  const c = m?.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c))
    return c.map((p: any) => (typeof p === "string" ? p : p?.text || p?.content || "")).join("");
  return "";
}

// Watches the agent run lifecycle and turns silent failures into a visible
// Hebrew notice with a retry button. A run that ends with no assistant reply
// (upstream 429 / stall) shows "נסה שוב"; a run exceeding 90s shows a slow
// notice with stop+retry. Retry aborts any active run and resends the last
// user message. window.__fcSimulate drives the same UI for mock verification.
function RunWatchdog() {
  const { agent } = useAgent({ agentId: "default" });
  const [notice, setNotice] = React.useState<null | { kind: string; text: string }>(null);
  const ref = React.useRef({ wasRunning: false, runStart: 0, countAtStart: 0, lastUserText: "" });

  React.useEffect(() => {
    (window as any).__fcSimulate = (kind: string) => {
      ref.current.lastUserText = ref.current.lastUserText || "בדיקה";
      setNotice(
        kind === "slow"
          ? { kind: "slow", text: "לוקח יותר זמן מהרגיל - אפשר לעצור ולנסות שוב." }
          : { kind: "failed", text: "העוזר לא השיב - ייתכן שהמודל החינמי עמוס כרגע. נסו שוב בעוד רגע." }
      );
    };
    const t = window.setInterval(() => {
      const s = ref.current;
      const running = !!agent.isRunning;
      if (running && !s.wasRunning) {
        s.runStart = Date.now();
        s.countAtStart = agent.messages.length;
        const lastUser = [...agent.messages].reverse().find((m: any) => m.role === "user");
        const txt = lastUser ? messageText(lastUser).trim() : "";
        if (txt) s.lastUserText = txt;
        setNotice(null);
      } else if (!running && s.wasRunning) {
        const gotAnswer = agent.messages
          .slice(s.countAtStart)
          .some((m: any) => m.role === "assistant" && messageText(m).trim().length > 0);
        if (!gotAnswer && s.lastUserText) {
          setNotice({
            kind: "failed",
            text: "העוזר לא השיב - ייתכן שהמודל החינמי עמוס כרגע. נסו שוב בעוד רגע.",
          });
        }
      } else if (running && s.wasRunning && Date.now() - s.runStart > 90000) {
        setNotice((n) =>
          n ? n : { kind: "slow", text: "לוקח יותר זמן מהרגיל - אפשר לעצור ולנסות שוב." }
        );
      }
      s.wasRunning = running;
    }, 700);
    return () => window.clearInterval(t);
  }, [agent]);

  if (!notice) return null;
  const retry = () => {
    setNotice(null);
    try {
      if (agent.isRunning) agent.abortRun();
      const text = ref.current.lastUserText;
      if (text) {
        agent.addMessage({ id: crypto.randomUUID(), role: "user", content: text } as any);
        agent.runAgent();
      }
    } catch (e) {
      (window as any).__chatError = String(e);
    }
  };
  return (
    <div className={`fc-notice fc-notice-${notice.kind}`} role="alert" dir="rtl">
      <span>{notice.text}</span>
      <button type="button" onClick={retry}>
        נסה שוב
      </button>
    </div>
  );
}

// Capture crash details for diagnosis, then recover with a reload button
// instead of unmounting to nothing.
(window as any).__chatError = null;
window.addEventListener("error", (e) => {
  (window as any).__chatError = String((e as ErrorEvent).error?.stack || e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  (window as any).__chatError = String((e as PromiseRejectionEvent).reason?.stack || (e as PromiseRejectionEvent).reason);
});

class ChatBoundary extends React.Component<
  { children: React.ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  componentDidCatch(err: unknown) {
    (window as any).__chatError = String((err as Error)?.stack || err);
  }
  render() {
    if (this.state.crashed) {
      return (
        <button type="button" className="fc-reload" onClick={() => location.reload()}>
          הצ'אט נתקע - לחץ לרענון · Chat stalled - tap to reload
        </button>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ChatBoundary>
      <CopilotKitProvider runtimeUrl={RUNTIME_URL}>
        <FinesseTools />
        <RunWatchdog />
        <CopilotSidebar
          agentId="default"
          width={420}
          defaultOpen={window.matchMedia("(min-width: 1024px)").matches}
          labels={{
            modalHeaderTitle: "finesse Assistant · עוזר הקומפוננטות",
            welcomeMessageText: "איך אפשר לעזור?",
            chatInputPlaceholder: "כתבו הודעה…",
            chatDisclaimerText: "העוזר יכול לטעות. כדאי לבדוק מידע חשוב.",
            chatToggleOpenLabel: "פתיחת הצ'אט",
            chatToggleCloseLabel: "סגירת הצ'אט",
            chatInputToolbarSendButtonLabel: "שליחה",
            chatInputToolbarStopButtonLabel: "עצירה",
            chatScrollToBottomLabel: "גלילה למטה",
            chatConnectingLabel: "מתחבר…",
            assistantMessageToolbarCopyMessageLabel: "העתקה",
            assistantMessageToolbarCopyCodeLabel: "העתקת קוד",
            assistantMessageToolbarCopyCodeCopiedLabel: "הועתק",
            assistantMessageToolbarRegenerateLabel: "נסה שוב",
            userMessageToolbarCopyMessageLabel: "העתקה",
          }}
        />
      </CopilotKitProvider>
    </ChatBoundary>
  );
}

const el = document.getElementById("finesse-copilot-root");
if (el) {
  createRoot(el).render(<App />);
}
