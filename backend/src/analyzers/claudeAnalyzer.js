/**
 * Claude Analyzer
 *
 * Handles all Claude API interactions for:
 * - Sprint health analysis (Story 4)
 * - Ticket quality checking (Story 5)
 * - Action item generation
 */

const Anthropic = require('@anthropic-ai/sdk');
const { getParameter } = require('../utils/ssm');
const { SPRINT_ANALYSIS_PROMPT, QUALITY_CHECK_PROMPT, ACTION_ITEMS_PROMPT } = require('../prompts');

let anthropic = null;

/**
 * Get or create Claude client
 */
async function getClaudeClient() {
  if (anthropic) return anthropic;

  const apiKey = await getParameter('/sprint-poc/dev/claude-api-key');
  anthropic = new Anthropic({ apiKey });
  return anthropic;
}

/**
 * Analyze sprint health
 * Story 4 - Part A: Agent Development
 *
 * @param {Object} sprintData - Sprint data from MCP
 * @returns {Object} Sprint health analysis
 */
async function analyzeSprintHealth(sprintData) {
  const client = await getClaudeClient();

  const prompt = buildSprintAnalysisPrompt(sprintData);

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3000,
    system: SPRINT_ANALYSIS_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return parseClaudeResponse(response);
}

/**
 * Check ticket quality against docs
 * Story 5 - Part A: Agent Development
 *
 * @param {Object} ticket - Ticket data
 * @param {string} refinementDoc - Refinement doc content
 * @param {string} techDesignDoc - Tech design doc content
 * @returns {Object} Quality analysis
 */
async function checkTicketQuality(ticket, refinementDoc, techDesignDoc) {
  const client = await getClaudeClient();

  const prompt = buildQualityCheckPrompt(ticket, refinementDoc, techDesignDoc);

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2500,
    system: QUALITY_CHECK_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return parseClaudeResponse(response);
}

/**
 * Generate action items for next sprint
 *
 * @param {Object} sprintAnalysis - Sprint analysis results
 * @param {Array} qualityResults - Quality check results
 * @param {Object} sprintData - Original sprint data
 * @returns {Array} Action items
 */
async function generateActionItems(sprintAnalysis, qualityResults, sprintData) {
  const client = await getClaudeClient();

  const prompt = buildActionItemsPrompt(sprintAnalysis, qualityResults, sprintData);

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: ACTION_ITEMS_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  const result = parseClaudeResponse(response);
  return result.actionItems || [];
}

/**
 * Build prompt for sprint analysis
 */
function buildSprintAnalysisPrompt(sprintData) {
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

/**
 * Build prompt for quality checking
 */
function buildQualityCheckPrompt(ticket, refinementDoc, techDesignDoc) {
  return `Analyze this ticket quality:

TICKET: ${ticket.key}
Summary: ${ticket.summary}

Description:
${ticket.description}

Labels: ${ticket.labels?.join(', ') || 'None'}

---

REFINEMENT DOCUMENT:
${refinementDoc}

---

TECH DESIGN DOCUMENT:
${techDesignDoc}

---

Check quality and cross-reference with documents.`;
}

/**
 * Build prompt for action items
 */
function buildActionItemsPrompt(sprintAnalysis, qualityResults, sprintData) {
  const lowQualityTickets = qualityResults.filter(r => r.quality === 'low' || r.quality === 'medium');

  return `Based on the sprint analysis, generate action items for the next sprint:

SPRINT HEALTH: ${sprintAnalysis.sprintHealth}
COMPLETION PREDICTION: ${sprintAnalysis.completionPrediction.likelihood}

STALE TICKETS: ${sprintAnalysis.staleTickets.length}
${sprintAnalysis.staleTickets.map(t => `- ${t.ticketKey}: ${t.reason}`).join('\n')}

WORKLOAD ISSUES:
Overloaded: ${sprintAnalysis.workloadAnalysis.overloaded.map(p => p.person).join(', ') || 'None'}
Underutilized: ${sprintAnalysis.workloadAnalysis.underutilized.map(p => p.person).join(', ') || 'None'}

QUALITY ISSUES: ${lowQualityTickets.length} tickets with issues

KEY INSIGHTS: ${sprintAnalysis.insights}

Generate specific, actionable items for improving the next sprint.`;
}

/**
 * Parse Claude response and extract JSON
 */
function parseClaudeResponse(response) {
  const text = response.content[0].text;

  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }

    console.error('Failed to parse Claude response:', text);
    throw new Error('Claude did not return valid JSON');
  }
}

module.exports = {
  analyzeSprintHealth,
  checkTicketQuality,
  generateActionItems
};
