/**
 * Sprint Health Analyzer
 *
 * Story 4 - Sprint Health Analysis
 * Owner: [Assign engineer working on Story 4]
 *
 * Analyzes sprint health including:
 * - Stale ticket identification with reasoning
 * - Sprint completion prediction
 * - Workload analysis
 */

const { sendClaudeMessage } = require('../utils/claudeClient');
const { SPRINT_HEALTH_PROMPT } = require('../prompts');

/**
 * Analyze sprint health
 *
 * @param {Object} sprintData - Sprint data from Jira MCP
 * @param {Object} sprintData.sprint - Sprint info (name, daysRemaining)
 * @param {Object} sprintData.metrics - Sprint metrics (totalPoints, completedPoints, completionPct)
 * @param {Array} sprintData.workload - Team workload [{name, points, tickets}]
 * @param {Array} sprintData.tickets - Ticket details [{key, summary, status, storyPoints, assignee, daysSinceUpdate, comments}]
 * @returns {Promise<Object>} Sprint health analysis
 */
async function analyzeSprintHealth(sprintData) {
  const userPrompt = buildSprintHealthPrompt(sprintData);

  return sendClaudeMessage({
    systemPrompt: SPRINT_HEALTH_PROMPT,
    userPrompt,
    maxTokens: 3000
  });
}

/**
 * Build user prompt for sprint health analysis
 * @param {Object} sprintData - Sprint data
 * @returns {string} Formatted prompt
 */
function buildSprintHealthPrompt(sprintData) {
  return `Analyze this sprint:

SPRINT: ${sprintData.sprint.name}
Days remaining: ${sprintData.sprint.daysRemaining}
Total points: ${sprintData.metrics.totalPoints}
Completed points: ${sprintData.metrics.completedPoints}
Completion: ${sprintData.metrics.completionPct.toFixed(1)}%

TEAM WORKLOAD:
${sprintData.workload.map(w => `- ${w.name}: ${w.points} points (${w.tickets.length} tickets)`).join('\n')}

TICKETS:
${sprintData.tickets.map(t => `
Ticket: ${t.key}
Summary: ${t.summary}
Status: ${t.status}
Points: ${t.storyPoints}
Assignee: ${t.assignee}
Days since update: ${t.daysSinceUpdate}
Recent comments:
${t.comments.map(c => `  - ${c.author}: ${c.body}`).join('\n')}
`).join('\n---\n')}

Provide comprehensive analysis.`;
}

module.exports = {
  analyzeSprintHealth,
  buildSprintHealthPrompt
};
