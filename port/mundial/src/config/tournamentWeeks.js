export const TOURNAMENT_TIMEZONE = "America/Mexico_City";

/**
 * Semanas del torneo (jueves a miércoles, hora Ciudad de México).
 * Semana 1: México vs Sudáfrica (11 jun) → Uzbekistán vs Colombia (17 jun noche local).
 */
export const TOURNAMENT_WEEKS = [
  { id: 1, label: "Semana 1", start: "2026-06-11", end: "2026-06-17" },
  { id: 2, label: "Semana 2", start: "2026-06-18", end: "2026-06-24" },
  { id: 3, label: "Semana 3", start: "2026-06-25", end: "2026-07-01" },
  { id: 4, label: "Semana 4", start: "2026-07-02", end: "2026-07-08" },
  { id: 5, label: "Semana 5", start: "2026-07-09", end: "2026-07-15" },
  { id: 6, label: "Semana 6", start: "2026-07-16", end: "2026-07-22" },
];

/**
 * @param {string} isoDate
 */
export function getLocalDateKey(isoDate) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TOURNAMENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date(isoDate));
}

/**
 * @param {string} isoDate
 */
export function getWeekForMatch(isoDate) {
  const localDate = getLocalDateKey(isoDate);
  return (
    TOURNAMENT_WEEKS.find((w) => localDate >= w.start && localDate <= w.end) ??
    null
  );
}

/**
 * @param {import('../types.js').Match[]} matches
 */
export function groupMatchesByWeek(matches) {
  const grouped = TOURNAMENT_WEEKS.map((week) => ({
    ...week,
    matches: [],
  }));

  const overflow = [];

  for (const match of matches) {
    const week = getWeekForMatch(match.date);
    if (week) {
      grouped.find((w) => w.id === week.id)?.matches.push(match);
    } else {
      overflow.push(match);
    }
  }

  for (const week of grouped) {
    week.matches.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  if (overflow.length > 0) {
    grouped.push({
      id: 99,
      label: "Otros",
      start: "",
      end: "",
      matches: overflow.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    });
  }

  return grouped.filter((w) => w.matches.length > 0 || w.id <= 6);
}

/**
 * @param {string} start YYYY-MM-DD
 * @param {string} end YYYY-MM-DD
 */
export function formatWeekRange(start, end) {
  const fmt = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    timeZone: TOURNAMENT_TIMEZONE,
  });
  return `${fmt.format(new Date(`${start}T12:00:00`))} – ${fmt.format(new Date(`${end}T12:00:00`))}`;
}
