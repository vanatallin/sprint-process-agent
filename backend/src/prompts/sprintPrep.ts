/**
 * Sprint Prep Analysis Prompt
 *
 * Story 6 - Sprint Prep Analyzer
 *
 * TODO: Implement prompt for sprint readiness analysis
 */

export const SPRINT_PREP_PROMPT = `You are a Sprint Readiness Analyzer.

Analyze the upcoming sprint to determine if it's ready to begin.

Check for:
1. Tickets missing story points
2. Tickets with vague or missing acceptance criteria
3. Tickets with unclear descriptions
4. Alignment with refinement doc
5. Alignment with tech design doc
6. External dependencies not flagged
7. Unresolved blockers
8. Team capacity vs committed points

Return ONLY valid JSON:
{
  "readinessScore": number (0-100),
  "readinessStatus": "ready" | "needs-work" | "not-ready",
  "ticketsNeedingAttention": [
    {
      "ticketKey": "string",
      "issues": ["string - list of issues"],
      "recommendation": "string"
    }
  ],
  "workloadBalance": {
    "isBalanced": boolean,
    "issues": ["string - workload issues"],
    "suggestions": ["string - rebalancing suggestions"]
  },
  "capacityAnalysis": {
    "totalCapacity": number,
    "totalCommitted": number,
    "isOvercommitted": boolean,
    "recommendation": "string"
  },
  "recommendedActions": [
    {
      "action": "string - what to do before sprint starts",
      "priority": "high" | "medium" | "low",
      "owner": "string - who should do this"
    }
  ],
  "summary": "string - human-readable summary for sprint planning meeting"
}`;
