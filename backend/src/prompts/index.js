/**
 * Prompts Barrel Export
 *
 * Re-exports all prompts from individual files.
 * This file should rarely need modification - just add new exports.
 */

const { SPRINT_HEALTH_PROMPT } = require('./sprintHealth');
const { TICKET_QUALITY_PROMPT } = require('./ticketQuality');
const { ACTION_ITEMS_PROMPT } = require('./actionItems');
const { SPRINT_PREP_PROMPT } = require('./sprintPrep');

// Legacy aliases for backward compatibility
const SPRINT_ANALYSIS_PROMPT = SPRINT_HEALTH_PROMPT;
const QUALITY_CHECK_PROMPT = TICKET_QUALITY_PROMPT;

module.exports = {
  // New exports (use these)
  SPRINT_HEALTH_PROMPT,
  TICKET_QUALITY_PROMPT,
  ACTION_ITEMS_PROMPT,
  SPRINT_PREP_PROMPT,

  // Legacy aliases (deprecated, for backward compatibility)
  SPRINT_ANALYSIS_PROMPT,
  QUALITY_CHECK_PROMPT
};
