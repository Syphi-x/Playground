/**
 * Fuente oficial: calendario ESPN México
 * https://www.espn.com.mx/futbol/calendario/_/fecha/YYYYMMDD/liga/fifa.world
 *
 * La página consume la misma API pública con región México e idioma español.
 */
export const ESPN_MX = {
  lang: "es",
  region: "mx",
  league: "fifa.world",
  sport: "soccer",
  calendarUrl: (dateYYYYMMDD) =>
    `https://www.espn.com.mx/futbol/calendario/_/fecha/${dateYYYYMMDD}/liga/fifa.world`,
};

/** Inicio y fin del torneo para cargar todos los partidos. */
export const TOURNAMENT_DATE_RANGE = "20260611-20260719";
