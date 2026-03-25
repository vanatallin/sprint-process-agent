/**
 * Type definitions for Sprint Agent
 *
 * These are JSDoc type definitions for editor support.
 * Consider migrating to TypeScript for full type safety.
 */

/**
 * @typedef {Object} Sprint
 * @property {number} id
 * @property {string} name
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} daysRemaining
 */

/**
 * @typedef {Object} SprintMetrics
 * @property {number} totalPoints
 * @property {number} completedPoints
 * @property {number} completionPct
 */

/**
 * @typedef {Object} StaleTicket
 * @property {string} ticketKey
 * @property {number} daysSinceUpdate
 * @property {string} reason
 * @property {string} recommendation
 * @property {string} assignee
 */

/**
 * @typedef {Object} WorkloadPerson
 * @property {string} person
 * @property {number} currentPoints
 * @property {string} reasoning
 */

/**
 * @typedef {Object} WorkloadAnalysis
 * @property {WorkloadPerson[]} overloaded
 * @property {WorkloadPerson[]} underutilized
 */

/**
 * @typedef {Object} CompletionPrediction
 * @property {'high' | 'medium' | 'low'} likelihood
 * @property {string} reasoning
 * @property {'high' | 'medium' | 'low'} confidence
 */

/**
 * @typedef {Object} SprintAnalysis
 * @property {'healthy' | 'at-risk' | 'critical'} sprintHealth
 * @property {CompletionPrediction} completionPrediction
 * @property {StaleTicket[]} staleTickets
 * @property {WorkloadAnalysis} workloadAnalysis
 * @property {string} insights
 */

/**
 * @typedef {Object} QualityIssue
 * @property {'missing-ac' | 'unclear-description' | 'scope-creep' | 'missing-requirement' | 'missing-details'} type
 * @property {'high' | 'medium' | 'low'} severity
 * @property {string} description
 * @property {string} suggestion
 */

/**
 * @typedef {Object} ScopeCreepItem
 * @property {string} item
 * @property {'description' | 'ac'} location
 * @property {string} recommendation
 */

/**
 * @typedef {Object} MissingRequirement
 * @property {string} item
 * @property {'refinement' | 'tech-design'} sourceDoc
 * @property {string} recommendation
 */

/**
 * @typedef {Object} QualityResult
 * @property {string} ticketKey
 * @property {'high' | 'medium' | 'low'} quality
 * @property {number} qualityScore
 * @property {QualityIssue[]} issues
 * @property {ScopeCreepItem[]} scopeCreep
 * @property {MissingRequirement[]} missingRequirements
 * @property {string} overallAssessment
 */

/**
 * @typedef {Object} ActionItem
 * @property {'process' | 'capacity' | 'quality' | 'technical'} type
 * @property {'high' | 'medium' | 'low'} priority
 * @property {string} action
 * @property {string} expectedImpact
 * @property {string} responsible
 * @property {string} timeline
 */

/**
 * @typedef {Object} AnalysisResponse
 * @property {boolean} success
 * @property {SprintAnalysis} sprintAnalysis
 * @property {QualityResult[]} qualityResults
 * @property {ActionItem[]} actionItems
 * @property {{ sprint: Sprint, metrics: SprintMetrics, ticketCount: number }} sprintData
 */

export {};
