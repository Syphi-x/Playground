/**
 * @param {unknown} value
 */
function statValue(value) {
  return typeof value === "number" ? value : Number(value) || 0;
}

/**
 * @param {{ stats?: { name: string; value: number }[] }} entry
 * @param {string} name
 */
function getStat(entry, name) {
  const stat = entry.stats?.find((s) => s.name === name);
  return statValue(stat?.value);
}

/**
 * @param {string} [formStr]
 * @returns {import('../types.js').FormResult[]}
 */
export function parseFormString(formStr) {
  if (!formStr) return [];
  return formStr
    .split("")
    .filter((c) => c === "W" || c === "D" || c === "L")
    .slice(-5);
}

/**
 * "Grupo A" | "Group A" → "A"
 * @param {string} groupName
 */
export function parseGroupLetter(groupName) {
  const match = groupName.match(/(?:Grupo|Group)\s+([A-L])/i);
  return match?.[1]?.toUpperCase() ?? groupName.trim();
}

/**
 * @param {Record<string, unknown>} data
 */
export function parseStandings(data) {
  /** @type {import('../types.js').Team[]} */
  const teams = [];
  /** @type {string[]} */
  const groups = [];

  for (const groupNode of data.children ?? []) {
    const groupLetter = parseGroupLetter(groupNode.name ?? "");
    if (!groupLetter) continue;

    groups.push(groupLetter);

    for (const entry of groupNode.standings?.entries ?? []) {
      const t = entry.team;
      if (!t?.id) continue;

      teams.push({
        id: String(t.id),
        name: t.displayName ?? t.name ?? "Desconocido",
        group: groupLetter,
        logo: t.logos?.[0]?.href ?? "",
        abbreviation: t.abbreviation ?? "",
        played: getStat(entry, "gamesPlayed"),
        won: getStat(entry, "wins"),
        drawn: getStat(entry, "ties"),
        lost: getStat(entry, "losses"),
        goalsFor: getStat(entry, "pointsFor"),
        goalsAgainst: getStat(entry, "pointsAgainst"),
        points: getStat(entry, "points"),
        form: [],
      });
    }
  }

  return { teams, groups };
}

/**
 * @param {Record<string, unknown>} status
 */
function parseMatchStatus(status) {
  const state = status?.type?.state;
  if (state === "in") return "live";
  if (state === "post") return "finished";
  return "scheduled";
}

/**
 * @param {Record<string, unknown>} data
 * @param {Record<string, string>} teamGroupMap
 */
export function parseScoreboard(data, teamGroupMap) {
  /** @type {import('../types.js').Match[]} */
  const matches = [];
  /** @type {Record<string, import('../types.js').FormResult[]>} */
  const teamForms = {};

  for (const event of data.events ?? []) {
    const competition = event.competitions?.[0];
    if (!competition) continue;

    const competitors = competition.competitors ?? [];
    const home = competitors.find((c) => c.homeAway === "home");
    const away = competitors.find((c) => c.homeAway === "away");
    if (!home?.team?.id || !away?.team?.id) continue;

    const homeId = String(home.team.id);
    const awayId = String(away.team.id);
    const status = parseMatchStatus(competition.status ?? event.status);
    const homeScore = Number(home.score);
    const awayScore = Number(away.score);
    const hasScore = !Number.isNaN(homeScore) && !Number.isNaN(awayScore);

    const group =
      teamGroupMap[homeId] ??
      teamGroupMap[awayId] ??
      extractGroupFromName(event.name);

    matches.push({
      id: String(event.id),
      date: competition.date ?? event.date,
      homeTeamId: homeId,
      awayTeamId: awayId,
      homeScore: status !== "scheduled" && hasScore ? homeScore : undefined,
      awayScore: status !== "scheduled" && hasScore ? awayScore : undefined,
      status,
      group,
      homeTeam: {
        id: homeId,
        name: home.team.displayName ?? home.team.name,
        logo: home.team.logo ?? "",
        abbreviation: home.team.abbreviation ?? "",
      },
      awayTeam: {
        id: awayId,
        name: away.team.displayName ?? away.team.name,
        logo: away.team.logo ?? "",
        abbreviation: away.team.abbreviation ?? "",
      },
      venue: competition.venue?.fullName ?? event.venue?.fullName ?? "",
    });

    if (home.form) teamForms[homeId] = parseFormString(home.form);
    if (away.form) teamForms[awayId] = parseFormString(away.form);
  }

  return { matches, teamForms };
}

/**
 * @param {string} [name]
 */
function extractGroupFromName(name) {
  const match = name?.match(/(?:Grupo|Group)\s+([A-L])/i);
  return match?.[1]?.toUpperCase() ?? "";
}

/**
 * @param {import('../types.js').Team[]} teams
 * @param {Record<string, import('../types.js').FormResult[]>} teamForms
 */
export function mergeTeamForms(teams, teamForms) {
  return teams.map((team) => ({
    ...team,
    form: teamForms[team.id]?.length ? teamForms[team.id] : team.form,
  }));
}
