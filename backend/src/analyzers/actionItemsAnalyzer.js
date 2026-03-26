/**
 * Action Items Analyzer
 *
 * Story 7 - Backend Integration
 * Owner: [Assign engineer working on Story 7]
 *
 * Generates action items based on:
 * - Sprint health analysis
 * - Ticket quality results
 */

const { sendClaudeMessage } = require('../utils/claudeClient');
const { ACTION_ITEMS_PROMPT } = require('../prompts');

/**
 * Generate action items for next sprint
 *
 * @param {Object} sprintAnalysis - Sprint health analysis results
 * @param {Array<Object>} qualityResults - Ticket quality check results
 * @returns {Promise<Array<Object>>} Array of action items
 */
async function generateActionItems(sprintAnalysis, qualityResults) {
  const userPrompt = buildActionItemsPrompt(sprintAnalysis, qualityResults);

  const result = await sendClaudeMessage({
    systemPrompt: ACTION_ITEMS_PROMPT,
    userPrompt,
    maxTokens: 2000
  });

  return result.actionItems || [];
}

/**
 * Build user prompt for action items generation
 * @param {Object} sprintAnalysis - Sprint analysis results
 * @param {Array<Object>} qualityResults - Quality check results
 * @returns {string} Formatted prompt
 */
function buildActionItemsPrompt(sprintAnalysis, qualityResults) {
  const lowQualityTickets = qualityResults.filter(
    r => r.quality === 'low' || r.quality === 'medium'
  );

  return `Based on the sprint analysis, generate action items for the next sprint:

SPRINT HEALTH: ${sprintAnalysis.sprintHealth}
COMPLETION PREDICTION: ${sprintAnalysis.completionPrediction?.likelihood || 'unknown'}

STALE TICKETS: ${sprintAnalysis.staleTickets?.length || 0}
${(sprintAnalysis.staleTickets || []).map(t => `- ${t.ticketKey}: ${t.reason}`).join('\n')}

WORKLOAD ISSUES:
Overloaded: ${(sprintAnalysis.workloadAnalysis?.overloaded || []).map(p => p.person).join(', ') || 'None'}
Underutilized: ${(sprintAnalysis.workloadAnalysis?.underutilized || []).map(p => p.person).join(', ') || 'None'}

QUALITY ISSUES: ${lowQualityTickets.length} tickets with issues

KEY INSIGHTS: ${sprintAnalysis.insights || 'No insights available'}

Generate specific, actionable items for improving the next sprint.`;
}

module.exports = {
  generateActionItems,
  buildActionItemsPrompt
};
