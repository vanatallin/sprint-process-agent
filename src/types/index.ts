/**
 * Type definitions for Sprint Agent
 */

// Sprint Types
export interface Sprint {
  readonly id: number;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly daysRemaining: number;
}

export interface SprintMetrics {
  readonly totalPoints: number;
  readonly completedPoints: number;
  readonly completionPct: number;
}

// Stale Tickets
export interface StaleTicket {
  readonly ticketKey: string;
  readonly daysSinceUpdate: number;
  readonly reason: string;
  readonly recommendation: string;
  readonly assignee: string;
}

// Workload
export interface WorkloadPerson {
  readonly person: string;
  readonly currentPoints: number;
  readonly reasoning: string;
}

export interface WorkloadAnalysis {
  readonly overloaded: readonly WorkloadPerson[];
  readonly underutilized: readonly WorkloadPerson[];
}

// Predictions
export type LikelihoodLevel = 'high' | 'medium' | 'low';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type HealthStatus = 'healthy' | 'at-risk' | 'critical';
export type QualityLevel = 'high' | 'medium' | 'low';

export interface CompletionPrediction {
  readonly likelihood: LikelihoodLevel;
  readonly reasoning: string;
  readonly confidence: ConfidenceLevel;
}

// Sprint Analysis
export interface SprintAnalysis {
  readonly sprintHealth: HealthStatus;
  readonly completionPrediction: CompletionPrediction;
  readonly staleTickets: readonly StaleTicket[];
  readonly workloadAnalysis: WorkloadAnalysis;
  readonly insights: string;
}

// Quality Issues
export type QualityIssueType =
  | 'missing-ac'
  | 'unclear-description'
  | 'scope-creep'
  | 'missing-requirement'
  | 'missing-details';

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
  readonly ticketKey: string;
  readonly quality: QualityLevel;
  readonly qualityScore: number;
  readonly issues: readonly QualityIssue[];
  readonly scopeCreep: readonly ScopeCreepItem[];
  readonly missingRequirements: readonly MissingRequirement[];
  readonly overallAssessment: string;
}

// Action Items
export type ActionItemType = 'process' | 'capacity' | 'quality' | 'technical';

export interface ActionItem {
  readonly type: ActionItemType;
  readonly priority: 'high' | 'medium' | 'low';
  readonly action: string;
  readonly expectedImpact: string;
  readonly responsible: string;
  readonly timeline: string;
}

// API Response
export interface SprintData {
  readonly sprint: Sprint;
  readonly metrics: SprintMetrics;
  readonly ticketCount: number;
}

export interface AnalysisResponse {
  readonly success: boolean;
  readonly sprintAnalysis: SprintAnalysis;
  readonly qualityResults: readonly QualityResult[];
  readonly actionItems: readonly ActionItem[];
  readonly sprintData: SprintData;
}
