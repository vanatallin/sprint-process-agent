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
  ticketKey: string;
  daysSinceUpdate: number;
  reason: string;
  recommendation: string;
  assignee: string;
}

export interface WorkloadPerson {
  person: string;
  currentPoints: number;
  reasoning: string;
}

export interface WorkloadAnalysis {
  overloaded: WorkloadPerson[];
  underutilized: WorkloadPerson[];
}

export interface CompletionPrediction {
  likelihood: LikelihoodLevel;
  reasoning: string;
  confidence: ConfidenceLevel;
}

export interface SprintHealthAnalysis {
  sprintHealth: HealthStatus;
  completionPrediction: CompletionPrediction;
  staleTickets: StaleTicket[];
  workloadAnalysis: WorkloadAnalysis;
  insights: string;
}

// Quality Types
export interface QualityIssue {
  type: QualityIssueType;
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
}

export interface ScopeCreepItem {
  item: string;
  location: 'description' | 'ac';
  recommendation: string;
}

export interface MissingRequirement {
  item: string;
  sourceDoc: 'refinement' | 'tech-design';
  recommendation: string;
}

export interface QualityResult {
  ticketKey?: string;
  quality: QualityLevel;
  qualityScore: number;
  issues: QualityIssue[];
  scopeCreep: ScopeCreepItem[];
  missingRequirements: MissingRequirement[];
  overallAssessment: string;
}

// Action Items
export interface ActionItem {
  type: ActionItemType;
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  responsible: string;
  timeline: string;
}

// Jira Types
export interface JiraComment {
  author: string;
  body: string;
}

export interface JiraTicket {
  key: string;
  summary: string;
  status: string;
  storyPoints: number;
  assignee: string;
  description?: string;
  acceptanceCriteria?: string;
  daysSinceUpdate: number;
  comments: JiraComment[];
  labels?: string[];
}

export interface JiraWorkload {
  name: string;
  points: number;
  tickets: string[];
}

export interface JiraSprintData {
  sprint: {
    name: string;
    daysRemaining: number;
  };
  metrics: {
    totalPoints: number;
    completedPoints: number;
    completionPct: number;
  };
  workload: JiraWorkload[];
  tickets: JiraTicket[];
}

// Claude Client Types
export interface ClaudeMessageOptions {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface ClaudeContentBlock {
  text: string;
}

export interface ClaudeResponse {
  content: ClaudeContentBlock[];
}

// Storage Types
export interface StorageResult {
  location: string;
  key: string;
  timestamp: string;
}

export interface StorageHealthCheck {
  status: 'ok' | 'error';
  bucket?: string;
  error?: string;
}

// Lambda Types
export interface LambdaEvent {
  body?: string;
  headers: Record<string, string | undefined>;
  httpMethod: string;
  path: string;
}

export interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

// Express Types
export type ExpressHandler = (req: Request, res: Response) => Promise<void>;

// Sprint Prep Types
export interface SprintReadiness {
  overall: 'ready' | 'needs-work' | 'not-ready';
  ticketReadiness: {
    ready: number;
    needsWork: number;
    notReady: number;
  };
  blockers: string[];
  recommendations: string[];
}
