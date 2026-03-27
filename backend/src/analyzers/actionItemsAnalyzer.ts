/**
 * Action Items Analyzer
 *
 * Story 7 - Backend Integration
 *
 * Generates action items based on:
 * - Sprint health analysis
 * - Ticket quality results
 */

import { sendClaudeMessage } from '../utils/claudeClient.js';
import { ACTION_ITEMS_PROMPT } from '../prompts/index.js';
import type { SprintHealthAnalysis, QualityResult, ActionItem } from '../types/index.js';

interface ActionItemsResponse {
  actionItems: ActionItem[];
}

/**
 * Generate action items for next sprint
 */
export async function generateActionItems(
  sprintAnalysis: SprintHealthAnalysis,
  qualityResults: QualityResult[]
): Promise<ActionItem[]> {
  const userPrompt = buildActionItemsPrompt(sprintAnalysis, qualityResults);

  const result = await sendClaudeMessage<ActionItemsResponse>({
    systemPrompt: ACTION_ITEMS_PROMPT,
    userPrompt,
    maxTokens: 2000
  });

  return result.actionItems || [];
}

/**
 * Build user prompt for action items generation
 */
export function buildActionItemsPrompt(
  sprintAnalysis: SprintHealthAnalysis,
  qualityResults: QualityResult[]
): string {
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
