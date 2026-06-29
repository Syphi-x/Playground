import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchCalendarByDate, fetchStandings } from "../services/espnApi";
import { getLocalDateKey } from "../config/tournamentWeeks";
import {
  mergeTeamForms,
  parseScoreboard,
  parseStandings,
} from "../services/espnParser";

/** @type {React.Context<{
 *   teams: import('../types.js').Team[];
 *   groups: string[];
 *   matches: import('../types.js').Match[];
 *   loading: boolean;
 *   error: string | null;
 *   lastUpdated: Date | null;
 *   refresh: () => Promise<void>;
 * } | null>} */
const WorldCupContext = createContext(null);

const REFRESH_MS = 60_000;

function getTodayYYYYMMDD() {
  return getLocalDateKey(new Date().toISOString()).replaceAll("-", "");
}

export function WorldCupProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [groups, setGroups] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const dateStr = getTodayYYYYMMDD();
      const todayKey = getLocalDateKey(
        `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T12:00:00Z`,
      );
      const [standingsData, scoreboardData] = await Promise.all([
        fetchStandings(),
        // Usar el calendario ESPN con historial acumulado hasta hoy.
        fetchCalendarByDate(dateStr),
      ]);

      const { teams: parsedTeams, groups: parsedGroups } =
        parseStandings(standingsData);

      const teamGroupMap = Object.fromEntries(
        parsedTeams.map((t) => [t.id, t.group]),
      );

      const { matches: parsedMatches, teamForms } = parseScoreboard(
        scoreboardData,
        teamGroupMap,
      );

      // Merge forms first
      let merged = mergeTeamForms(parsedTeams, teamForms);

      // Ajuste local: sumar solo los puntos de los partidos finalizados de hoy.
      // El endpoint de standings suele ir ligeramente por detrás del marcador.
      const todaysAwards = {};
      for (const m of parsedMatches) {
        if (!m || m.status === "scheduled") continue;
        if (getLocalDateKey(m.date) !== todayKey) continue;
        const homeScore = Number(m.homeScore ?? 0);
        const awayScore = Number(m.awayScore ?? 0);
        let homePts = 0;
        let awayPts = 0;
        if (!Number.isNaN(homeScore) && !Number.isNaN(awayScore)) {
          if (homeScore > awayScore) homePts = 3;
          else if (homeScore < awayScore) awayPts = 3;
          else {
            homePts = 1;
            awayPts = 1;
          }
        }
        todaysAwards[m.homeTeamId] =
          (todaysAwards[m.homeTeamId] || 0) + homePts;
        todaysAwards[m.awayTeamId] =
          (todaysAwards[m.awayTeamId] || 0) + awayPts;
      }

      // Aplicar el ajuste sólo sumando los puntos calculados para el día
      merged = merged.map((t) => ({
        ...t,
        points: (t.points || 0) + (todaysAwards[t.id] || 0),
      }));

      setTeams(merged);
      setGroups(parsedGroups);
      setMatches(parsedMatches);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const value = useMemo(
    () => ({
      teams,
      groups,
      matches,
      loading,
      error,
      lastUpdated,
      refresh,
    }),
    [teams, groups, matches, loading, error, lastUpdated, refresh],
  );

  return (
    <WorldCupContext.Provider value={value}>
      {children}
    </WorldCupContext.Provider>
  );
}

export function useWorldCup() {
  const ctx = useContext(WorldCupContext);
  if (!ctx) {
    throw new Error("useWorldCup debe usarse dentro de WorldCupProvider");
  }
  return ctx;
}
