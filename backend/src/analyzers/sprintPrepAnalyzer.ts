/**
 * Sprint Prep Analyzer
 *
 * Story 6 - Sprint Readiness Analysis
 *
 * Analyzes sprint readiness before sprint starts:
 * - Ticket completeness
 * - Workload balance
 * - Capacity vs commitment
 * - External dependencies
 *
 * TODO: Implement this analyzer
 */

import { sendClaudeMessage } from '../utils/claudeClient.js';
import { SPRINT_PREP_PROMPT } from '../prompts/index.js';
import type { JiraSprintData, SprintReadiness } from '../types/index.js';

interface TeamCapacity {
  [name: string]: number;
}

interface SprintPrepData extends JiraSprintData {
  sprint: JiraSprintData['sprint'] & {
    startDate?: string;
    duration?: string;
  };
}

/**
 * Analyze sprint readiness
 */
export async function analyzeSprintReadiness(
  sprintData: SprintPrepData,
  refinementDoc = '',
  techDesignDoc = '',
  teamCapacity: TeamCapacity = {}
): Promise<SprintReadiness> {
  const userPrompt = buildSprintPrepPrompt(sprintData, refinementDoc, techDesignDoc, teamCapacity);

  return sendClaudeMessage<SprintReadiness>({
    systemPrompt: SPRINT_PREP_PROMPT,
    userPrompt,
    maxTokens: 3000
  });
}

/**
 * Build user prompt for sprint prep analysis
 */
export function buildSprintPrepPrompt(
  sprintData: SprintPrepData,
  refinementDoc: string,
  techDesignDoc: string,
  teamCapacity: TeamCapacity
): string {
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
