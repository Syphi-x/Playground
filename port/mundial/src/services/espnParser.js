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
    const homeWon = Boolean(home.winner);
    const awayWon = Boolean(away.winner);
    const winnerTeamId = homeWon ? homeId : awayWon ? awayId : undefined;
    const isPenaltyShootout =
      status === "finished" &&
      Boolean(winnerTeamId) &&
      hasScore &&
      homeScore === awayScore;

    const group =
      teamGroupMap[homeId] ??
      teamGroupMap[awayId] ??
      extractGroupFromName(event.name);

    matches.push({
      id: String(event.id),
      date: competition.date ?? event.date,
      homeTeamId: homeId,
      awayTeamId: awayId,
      // stage: e.g. 'round-of-32', 'group', etc.
      stage: event.season?.slug ?? competition.season?.slug ?? "",
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
      winnerTeamId,
      isPenaltyShootout,
      venue: competition.venue?.fullName ?? event.venue?.fullName ?? "",
    });

    if (home.form) teamForms[homeId] = parseFormString(home.form);
    if (away.form) teamForms[awayId] = parseFormString(away.form);
  }

  return { matches, teamForms };
}

const KNOCKOUT_STAGES = new Set([
  "round-of-32",
  "round-of-16",
  "quarterfinals",
  "semifinals",
  "3rd-place-match",
  "final",
]);

function toNumber(value) {
  return typeof value === "number" ? value : Number(value) || 0;
}

/**
 * Adds knockout-stage results to the team totals coming from standings.
 * Regulation wins are worth 3 points. Penalty wins are worth 2 points for the
 * winner and 1 point for the loser.
 * @param {import('../types.js').Team[]} teams
 * @param {import('../types.js').Match[]} matches
 */
export function applyKnockoutResults(teams, matches) {
  const adjustments = new Map();

  for (const match of matches) {
    if (!match || match.status !== "finished") continue;
    if (!KNOCKOUT_STAGES.has(match.stage)) continue;

    const winnerTeamId = match.winnerTeamId ?? null;
    const homeId = match.homeTeamId;
    const awayId = match.awayTeamId;
    const homeScore = toNumber(match.homeScore);
    const awayScore = toNumber(match.awayScore);
    const isPenaltyShootout = Boolean(match.isPenaltyShootout);

    if (!winnerTeamId || !homeId || !awayId) continue;

    const loserTeamId = winnerTeamId === homeId ? awayId : homeId;
    const winnerIsHome = winnerTeamId === homeId;
    const winnerPoints = isPenaltyShootout ? 2 : 3;
    const loserPoints = isPenaltyShootout ? 1 : 0;

    const winnerGoalsFor = winnerIsHome ? homeScore : awayScore;
    const winnerGoalsAgainst = winnerIsHome ? awayScore : homeScore;
    const loserGoalsFor = winnerIsHome ? awayScore : homeScore;
    const loserGoalsAgainst = winnerIsHome ? homeScore : awayScore;

    const winnerAdj = adjustments.get(winnerTeamId) ?? {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    };
    winnerAdj.played += 1;
    winnerAdj.won += 1;
    winnerAdj.goalsFor += winnerGoalsFor;
    winnerAdj.goalsAgainst += winnerGoalsAgainst;
    winnerAdj.points += winnerPoints;
    adjustments.set(winnerTeamId, winnerAdj);

    const loserAdj = adjustments.get(loserTeamId) ?? {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    };
    loserAdj.played += 1;
    loserAdj.lost += 1;
    loserAdj.goalsFor += loserGoalsFor;
    loserAdj.goalsAgainst += loserGoalsAgainst;
    loserAdj.points += loserPoints;
    adjustments.set(loserTeamId, loserAdj);
  }

  return teams.map((team) => {
    const adjustment = adjustments.get(team.id);
    if (!adjustment) return team;

    return {
      ...team,
      played: team.played + adjustment.played,
      won: team.won + adjustment.won,
      drawn: team.drawn + adjustment.drawn,
      lost: team.lost + adjustment.lost,
      goalsFor: team.goalsFor + adjustment.goalsFor,
      goalsAgainst: team.goalsAgainst + adjustment.goalsAgainst,
      points: team.points + adjustment.points,
    };
  });
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
