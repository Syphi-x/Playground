/**
 * @param {import('../types.js').Team} a
 * @param {import('../types.js').Team} b
 */
export function compareTeams(a, b) {
  const gdA = a.goalsFor - a.goalsAgainst;
  const gdB = b.goalsFor - b.goalsAgainst;
  return (
    b.points - a.points ||
    gdB - gdA ||
    b.goalsFor - a.goalsFor ||
    a.name.localeCompare(b.name, "es")
  );
}

/**
 * @param {import('../types.js').Team[]} teamList
 */
export function sortTeams(teamList) {
  return [...teamList].sort(compareTeams);
}

/**
 * @param {import('../types.js').Team} team
 */
export function goalDifference(team) {
  return team.goalsFor - team.goalsAgainst;
}

/**
 * @param {import('../types.js').Team} team
 */
export function formatGoalDiff(team) {
  const diff = goalDifference(team);
  return diff > 0 ? `+${diff}` : `${diff}`;
}
