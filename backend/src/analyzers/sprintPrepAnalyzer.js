/**
 * Sprint Prep Analyzer
 *
 * Story 6 - Sprint Readiness Analysis
 * Owner: [Assign engineer working on Story 6]
 *
 * Analyzes sprint readiness before sprint starts:
 * - Ticket completeness
 * - Workload balance
 * - Capacity vs commitment
 * - External dependencies
 *
 * TODO: Implement this analyzer
 */

const { sendClaudeMessage } = require('../utils/claudeClient');
const { SPRINT_PREP_PROMPT } = require('../prompts');

/**
 * Analyze sprint readiness
 *
 * @param {Object} sprintData - Upcoming sprint data from Jira MCP
 * @param {string} [refinementDoc] - Refinement document content
 * @param {string} [techDesignDoc] - Tech design document content
 * @param {Object} [teamCapacity] - Team capacity info
 * @returns {Promise<Object>} Sprint readiness analysis
 */
async function analyzeSprintReadiness(sprintData, refinementDoc = '', techDesignDoc = '', teamCapacity = {}) {
  const userPrompt = buildSprintPrepPrompt(sprintData, refinementDoc, techDesignDoc, teamCapacity);

  return sendClaudeMessage({
    systemPrompt: SPRINT_PREP_PROMPT,
    userPrompt,
    maxTokens: 3000
  });
}

/**
 * Build user prompt for sprint prep analysis
 * @param {Object} sprintData - Sprint data
 * @param {string} refinementDoc - Refinement doc content
 * @param {string} techDesignDoc - Tech design doc content
 * @param {Object} teamCapacity - Team capacity info
 * @returns {string} Formatted prompt
 */
function buildSprintPrepPrompt(sprintData, refinementDoc, techDesignDoc, teamCapacity) {
  // TODO: Implement prompt building for Story 6
  return `Analyze this upcoming sprint for readiness:

SPRINT: ${sprintData.sprint?.name || 'Unknown'}
Planned Start: ${sprintData.sprint?.startDate || 'Not set'}
Duration: ${sprintData.sprint?.duration || '2 weeks'}

TEAM CAPACITY:
${Object.entries(teamCapacity).map(([name, capacity]) => `- ${name}: ${capacity} points available`).join('\n') || 'No capacity data provided'}

COMMITTED TICKETS:
${(sprintData.tickets || []).map(t => `
Ticket: ${t.key}
Summary: ${t.summary}
Points: ${t.storyPoints || 'Not estimated'}
Assignee: ${t.assignee || 'Unassigned'}
Has AC: ${t.acceptanceCriteria ? 'Yes' : 'No'}
`).join('\n---\n')}

REFINEMENT DOCUMENT:
${refinementDoc || 'No refinement document provided'}

TECH DESIGN DOCUMENT:
${techDesignDoc || 'No tech design document provided'}

Analyze if this sprint is ready to begin.`;
}

module.exports = {
  analyzeSprintReadiness,
  buildSprintPrepPrompt
};
