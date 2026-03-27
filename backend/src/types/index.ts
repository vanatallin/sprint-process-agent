/**
 * Backend Type Definitions
 */

import type { Request, Response } from 'express';

/**
 * Custom error for features not yet implemented (HTTP 501)
 */
export class NotImplementedError extends Error {
  public readonly statusCode = 501;

  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

// Re-export shared types from frontend
export type LikelihoodLevel = 'high' | 'medium' | 'low';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type HealthStatus = 'healthy' | 'at-risk' | 'critical';
export type QualityLevel = 'high' | 'medium' | 'low';
export type QualityIssueType =
  | 'missing-ac'
  | 'unclear-description'
  | 'scope-creep'
  | 'missing-requirement'
  | 'missing-details';
export type ActionItemType = 'process' | 'capacity' | 'quality' | 'technical';

// Sprint Analysis Types
export interface StaleTicket {
  readonly ticketKey: string;
  readonly daysSinceUpdate: number;
  readonly reason: string;
  readonly recommendation: string;
  readonly assignee: string;
}

export interface WorkloadPerson {
  readonly person: string;
  readonly currentPoints: number;
  readonly reasoning: string;
}

export interface WorkloadAnalysis {
  readonly overloaded: readonly WorkloadPerson[];
  readonly underutilized: readonly WorkloadPerson[];
}

export interface CompletionPrediction {
  readonly likelihood: LikelihoodLevel;
  readonly reasoning: string;
  readonly confidence: ConfidenceLevel;
}

export interface SprintHealthAnalysis {
  readonly sprintHealth: HealthStatus;
  readonly completionPrediction: CompletionPrediction;
  readonly staleTickets: readonly StaleTicket[];
  readonly workloadAnalysis: WorkloadAnalysis;
  readonly insights: string;
}

// Quality Types
export interface QualityIssue {
  readonly type: QualityIssueType;
  readonly severity: 'high' | 'medium' | 'low';
  readonly description: string;
  readonly suggestion: string;
}

export interface ScopeCreepItem {
  readonly item: string;
  readonly location: 'description' | 'ac';
  readonly recommendation: string;
}

export interface MissingRequirement {
  readonly item: string;
  readonly sourceDoc: 'refinement' | 'tech-design';
  readonly recommendation: string;
}

export interface QualityResult {
  readonly ticketKey?: string;
  readonly quality: QualityLevel;
  readonly qualityScore: number;
  readonly issues: readonly QualityIssue[];
  readonly scopeCreep: readonly ScopeCreepItem[];
  readonly missingRequirements: readonly MissingRequirement[];
  readonly overallAssessment: string;
}

// Action Items
export interface ActionItem {
  readonly type: ActionItemType;
  readonly priority: 'high' | 'medium' | 'low';
  readonly action: string;
  readonly expectedImpact: string;
  readonly responsible: string;
  readonly timeline: string;
}

// Jira Types
export interface JiraComment {
  readonly author: string;
  readonly body: string;
}

export interface JiraTicket {
  readonly key: string;
  readonly summary: string;
  readonly status: string;
  readonly storyPoints: number;
  readonly assignee: string;
  readonly description?: string;
  readonly acceptanceCriteria?: string;
  readonly daysSinceUpdate: number;
  readonly comments: readonly JiraComment[];
  readonly labels?: readonly string[];
}

export interface JiraWorkload {
  readonly name: string;
  readonly points: number;
  readonly tickets: readonly string[];
}

export interface JiraSprintData {
  readonly sprint: {
    readonly name: string;
    readonly daysRemaining: number;
  };
  readonly metrics: {
    readonly totalPoints: number;
    readonly completedPoints: number;
    readonly completionPct: number;
  };
  readonly workload: readonly JiraWorkload[];
  readonly tickets: readonly JiraTicket[];
}

// Claude Client Types
export interface ClaudeMessageOptions {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly maxTokens?: number;
}

export interface ClaudeContentBlock {
  readonly text: string;
}

export interface ClaudeResponse {
  readonly content: readonly ClaudeContentBlock[];
}

// Storage Types
export interface StorageResult {
  readonly location: string;
  readonly key: string;
  readonly timestamp: string;
}

export interface StorageHealthCheck {
  readonly status: 'ok' | 'error';
  readonly bucket?: string;
  readonly error?: string;
}

// Lambda Types
export interface LambdaEvent {
  readonly body?: string;
  readonly headers: Readonly<Record<string, string | undefined>>;
  readonly httpMethod: string;
  readonly path: string;
}

export interface LambdaResponse {
  readonly statusCode: number;
  readonly headers: Readonly<Record<string, string>>;
  readonly body: string;
}

// Express Types
export type ExpressHandler = (req: Request, res: Response) => Promise<void>;

// Sprint Prep Types
export interface SprintReadiness {
  readonly overall: 'ready' | 'needs-work' | 'not-ready';
  readonly ticketReadiness: {
    readonly ready: number;
    readonly needsWork: number;
    readonly notReady: number;
  };
  readonly blockers: readonly string[];
  readonly recommendations: readonly string[];
}
