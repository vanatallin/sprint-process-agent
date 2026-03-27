/**
 * Jira Integration via MCP
 *
 * Story 2 - Sprint Data Fetcher
 *
 * Fetches sprint data from Jira using MCP server.
 *
 * TODO: Implement MCP integration
 */

import { NotImplementedError, type JiraSprintData, type JiraTicket, type JiraWorkload } from '../../types/index.js';

interface RawJiraTicket {
  readonly key: string;
  readonly summary: string;
  readonly status: string;
  readonly storyPoints: number;
  readonly assignee: string;
  readonly updated?: string;
  readonly created?: string;
}

/**
 * Fetch active sprint data for configured board
 */
export async function fetchSprintData(): Promise<JiraSprintData> {
  // TODO: Implement MCP integration for Jira
  // See Story 2 acceptance criteria for details
  await Promise.resolve(); // Placeholder for async operation
  throw new NotImplementedError('Jira MCP integration not yet implemented - see Story 2');
}

/**
 * Fetch upcoming/next sprint data for sprint prep analysis
 */
export async function fetchNextSprintData(): Promise<JiraSprintData> {
  // TODO: Implement for Story 6
  await Promise.resolve(); // Placeholder for async operation
  throw new NotImplementedError('Jira MCP integration not yet implemented - see Story 2');
}

/**
 * Calculate days since last update for a ticket
 */
export function calculateDaysSinceUpdate(ticket: RawJiraTicket): number {
  const updateDate = ticket.updated ?? ticket.created;
  const lastUpdate = new Date(updateDate ?? Date.now());
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Aggregate workload by team member
 */
export function aggregateWorkload(tickets: readonly JiraTicket[]): readonly JiraWorkload[] {
  const workloadMap = new Map<string, { readonly name: string; points: number; tickets: readonly string[] }>();

  for (const ticket of tickets) {
    const assignee = ticket.assignee !== '' ? ticket.assignee : 'Unassigned';
    const existing = workloadMap.get(assignee);

    if (existing === undefined) {
      workloadMap.set(assignee, {
        name: assignee,
        points: ticket.storyPoints,
        tickets: [ticket.key]
      });
    } else {
      workloadMap.set(assignee, {
        name: assignee,
        points: existing.points + ticket.storyPoints,
        tickets: [...existing.tickets, ticket.key]
      });
    }
  }

  return Array.from(workloadMap.values());
}
