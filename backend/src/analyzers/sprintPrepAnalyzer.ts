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
  readonly [name: string]: number;
}

interface SprintPrepData extends JiraSprintData {
  readonly sprint: JiraSprintData['sprint'] & {
    readonly startDate?: string;
    readonly duration?: string;
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
  const sprintName = sprintData.sprint.name;
  const startDate = sprintData.sprint.startDate ?? 'Not set';
  const duration = sprintData.sprint.duration ?? '2 weeks';

  const capacityList = Object.entries(teamCapacity)
    .map(([name, capacity]) => `- ${name}: ${capacity} points available`)
    .join('\n');

  const ticketsList = sprintData.tickets
    .map(t => {
      const points = t.storyPoints > 0 ? String(t.storyPoints) : 'Not estimated';
      const assignee = t.assignee !== '' ? t.assignee : 'Unassigned';
      const hasAC = t.acceptanceCriteria !== undefined && t.acceptanceCriteria !== '' ? 'Yes' : 'No';

      return `
Ticket: ${t.key}
Summary: ${t.summary}
Points: ${points}
Assignee: ${assignee}
Has AC: ${hasAC}`;
    })
    .join('\n---\n');

  const refinement = refinementDoc !== '' ? refinementDoc : 'No refinement document provided';
  const techDesign = techDesignDoc !== '' ? techDesignDoc : 'No tech design document provided';

  return `Analyze this upcoming sprint for readiness:

SPRINT: ${sprintName}
Planned Start: ${startDate}
Duration: ${duration}

TEAM CAPACITY:
${capacityList.length > 0 ? capacityList : 'No capacity data provided'}

COMMITTED TICKETS:
${ticketsList}

REFINEMENT DOCUMENT:
${refinement}

TECH DESIGN DOCUMENT:
${techDesign}

Analyze if this sprint is ready to begin.`;
}
