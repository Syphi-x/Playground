import { useWorldCup } from "../context/WorldCupContext";
import { userPicks } from "../data/users";
import { getUserLeaderboard } from "../utils/leaderboard";
import { TeamLogo } from "./TeamLogo";

export function Leaderboard() {
  const { teams, loading, error } = useWorldCup();
  const leaderboard = getUserLeaderboard(userPicks, teams);

  if (loading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-pitch-700 bg-pitch-900/60 p-12">
        <p className="text-gray-400">Cargando USUARIOS...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold uppercase tracking-widest text-white">
          EQUIPOS SELECCIONADOS
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Puntos acumulados por los 4 equipos de cada usuario (datos ESPN)
        </p>
        {error && (
          <p className="mt-1 text-xs text-yellow-400">
            Datos parciales: {error}
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-pitch-700">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-pitch-700 text-xs text-gray-400">
              <th className="py-2 pl-3 text-left font-medium">#</th>
              <th className="py-2 text-left font-medium">Usuario</th>
              <th className="px-2 py-2 text-center font-medium">Equipo 1</th>
              <th className="px-2 py-2 text-center font-medium">Equipo 2</th>
              <th className="px-2 py-2 text-center font-medium">Equipo 3</th>
              <th className="px-2 py-2 text-center font-medium">Equipo 4</th>
              <th className="py-2 pr-3 text-center font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, i) => (
              <tr
                key={entry.id}
                className={`border-b border-pitch-800/60 ${
                  i % 2 === 0 ? "bg-pitch-900/60" : "bg-pitch-800/40"
                }`}
              >
                <td className="relative py-3 pl-3">
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 top-0 w-1 bg-neon" />
                  )}
                  <span className="text-gray-300">{i + 1}</span>
                </td>
                <td className="py-3 font-semibold text-white">{entry.name}</td>
                {entry.teamPoints.map(({ team, points }, j) => (
                  <td key={j} className="px-2 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <TeamLogo team={team} />
                      <span className="text-xs text-gray-400">
                        {team?.name ?? "—"}
                      </span>
                      <span className="font-bold text-white">{points} pts</span>
                    </div>
                  </td>
                ))}
                <td className="py-3 pr-3 text-center">
                  <span className="text-lg font-bold text-neon">
                    {entry.total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
