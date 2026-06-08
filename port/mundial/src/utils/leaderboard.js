/**
 * @param {import('../types.js').UserPick[]} users
 * @param {import('../types.js').Team[]} teamList
 */
export function getUserLeaderboard(users, teamList) {
  const teamMap = Object.fromEntries(teamList.map((t) => [t.id, t]));

  return users
    .map((user) => {
      const teamPoints = user.teamIds.map((id) => ({
        team: teamMap[id],
        points: teamMap[id]?.points ?? 0,
      }));
      const total = teamPoints.reduce((sum, t) => sum + t.points, 0);
      return { ...user, teamPoints, total };
    })
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "es"));
}
