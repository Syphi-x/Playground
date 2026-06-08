import { useState } from "react";
import { useWorldCup } from "../context/WorldCupContext";
import { sortTeams, formatGoalDiff } from "../utils/standings";
import { FormRow } from "./FormBadge";
import { TeamLogo } from "./TeamLogo";

function LiveScore({ teamId, matches }) {
  const live = matches.find(
    (m) =>
      m.status === "live" &&
      (m.homeTeamId === teamId || m.awayTeamId === teamId),
  );
  if (!live || live.homeScore == null || live.awayScore == null) return null;

  const isHome = live.homeTeamId === teamId;
  const score = isHome
    ? `${live.homeScore}-${live.awayScore}`
    : `${live.awayScore}-${live.homeScore}`;
  const winning =
    (isHome && live.homeScore > live.awayScore) ||
    (!isHome && live.awayScore > live.homeScore);
  const losing =
    (isHome && live.homeScore < live.awayScore) ||
    (!isHome && live.awayScore < live.homeScore);

  return (
    <span
      className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold ${
        winning
          ? "bg-green-500 text-white"
          : losing
            ? "bg-red-500 text-white"
            : "bg-yellow-400 text-pitch-950"
      }`}
    >
      {score}
    </span>
  );
}

function GroupTable({ groupTeams, showQualifiers, matches }) {
  const sorted = sortTeams(groupTeams);

  return (
    <table className="w-full min-w-[640px] text-sm">
      <thead>
        <tr className="border-b border-pitch-700 text-xs text-gray-400">
          <th className="py-2 pl-3 text-left font-medium">#</th>
          <th className="py-2 text-left font-medium">Equipos</th>
          <th className="px-2 py-2 text-center font-medium">PTS</th>
          <th className="px-1 py-2 text-center font-medium">J</th>
          <th className="px-1 py-2 text-center font-medium">Gol</th>
          <th className="px-1 py-2 text-center font-medium">+/-</th>
          <th className="px-1 py-2 text-center font-medium">G</th>
          <th className="px-1 py-2 text-center font-medium">E</th>
          <th className="px-1 py-2 text-center font-medium">P</th>
          <th className="py-2 pr-3 text-left font-medium">Últimas</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((team, i) => {
          const qualifies = showQualifiers && i < 2;
          return (
            <tr
              key={team.id}
              className={`border-b border-pitch-800/60 ${
                i % 2 === 0 ? "bg-pitch-900/60" : "bg-pitch-800/40"
              }`}
            >
              <td className="relative py-2.5 pl-3">
                {qualifies && (
                  <span className="absolute bottom-0 left-0 top-0 w-1 bg-neon" />
                )}
                <span className="text-gray-300">{i + 1}</span>
              </td>
              <td className="py-2.5">
                <div className="flex items-center">
                  <TeamLogo team={team} />
                  <span className="ml-2 font-medium text-white">{team.name}</span>
                  <LiveScore teamId={team.id} matches={matches} />
                </div>
              </td>
              <td className="px-2 py-2.5 text-center font-bold text-white">
                {team.points}
              </td>
              <td className="px-1 py-2.5 text-center text-gray-300">
                {team.played}
              </td>
              <td className="px-1 py-2.5 text-center text-gray-300">
                {team.goalsFor}:{team.goalsAgainst}
              </td>
              <td className="px-1 py-2.5 text-center text-gray-300">
                {formatGoalDiff(team)}
              </td>
              <td className="px-1 py-2.5 text-center text-gray-300">
                {team.won}
              </td>
              <td className="px-1 py-2.5 text-center text-gray-300">
                {team.drawn}
              </td>
              <td className="px-1 py-2.5 text-center text-gray-300">
                {team.lost}
              </td>
              <td className="py-2.5 pr-3">
                <FormRow form={team.form} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function StandingsTable() {
  const { teams, groups, matches, loading, error } = useWorldCup();
  const [selectedGroup, setSelectedGroup] = useState("all");
  const hasLive = matches.some((m) => m.status === "live");

  if (loading && teams.length === 0) {
    return <LoadingState message="Cargando clasificación desde ESPN..." />;
  }

  if (error && teams.length === 0) {
    return <ErrorState message={error} />;
  }

  const filtered =
    selectedGroup === "all"
      ? teams
      : teams.filter((t) => t.group === selectedGroup);

  if (selectedGroup === "all") {
    return (
      <div>
        <TableHeader hasLive={hasLive} error={error} />

        <div className="mb-4 flex flex-wrap gap-1">
          <GroupButton
            label="Todos"
            active={selectedGroup === "all"}
            onClick={() => setSelectedGroup("all")}
          />
          {groups.map((g) => (
            <GroupButton
              key={g}
              label={`Grupo ${g}`}
              active={selectedGroup === g}
              onClick={() => setSelectedGroup(g)}
            />
          ))}
        </div>

        <div className="space-y-8">
          {groups.map((group) => {
            const groupTeams = teams.filter((t) => t.group === group);
            return (
              <div key={group}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Grupo {group}
                </h3>
                <div className="overflow-x-auto rounded-lg border border-pitch-700">
                  <GroupTable
                    groupTeams={groupTeams}
                    showQualifiers
                    matches={matches}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <TableHeader hasLive={hasLive} title={`Grupo ${selectedGroup}`} error={error} />

      <div className="mb-4 flex flex-wrap gap-1">
        <GroupButton
          label="Todos"
          active={false}
          onClick={() => setSelectedGroup("all")}
        />
        {groups.map((g) => (
          <GroupButton
            key={g}
            label={`Grupo ${g}`}
            active={selectedGroup === g}
            onClick={() => setSelectedGroup(g)}
          />
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-pitch-700">
        <GroupTable
          groupTeams={filtered}
          showQualifiers
          matches={matches}
        />
      </div>
    </div>
  );
}

function TableHeader({ hasLive, title = "Clasificación", error }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold uppercase tracking-widest text-white">
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {error && (
          <span className="text-xs text-yellow-400">Datos parciales</span>
        )}
        {hasLive && (
          <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Vivo
          </span>
        )}
      </div>
    </div>
  );
}

function GroupButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "bg-neon text-pitch-950"
          : "bg-pitch-800 text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function LoadingState({ message }) {
  return (
    <div className="flex items-center justify-center rounded-lg border border-pitch-700 bg-pitch-900/60 p-12">
      <p className="text-gray-400">{message}</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-lg border border-red-800 bg-red-950/40 p-8 text-center">
      <p className="text-red-300">{message}</p>
      <p className="mt-2 text-sm text-gray-400">
        Verifica tu conexión e intenta recargar la página.
      </p>
    </div>
  );
}
