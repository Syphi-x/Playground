const tabConfig = [
  { id: "tabla", label: "Tabla" },
  { id: "partidos", label: "Partidos" },
  { id: "leaderboard", label: "Leaderboard" },
];

export function Tabs({ active, onChange }) {
  return (
    <nav className="flex gap-1 border-b border-pitch-700">
      {tabConfig.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-5 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            active === tab.id
              ? "border-b-2 border-neon text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
