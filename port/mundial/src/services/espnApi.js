import { ESPN_MX, TOURNAMENT_DATE_RANGE } from "../config/espnMexico";

const ESPN_BASE = "https://site.api.espn.com/apis";

const SCOREBOARD_URL = `${ESPN_BASE}/site/v2/sports/${ESPN_MX.sport}/${ESPN_MX.league}/scoreboard`;
const STANDINGS_URL = `${ESPN_BASE}/v2/sports/${ESPN_MX.sport}/${ESPN_MX.league}/standings`;
const [TOURNAMENT_START_DATE] = TOURNAMENT_DATE_RANGE.split("-");

function buildParams(extra = {}) {
  return new URLSearchParams({
    lang: ESPN_MX.lang,
    region: ESPN_MX.region,
    calendartype: "whitelist",
    ...extra,
  });
}

function dateKeyToDate(dateYYYYMMDD) {
  return new Date(
    `${dateYYYYMMDD.slice(0, 4)}-${dateYYYYMMDD.slice(4, 6)}-${dateYYYYMMDD.slice(6, 8)}T12:00:00Z`,
  );
}

function dateToKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function buildDateList(startYYYYMMDD, endYYYYMMDD) {
  const start = dateKeyToDate(startYYYYMMDD);
  const end = dateKeyToDate(endYYYYMMDD);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return [];
  }

  const from = start <= end ? start : end;
  const to = start <= end ? end : start;
  const dates = [];

  for (
    let cursor = new Date(from);
    cursor <= to;
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  ) {
    dates.push(dateToKey(cursor));
  }

  return dates;
}

function mergeScoreboardPayloads(payloads) {
  const eventsById = new Map();

  for (const payload of payloads) {
    for (const event of payload?.events ?? []) {
      if (!event?.id) continue;
      eventsById.set(String(event.id), event);
    }
  }

  return {
    ...(payloads.at(-1) ?? {}),
    events: Array.from(eventsById.values()),
  };
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

/**
 * Calendario histórico hasta una fecha específica, usando páginas diarias.
 * @param {string} dateYYYYMMDD ej. "20260629"
 * @param {string} [startYYYYMMDD] ej. "20260611"
 */
export async function fetchCalendarHistory(
  dateYYYYMMDD,
  startYYYYMMDD = TOURNAMENT_START_DATE,
) {
  const dates = buildDateList(startYYYYMMDD, dateYYYYMMDD);
  const payloads = await Promise.all(
    dates.map((date) => fetchScoreboard(date, 100)),
  );
  return mergeScoreboardPayloads(payloads);
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
 * Partidos hasta una fecha específica, como las instancias diarias del calendario ESPN MX.
 * @param {string} dateYYYYMMDD ej. "20260612"
 */
export async function fetchCalendarByDate(dateYYYYMMDD) {
  return fetchCalendarHistory(dateYYYYMMDD, TOURNAMENT_START_DATE);
}
