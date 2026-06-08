import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchAllMatches, fetchStandings } from "../services/espnApi";
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
      const [standingsData, scoreboardData] = await Promise.all([
        fetchStandings(),
        fetchAllMatches(),
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

      setTeams(mergeTeamForms(parsedTeams, teamForms));
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
    <WorldCupContext.Provider value={value}>{children}</WorldCupContext.Provider>
  );
}

export function useWorldCup() {
  const ctx = useContext(WorldCupContext);
  if (!ctx) {
    throw new Error("useWorldCup debe usarse dentro de WorldCupProvider");
  }
  return ctx;
}
