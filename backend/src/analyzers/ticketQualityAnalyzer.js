/**
 * Ticket Quality Analyzer
 *
 * Story 5 - Ticket Quality Checking
 * Owner: [Assign engineer working on Story 5]
 *
 * Checks ticket quality including:
 * - Description clarity
 * - Acceptance criteria completeness
 * - Cross-reference with docs
 * - Scope creep detection
 */

const { sendClaudeMessage } = require('../utils/claudeClient');
const { TICKET_QUALITY_PROMPT } = require('../prompts');

/**
 * Check ticket quality against documentation
 *
 * @param {Object} ticket - Ticket data
 * @param {string} ticket.key - Ticket key (e.g., "PROJ-123")
 * @param {string} ticket.summary - Ticket summary
 * @param {string} ticket.description - Ticket description
 * @param {Array<string>} [ticket.labels] - Ticket labels
 * @param {string} [refinementDoc] - Refinement document content
 * @param {string} [techDesignDoc] - Tech design document content
 * @returns {Promise<Object>} Quality analysis result
 */
async function checkTicketQuality(ticket, refinementDoc = '', techDesignDoc = '') {
  const userPrompt = buildQualityCheckPrompt(ticket, refinementDoc, techDesignDoc);

  return sendClaudeMessage({
    systemPrompt: TICKET_QUALITY_PROMPT,
    userPrompt,
    maxTokens: 2500
  });
}

/**
 * Check quality for multiple tickets
 *
 * @param {Array<Object>} tickets - Array of ticket data
 * @param {string} [refinementDoc] - Refinement document content
 * @param {string} [techDesignDoc] - Tech design document content
 * @returns {Promise<Array<Object>>} Array of quality results with ticketKey
 */
async function checkAllTicketsQuality(tickets, refinementDoc = '', techDesignDoc = '') {
  const results = [];

  for (const ticket of tickets) {
    const quality = await checkTicketQuality(ticket, refinementDoc, techDesignDoc);
    results.push({
      ticketKey: ticket.key,
      ...quality
    });
  }

  return results;
}

/**
 * Build user prompt for quality checking
 * @param {Object} ticket - Ticket data
 * @param {string} refinementDoc - Refinement doc content
 * @param {string} techDesignDoc - Tech design doc content
 * @returns {string} Formatted prompt
 */
function buildQualityCheckPrompt(ticket, refinementDoc, techDesignDoc) {
  return `Analyze this ticket quality:

TICKET: ${ticket.key}
Summary: ${ticket.summary}

Description:
${ticket.description || 'No description provided'}

Labels: ${ticket.labels?.join(', ') || 'None'}

---

REFINEMENT DOCUMENT:
${refinementDoc || 'No refinement document provided'}

---

TECH DESIGN DOCUMENT:
${techDesignDoc || 'No tech design document provided'}

---

Check quality and cross-reference with documents.`;
}

module.exports = {
  checkTicketQuality,
  checkAllTicketsQuality,
  buildQualityCheckPrompt
};
