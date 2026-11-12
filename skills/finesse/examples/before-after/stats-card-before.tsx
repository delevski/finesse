// BEFORE: what an agent produces by default.
// Physical spacing, no states, invented-feeling number with no formatting,
// raw gray, an arrow that will not mirror in RTL, zero feedback.

export function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-green-500 text-xs mt-1">+12% this week ↗</div>
    </div>
  );
}

export function StatsGrid() {
  // No loading state: the area is blank until data arrives.
  const [stats, setStats] = useState<{ title: string; value: number }[]>([]);
  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats); // no error handling
  }, []);
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => <StatsCard key={s.title} {...s} />)}
    </div>
  );
}
