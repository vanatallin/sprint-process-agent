/**
 * Ticket Quality Analyzer
 *
 * Story 5 - Ticket Quality Checking
 *
 * Checks ticket quality including:
 * - Description clarity
 * - Acceptance criteria completeness
 * - Cross-reference with docs
 * - Scope creep detection
 */

import { sendClaudeMessage } from '../utils/claudeClient.js';
import { TICKET_QUALITY_PROMPT } from '../prompts/index.js';
import type { JiraTicket, QualityResult } from '../types/index.js';

/**
 * Check ticket quality against documentation
 */
export async function checkTicketQuality(
  ticket: JiraTicket,
  refinementDoc = '',
  techDesignDoc = ''
): Promise<QualityResult> {
  const userPrompt = buildQualityCheckPrompt(ticket, refinementDoc, techDesignDoc);

  return sendClaudeMessage<QualityResult>({
    systemPrompt: TICKET_QUALITY_PROMPT,
    userPrompt,
    maxTokens: 2500
  });
}

/**
 * Check quality for multiple tickets
 */
export async function checkAllTicketsQuality(
  tickets: JiraTicket[],
  refinementDoc = '',
  techDesignDoc = ''
): Promise<QualityResult[]> {
  const results: QualityResult[] = [];

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
 */
export function buildQualityCheckPrompt(
  ticket: JiraTicket,
  refinementDoc: string,
  techDesignDoc: string
): string {
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
