import { ESPN_MX, TOURNAMENT_DATE_RANGE } from "../config/espnMexico";

const ESPN_BASE = "https://site.api.espn.com/apis";

const SCOREBOARD_URL = `${ESPN_BASE}/site/v2/sports/${ESPN_MX.sport}/${ESPN_MX.league}/scoreboard`;
const STANDINGS_URL = `${ESPN_BASE}/v2/sports/${ESPN_MX.sport}/${ESPN_MX.league}/standings`;

function buildParams(extra = {}) {
  return new URLSearchParams({
    lang: ESPN_MX.lang,
    region: ESPN_MX.region,
    calendartype: "whitelist",
    ...extra,
  });
}

/**
 * Misma fuente que espn.com.mx/futbol/calendario
 * @param {string} dates YYYYMMDD o YYYYMMDD-YYYYMMDD
 */
export async function fetchScoreboard(dates, limit = 500) {
  const params = buildParams({ dates, limit: String(limit) });
  const res = await fetch(`${SCOREBOARD_URL}?${params}`);
  if (!res.ok) throw new Error(`ESPN México scoreboard error: ${res.status}`);
  return res.json();
}

/** Tabla de posiciones — espn.com.mx/futbol/posiciones */
export async function fetchStandings() {
  const params = buildParams();
  const res = await fetch(`${STANDINGS_URL}?${params}`);
  if (!res.ok) throw new Error(`ESPN México standings error: ${res.status}`);
  return res.json();
}

/** Calendario completo del Mundial (fase de grupos + eliminatoria). */
export async function fetchAllMatches() {
  return fetchScoreboard(TOURNAMENT_DATE_RANGE, 500);
}

/**
 * Partidos alrededor de una fecha (como la página de calendario ESPN MX).
 * @param {string} dateYYYYMMDD ej. "20260612"
 */
export async function fetchCalendarByDate(dateYYYYMMDD) {
  return fetchScoreboard(dateYYYYMMDD, 100);
}
