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
  tickets: readonly JiraTicket[],
  refinementDoc = '',
  techDesignDoc = ''
): Promise<readonly QualityResult[]> {
  const qualityPromises = tickets.map(async (ticket) => {
    const quality = await checkTicketQuality(ticket, refinementDoc, techDesignDoc);
    return {
      ...quality,
      ticketKey: ticket.key
    };
  });

  return Promise.all(qualityPromises);
}

/**
 * Build user prompt for quality checking
 */
export function buildQualityCheckPrompt(
  ticket: JiraTicket,
  refinementDoc: string,
  techDesignDoc: string
): string {
  const description = ticket.description ?? 'No description provided';
  const labels = ticket.labels !== undefined && ticket.labels.length > 0
    ? ticket.labels.join(', ')
    : 'None';
  const refinement = refinementDoc !== '' ? refinementDoc : 'No refinement document provided';
  const techDesign = techDesignDoc !== '' ? techDesignDoc : 'No tech design document provided';

  return `Analyze this ticket quality:

TICKET: ${ticket.key}
Summary: ${ticket.summary}

Description:
${description}

Labels: ${labels}

---

REFINEMENT DOCUMENT:
${refinement}

---

TECH DESIGN DOCUMENT:
${techDesign}

---

Check quality and cross-reference with documents.`;
}
