/**
 * Type definitions for Sprint Agent
 */

// Sprint Types
export interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface SprintMetrics {
  totalPoints: number;
  completedPoints: number;
  completionPct: number;
}

// Stale Tickets
export interface StaleTicket {
  ticketKey: string;
  daysSinceUpdate: number;
  reason: string;
  recommendation: string;
  assignee: string;
}

// Workload
export interface WorkloadPerson {
  person: string;
  currentPoints: number;
  reasoning: string;
}

export interface WorkloadAnalysis {
  overloaded: WorkloadPerson[];
  underutilized: WorkloadPerson[];
}

// Predictions
export type LikelihoodLevel = 'high' | 'medium' | 'low';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type HealthStatus = 'healthy' | 'at-risk' | 'critical';
export type QualityLevel = 'high' | 'medium' | 'low';

export interface CompletionPrediction {
  likelihood: LikelihoodLevel;
  reasoning: string;
  confidence: ConfidenceLevel;
}

// Sprint Analysis
export interface SprintAnalysis {
  sprintHealth: HealthStatus;
  completionPrediction: CompletionPrediction;
  staleTickets: StaleTicket[];
  workloadAnalysis: WorkloadAnalysis;
  insights: string;
}

// Quality Issues
export type QualityIssueType =
  | 'missing-ac'
  | 'unclear-description'
  | 'scope-creep'
  | 'missing-requirement'
  | 'missing-details';

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
  ticketKey: string;
  quality: QualityLevel;
  qualityScore: number;
  issues: QualityIssue[];
  scopeCreep: ScopeCreepItem[];
  missingRequirements: MissingRequirement[];
  overallAssessment: string;
}

// Action Items
export type ActionItemType = 'process' | 'capacity' | 'quality' | 'technical';

export interface ActionItem {
  type: ActionItemType;
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  responsible: string;
  timeline: string;
}

// API Response
export interface SprintData {
  sprint: Sprint;
  metrics: SprintMetrics;
  ticketCount: number;
}

export interface AnalysisResponse {
  success: boolean;
  sprintAnalysis: SprintAnalysis;
  qualityResults: QualityResult[];
  actionItems: ActionItem[];
  sprintData: SprintData;
}
