/**
 * @typedef {'W' | 'D' | 'L'} FormResult
 */

/**
 * @typedef {Object} Team
 * @property {string} id
 * @property {string} name
 * @property {string} group
 * @property {string} logo
 * @property {string} abbreviation
 * @property {number} played
 * @property {number} won
 * @property {number} drawn
 * @property {number} lost
 * @property {number} goalsFor
 * @property {number} goalsAgainst
 * @property {number} points
 * @property {FormResult[]} form
 */

/**
 * @typedef {Object} MatchTeam
 * @property {string} id
 * @property {string} name
 * @property {string} logo
 * @property {string} abbreviation
 */

/**
 * @typedef {Object} Match
 * @property {string} id
 * @property {string} date
 * @property {string} homeTeamId
 * @property {string} awayTeamId
 * @property {number} [homeScore]
 * @property {number} [awayScore]
 * @property {'scheduled' | 'live' | 'finished'} status
 * @property {string} group
 * @property {MatchTeam} [homeTeam]
 * @property {MatchTeam} [awayTeam]
 * @property {string} [winnerTeamId]
 * @property {boolean} [isPenaltyShootout]
 * @property {string} [venue]
 */

/**
 * @typedef {Object} UserPick
 * @property {string} id
 * @property {string} name
 * @property {[string, string, string, string]} teamIds
 */

export {};
