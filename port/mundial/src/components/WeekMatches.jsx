import { useState } from "react";
import { useWorldCup } from "../context/WorldCupContext";
import {
  groupMatchesByWeek,
  formatWeekRange,
} from "../config/tournamentWeeks";
import { formatMatchDate } from "../utils/weekMatches";
import { TeamLogo } from "./TeamLogo";

const statusLabels = {
  scheduled: { text: "Por jugar", className: "bg-pitch-700 text-gray-300" },
  live: { text: "En vivo", className: "bg-red-600 text-white animate-pulse" },
  finished: { text: "Final", className: "bg-pitch-600 text-gray-200" },
};

export function WeekMatches() {
  const { matches, teams, loading, error } = useWorldCup();
  const weeksWithMatches = groupMatchesByWeek(matches);
  const [selectedWeekId, setSelectedWeekId] = useState(1);

  const selectedWeek =
    weeksWithMatches.find((w) => w.id === selectedWeekId) ??
    weeksWithMatches[0];

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const hasLive = matches.some((m) => m.status === "live");

  if (loading && matches.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-pitch-700 bg-pitch-900/60 p-12">
        <p className="text-gray-400">Cargando partidos desde ESPN...</p>
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className="rounded-lg border border-red-800 bg-red-950/40 p-8 text-center">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-white">
            Partidos por semana
          </h2>
          {selectedWeek && (
            <p className="mt-1 text-sm text-gray-400">
              {selectedWeek.label}
              {selectedWeek.start &&
                ` · ${formatWeekRange(selectedWeek.start, selectedWeek.end)}`}
            </p>
          )}
        </div>
        {hasLive && (
          <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Vivo
          </span>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-1">
        {weeksWithMatches.map((week) => (
          <button
            key={week.id}
            type="button"
            onClick={() => setSelectedWeekId(week.id)}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedWeekId === week.id
                ? "bg-neon text-pitch-950"
                : "bg-pitch-800 text-gray-400 hover:text-white"
            }`}
          >
            {week.label}
            <span className="ml-1 opacity-70">({week.matches.length})</span>
          </button>
        ))}
      </div>

      {!selectedWeek || selectedWeek.matches.length === 0 ? (
        <p className="rounded-lg border border-pitch-700 bg-pitch-900/60 p-8 text-center text-gray-400">
          No hay partidos en esta semana.
        </p>
      ) : (
        <div className="space-y-3">
          {selectedWeek.matches.map((match) => {
            const home =
              match.homeTeam ??
              teamMap[match.homeTeamId] ?? { name: "Local" };
            const away =
              match.awayTeam ??
              teamMap[match.awayTeamId] ?? { name: "Visitante" };
            const status = statusLabels[match.status];

            return (
              <div
                key={match.id}
                className="rounded-lg border border-pitch-700 bg-pitch-900/60 p-4"
              >
                <div className="mb-3 flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {match.group ? `Grupo ${match.group}` : "Eliminatoria"}
                  </span>
                  <span>{formatMatchDate(match.date)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-1 items-center justify-end gap-2">
                    <span className="text-right font-semibold text-white">
                      {home.name}
                    </span>
                    <TeamLogo team={home} size="lg" />
                  </div>

                  <div className="flex min-w-[80px] flex-col items-center">
                    {match.status === "scheduled" ? (
                      <span className="text-lg font-bold text-gray-500">vs</span>
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {match.homeScore} - {match.awayScore}
                      </span>
                    )}
                    <span
                      className={`mt-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${status.className}`}
                    >
                      {status.text}
                    </span>
                  </div>

                  <div className="flex flex-1 items-center gap-2">
                    <TeamLogo team={away} size="lg" />
                    <span className="font-semibold text-white">{away.name}</span>
                  </div>
                </div>

                {match.venue && (
                  <p className="mt-2 text-center text-xs text-gray-500">
                    {match.venue}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
