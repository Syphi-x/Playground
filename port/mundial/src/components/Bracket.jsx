import { useMemo, useState } from "react";
import { useWorldCup } from "../context/WorldCupContext";
import { TeamLogo } from "./TeamLogo";

const ESPN_BRACKET_URL = "https://www.espn.com.mx/futbol/cuadro";

const ROUND_ORDER = [
  "round-of-32",
  "round-of-16",
  "quarterfinals",
  "semifinals",
  "3rd-place-match",
  "final",
];

const ROUND_META = {
  "round-of-32": {
    label: "16avos",
    subtitle: "Ronda de 32",
  },
  "round-of-16": {
    label: "8avos",
    subtitle: "Ronda de 16",
  },
  quarterfinals: {
    label: "4tos",
    subtitle: "Cuartos de final",
  },
  semifinals: {
    label: "Semis",
    subtitle: "Semifinales",
  },
  "3rd-place-match": {
    label: "3er lugar",
    subtitle: "Tercer puesto",
  },
  final: {
    label: "Final",
    subtitle: "Campeonato",
  },
};

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = normalizeDate(value);
  if (!date) return "Por definir";

  return date.toLocaleString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(value) {
  const date = normalizeDate(value);
  if (!date) return "";

  return date.toLocaleDateString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function getTeamGroup(team) {
  if (!team?.group) return null;
  return `Grupo ${team.group}`;
}

function getRoundColumn(stage) {
  return ROUND_META[stage] ?? { label: stage, subtitle: stage };
}

function getStageTabs() {
  return ROUND_ORDER.map((stage) => ({
    stage,
    ...getRoundColumn(stage),
  }));
}

function getMatchStatusLabel(match) {
  if (match.status === "live") return "En vivo";
  if (match.status === "finished") return "Final";
  return "Próximo";
}

function getMatchStatusClass(match) {
  if (match.status === "live") {
    return "border-red-500/50 bg-red-500/10 text-red-200";
  }
  if (match.status === "finished") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  }
  return "border-amber-500/40 bg-amber-500/10 text-amber-200";
}

function getScoreText(match) {
  if (match.status === "scheduled") return "vs";
  if (match.homeScore == null || match.awayScore == null) return "—";
  return `${match.homeScore} - ${match.awayScore}`;
}

function MatchCard({ match, teamMap }) {
  const home = match.homeTeam ?? teamMap[match.homeTeamId] ?? { name: "Local" };
  const away = match.awayTeam ??
    teamMap[match.awayTeamId] ?? { name: "Visitante" };
  const homeGroup = getTeamGroup(home);
  const awayGroup = getTeamGroup(away);
  const dayLabel = formatDay(match.date);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/95 shadow-[0_18px_40px_rgba(2,6,23,0.25)]">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-slate-400">
          <span>{match.group ? `Grupo ${match.group}` : "Eliminatoria"}</span>
          <span
            className={`rounded-full border px-2 py-1 tracking-[0.2em] ${getMatchStatusClass(match)}`}
          >
            {getMatchStatusLabel(match)}
          </span>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-white">
              {formatDate(match.date)}
            </p>
            {dayLabel && <p className="text-xs text-slate-500">{dayLabel}</p>}
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-white">
              {getScoreText(match)}
            </p>
            {match.venue && (
              <p className="text-xs text-slate-500">{match.venue}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
            <TeamLogo team={home} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-semibold text-white">{home.name}</p>
                {homeGroup && (
                  <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {homeGroup}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {home.abbreviation ?? ""}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="h-px w-10 bg-slate-700" />
            <span className="mx-2 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              vs
            </span>
            <div className="h-px w-10 bg-slate-700" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2">
            <TeamLogo team={away} size="lg" />
            <div className="min-w-0 flex-1 text-right">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-semibold text-white">{away.name}</p>
                {awayGroup && (
                  <span className="shrink-0 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {awayGroup}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {away.abbreviation ?? ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function BracketColumn({ stage, matches, teamMap }) {
  const meta = getRoundColumn(stage);

  return (
    <section className="w-full rounded-3xl border border-slate-700/80 bg-slate-900/40 p-3 backdrop-blur-sm">
      <div className="mb-4 rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-neon">
          {meta.subtitle}
        </p>
        <h3 className="mt-1 text-lg font-black uppercase tracking-[0.15em] text-white">
          {meta.label}
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {matches.length} partido{matches.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} teamMap={teamMap} />
        ))}

        {matches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6 text-center text-sm text-slate-500">
            Sin partidos para esta ronda.
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10 text-center text-slate-400">
      Cargando bracket desde ESPN...
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-800/70 bg-red-950/30 p-8 text-center">
      <p className="text-red-200">{message}</p>
      <p className="mt-2 text-sm text-slate-400">
        Si la API no devuelve datos, revisa el cuadro oficial de ESPN.
      </p>
      <a
        href={ESPN_BRACKET_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/20"
      >
        Abrir cuadro oficial ESPN
      </a>
    </div>
  );
}

export function Bracket() {
  const { teams, matches, loading, error } = useWorldCup();
  const [activeStage, setActiveStage] = useState("round-of-32");

  const teamMap = useMemo(
    () => Object.fromEntries(teams.map((team) => [team.id, team])),
    [teams],
  );

  const columns = useMemo(
    () =>
      getStageTabs().map((tab) => ({
        ...tab,
        matches: matches
          .filter((match) => match.stage === tab.stage)
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
      })),
    [matches],
  );

  const hasMatches = columns.some((column) => column.matches.length > 0);
  const activeColumn =
    columns.find((column) => column.stage === activeStage) ?? columns[0];

  if (loading && !hasMatches) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-neon">
              Bracket oficial
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
              Cuadro Mundial 2026
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Vista en columnas por rondas, con fecha de cada juego y grupo de
              origen de cada equipo cuando ESPN lo expone.
            </p>
          </div>

          <a
            href={ESPN_BRACKET_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-neon hover:text-white"
          >
            Ver cuadro ESPN ↗
          </a>
        </div>
      </div>

      {error && !hasMatches ? <ErrorState message={error} /> : null}

      <div className="overflow-x-auto pb-2">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-700 pb-3">
          {columns.map((column) => (
            <button
              key={column.stage}
              type="button"
              onClick={() => setActiveStage(column.stage)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] transition-colors ${
                activeStage === column.stage
                  ? "bg-neon text-pitch-950"
                  : "border border-slate-700 bg-slate-950/80 text-slate-400 hover:text-white"
              }`}
            >
              {column.label}
            </button>
          ))}
        </div>

        <BracketColumn
          stage={activeColumn.stage}
          matches={activeColumn.matches}
          teamMap={teamMap}
        />
      </div>
    </div>
  );
}

export default Bracket;
