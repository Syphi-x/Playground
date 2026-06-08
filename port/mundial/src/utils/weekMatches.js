import { TOURNAMENT_TIMEZONE } from "../config/tournamentWeeks";

/**
 * @param {string} isoDate
 */
export function formatMatchDate(isoDate) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: TOURNAMENT_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}
