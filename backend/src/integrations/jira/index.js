/**
 * Jira Integration via MCP
 *
 * Story 2 - Sprint Data Fetcher
 * Owner: [Assign engineer working on Story 2]
 *
 * Fetches sprint data from Jira using MCP server.
 *
 * TODO: Implement MCP integration
 */

/**
 * Fetch active sprint data for configured board
 *
 * @returns {Promise<Object>} Sprint data object
 * @returns {Object} return.sprint - Sprint info (id, name, daysRemaining, startDate, endDate)
 * @returns {Object} return.metrics - Sprint metrics (totalPoints, completedPoints, completionPct)
 * @returns {Array} return.workload - Team workload [{name, points, tickets}]
 * @returns {Array} return.tickets - Ticket details [{key, summary, status, storyPoints, assignee, daysSinceUpdate, comments}]
 */
async function fetchSprintData() {
  // TODO: Implement MCP integration for Jira
  // See Story 2 acceptance criteria for details
  throw new Error('Jira MCP integration not yet implemented - see Story 2');
}

/**
 * Fetch upcoming/next sprint data for sprint prep analysis
 *
 * @returns {Promise<Object>} Next sprint data
 */
async function fetchNextSprintData() {
  // TODO: Implement for Story 6
  throw new Error('Jira MCP integration not yet implemented - see Story 2');
}

/**
 * Calculate days since last update for a ticket
 *
 * @param {Object} ticket - Jira ticket
 * @returns {number} Days since last update
 */
function calculateDaysSinceUpdate(ticket) {
  const lastUpdate = new Date(ticket.updated || ticket.created);
  const now = new Date();
  const diffTime = Math.abs(now - lastUpdate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Aggregate workload by team member
 *
 * @param {Array} tickets - Array of tickets
 * @returns {Array} Workload by person [{name, points, tickets}]
 */
function aggregateWorkload(tickets) {
  const workloadMap = {};

  for (const ticket of tickets) {
    const assignee = ticket.assignee || 'Unassigned';
    if (!workloadMap[assignee]) {
      workloadMap[assignee] = { name: assignee, points: 0, tickets: [] };
    }
    workloadMap[assignee].points += ticket.storyPoints || 0;
    workloadMap[assignee].tickets.push(ticket.key);
  }

  return Object.values(workloadMap);
}

module.exports = {
  fetchSprintData,
  fetchNextSprintData,
  calculateDaysSinceUpdate,
  aggregateWorkload
};
