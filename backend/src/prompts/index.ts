/**
 * Prompts Barrel Export
 *
 * Re-exports all prompts from individual files.
 */

export { SPRINT_HEALTH_PROMPT } from './sprintHealth.js';
export { TICKET_QUALITY_PROMPT } from './ticketQuality.js';
export { ACTION_ITEMS_PROMPT } from './actionItems.js';
export { SPRINT_PREP_PROMPT } from './sprintPrep.js';

// Legacy aliases for backward compatibility
export { SPRINT_HEALTH_PROMPT as SPRINT_ANALYSIS_PROMPT } from './sprintHealth.js';
export { TICKET_QUALITY_PROMPT as QUALITY_CHECK_PROMPT } from './ticketQuality.js';
