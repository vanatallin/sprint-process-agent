/**
 * Sprint Health Analyzer
 *
 * Story 4 - Sprint Health Analysis
 *
 * Analyzes sprint health including:
 * - Stale ticket identification with reasoning
 * - Sprint completion prediction
 * - Workload analysis
 */

import { sendClaudeMessage } from '../utils/claudeClient.js';
import { SPRINT_HEALTH_PROMPT } from '../prompts/index.js';
import type { JiraSprintData, SprintHealthAnalysis } from '../types/index.js';

/**
 * Analyze sprint health
 */
export async function analyzeSprintHealth(sprintData: JiraSprintData): Promise<SprintHealthAnalysis> {
  const userPrompt = buildSprintHealthPrompt(sprintData);

  return sendClaudeMessage<SprintHealthAnalysis>({
    systemPrompt: SPRINT_HEALTH_PROMPT,
    userPrompt,
    maxTokens: 3000
  });
}

/**
 * Build user prompt for sprint health analysis
 */
export function buildSprintHealthPrompt(sprintData: JiraSprintData): string {
  const workloadList = sprintData.workload
    .map(w => `- ${w.name}: ${w.points} points (${w.tickets.length} tickets)`)
    .join('\n');

  const ticketsList = sprintData.tickets
    .map(t => {
      const commentsList = t.comments
        .map(c => `  - ${c.author}: ${c.body}`)
        .join('\n');

      return `
Ticket: ${t.key}
Summary: ${t.summary}
Status: ${t.status}
Points: ${t.storyPoints}
Assignee: ${t.assignee}
Days since update: ${t.daysSinceUpdate}
Recent comments:
${commentsList}`;
    })
    .join('\n---\n');

  return `Analyze this sprint:

SPRINT: ${sprintData.sprint.name}
Days remaining: ${sprintData.sprint.daysRemaining}
Total points: ${sprintData.metrics.totalPoints}
Completed points: ${sprintData.metrics.completedPoints}
Completion: ${sprintData.metrics.completionPct.toFixed(1)}%

TEAM WORKLOAD:
${workloadList}

TICKETS:
${ticketsList}

Provide comprehensive analysis.`;
}
