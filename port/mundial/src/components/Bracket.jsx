import { useMemo, useEffect, useState } from "react";
import { TeamLogo } from "./TeamLogo";
import { fetchAllMatches, fetchStandings } from "../services/espnApi";
import { parseScoreboard, parseStandings } from "../services/espnParser";

function formatDate(d) {
  try {
    return new Date(d).toLocaleString("es-MX", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_) {
    return d;
  }
}

export function Bracket() {
  const [roundMatches, setRoundMatches] = useState([]);
  const [teamMap, setTeamMap] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [standData, scoreData] = await Promise.all([
          fetchStandings(),
          fetchAllMatches(),
        ]);

        const { teams: parsedTeams } = parseStandings(standData);
        const map = Object.fromEntries(parsedTeams.map((t) => [t.id, t]));

        const { matches: parsedMatches } = parseScoreboard(scoreData, map);

        const rounds = parsedMatches.filter(
          (m) => m.stage && m.stage.toLowerCase().includes("round-of-32"),
        );

        if (!mounted) return;
        setTeamMap(map);
        setRoundMatches(
          rounds.sort((a, b) => new Date(a.date) - new Date(b.date)),
        );
      } catch (err) {
        // silence
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold uppercase tracking-widest text-white">
          Cuadro — 16avos de final
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Partidos del cuadro (Ronda de 32). Incluye fecha y grupo de origen.
        </p>
      </div>

      <div className="space-y-4">
        {roundMatches.map((m) => {
          const home = m.homeTeam ?? teamMap[m.homeTeamId] ?? { name: "Local" };
          const away = m.awayTeam ??
            teamMap[m.awayTeamId] ?? { name: "Visitante" };
          return (
            <div
              key={m.id}
              className="rounded-lg border border-pitch-700 bg-pitch-900/60 p-4"
            >
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                <span>{m.group ? `Grupo ${m.group}` : "Eliminatoria"}</span>
                <span>{formatDate(m.date)}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <TeamLogo team={home} />
                  <div>
                    <div className="font-semibold text-white">{home.name}</div>
                    <div className="text-xs text-gray-400">
                      {home.abbreviation ?? home.name}
                    </div>
                  </div>
                </div>

                <div className="text-sm font-bold text-gray-300">vs</div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-semibold text-white">{away.name}</div>
                    <div className="text-xs text-gray-400">
                      {away.abbreviation ?? away.name}
                    </div>
                  </div>
                  <TeamLogo team={away} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bracket;
