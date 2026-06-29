import { useState } from "react";
import { WorldCupProvider, useWorldCup } from "./context/WorldCupContext";
import { ESPN_MX } from "./config/espnMexico";
import { getLocalDateKey } from "./config/tournamentWeeks";
import { Tabs } from "./components/Tabs";
import { StandingsTable } from "./components/StandingsTable";
import { WeekMatches } from "./components/WeekMatches";
import { Leaderboard } from "./components/Leaderboard";
import { Bracket } from "./components/Bracket";

function AppContent() {
  const [activeTab, setActiveTab] = useState("tabla");
  const { lastUpdated, refresh, loading } = useWorldCup();

  return (
    <div className="min-h-screen bg-pitch-950">
      <header className="border-b border-pitch-700 bg-pitch-900">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon">
                AWELA'S MUNDIAL
              </p>
              <h1 className="text-2xl font-bold text-white">
                Quinela Mundial 2026
              </h1>
            </div>
            <div className="flex flex-col items-end gap-1">
              <a
                href={ESPN_MX.calendarUrl(
                  getLocalDateKey(new Date().toISOString()).replaceAll("-", ""),
                )}
                target="_blank"
                rel="noreferrer"
                className="hidden text-sm text-gray-400 hover:text-white sm:block"
              >
                Calendario oficial ESPN MX de hoy ↗
              </a>
              {lastUpdated && (
                <button
                  type="button"
                  onClick={refresh}
                  disabled={loading}
                  className="text-xs text-gray-500 hover:text-gray-300 disabled:opacity-50"
                >
                  Actualizado{" "}
                  {lastUpdated.toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" · "}↻
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Tabs active={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "tabla" && <StandingsTable />}
          {activeTab === "partidos" && <WeekMatches />}
          {activeTab === "leaderboard" && <Leaderboard />}
          {activeTab === "cuadro" && <Bracket />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <WorldCupProvider>
      <AppContent />
    </WorldCupProvider>
  );
}
