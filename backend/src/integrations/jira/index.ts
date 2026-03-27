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
  key: string;
  summary: string;
  status: string;
  storyPoints: number;
  assignee: string;
  updated?: string;
  created?: string;
}

/**
 * Fetch active sprint data for configured board
 */
export async function fetchSprintData(): Promise<JiraSprintData> {
  // TODO: Implement MCP integration for Jira
  // See Story 2 acceptance criteria for details
  throw new NotImplementedError('Jira MCP integration not yet implemented - see Story 2');
}

/**
 * Fetch upcoming/next sprint data for sprint prep analysis
 */
export async function fetchNextSprintData(): Promise<JiraSprintData> {
  // TODO: Implement for Story 6
  throw new NotImplementedError('Jira MCP integration not yet implemented - see Story 2');
}

/**
 * Calculate days since last update for a ticket
 */
export function calculateDaysSinceUpdate(ticket: RawJiraTicket): number {
  const lastUpdate = new Date(ticket.updated || ticket.created || Date.now());
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Aggregate workload by team member
 */
export function aggregateWorkload(tickets: JiraTicket[]): JiraWorkload[] {
  const workloadMap: Record<string, JiraWorkload> = {};

  for (const ticket of tickets) {
    const assignee = ticket.assignee || 'Unassigned';
    if (!workloadMap[assignee]) {
      workloadMap[assignee] = { name: assignee, points: 0, tickets: [] };
    }
    workloadMap[assignee].points += ticket.storyPoints || 0;
    workloadMap[assignee].tickets.push(ticket.key);
  }

  return Object.values(workloadMap);
}
