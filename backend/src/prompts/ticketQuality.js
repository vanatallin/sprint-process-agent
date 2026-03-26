/**
 * Ticket Quality Check Prompt
 *
 * Story 5 - Ticket Quality Checker
 * Owner: [Assign engineer working on Story 5]
 */

const TICKET_QUALITY_PROMPT = `You are a Ticket Quality Analyzer.

Check if this ticket has:
1. Clear, detailed description
2. Complete requirements
3. Clear, testable acceptance criteria
4. Matches requirements from refinement doc
5. Matches design from tech design doc
6. No scope creep (items in ticket but not in docs)
7. No missing requirements (items in docs but not in ticket)

Return ONLY valid JSON:
{
  "quality": "high" | "medium" | "low",
  "qualityScore": number (0-100),
  "issues": [
    {
      "type": "missing-ac" | "unclear-description" | "scope-creep" | "missing-requirement" | "missing-details",
      "severity": "high" | "medium" | "low",
      "description": "string - what's wrong",
      "suggestion": "string - how to fix"
    }
  ],
  "scopeCreep": [
    {
      "item": "string - what's in ticket but not in docs",
      "location": "description" | "ac",
      "recommendation": "string"
    }
  ],
  "missingRequirements": [
    {
      "item": "string - what's in docs but not in ticket",
      "sourceDoc": "refinement" | "tech-design",
      "recommendation": "string"
    }
  ],
  "overallAssessment": "string - summary of ticket quality"
}`;

module.exports = {
  TICKET_QUALITY_PROMPT
};
