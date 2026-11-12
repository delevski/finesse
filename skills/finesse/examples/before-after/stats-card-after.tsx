// AFTER: the same component with the finesse bar applied.
// Semantic tokens, logical properties, skeleton + error + retry,
// staggered entrance, count-up, Intl formatting, mirrored icon.

import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 600) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) { setN(target); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);
  return n;
}

const fmt = new Intl.NumberFormat("he-IL"); // locale-driven, not hardcoded

export function StatsCard({ title, value, delta }: { title: string; value: number; delta: number }) {
  const shown = useCountUp(value);
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums" dir="ltr">{fmt.format(shown)}</div>
      <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="size-3 rtl:-scale-x-100" aria-hidden />
        <span dir="ltr">+{delta}%</span> this week
      </div>
    </motion.div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4">
          <div className="h-4 w-1/2 rounded shimmer" />
          <div className="mt-2 h-7 w-2/3 rounded shimmer" />
        </div>
      ))}
    </div>
  );
}

export function StatsGrid() {
  const [stats, setStats] = useState<{ title: string; value: number; delta: number }[] | null>(null);
  const [error, setError] = useState(false);
  const load = () => {
    setError(false);
    fetch("/api/stats")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setStats)
      .catch(() => setError(true));
  };
  useEffect(load, []);

  if (error)
    return (
      <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
        Stats did not load.
        <button onClick={load} className="ms-2 inline-flex items-center gap-1 underline">
          <RefreshCw className="size-3" /> Retry
        </button>
      </div>
    );
  if (!stats) return <StatsSkeleton />;

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      initial="hidden" animate="show"
    >
      {stats.map((s) => <StatsCard key={s.title} {...s} />)}
    </motion.div>
  );
}
