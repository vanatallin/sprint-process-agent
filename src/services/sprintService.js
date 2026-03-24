/**
 * Sprint Analysis Service
 * Handles API calls to the backend for sprint analysis
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const sprintService = {
  /**
   * Run full sprint analysis
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeCurrentSprint() {
    const response = await fetch(`${API_URL}/analyze-sprint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Analysis failed: ${response.status}`)
    }

    return response.json()
  }
}

// Mock data for development - remove when backend is ready
export const mockAnalysisResults = {
  sprintAnalysis: {
    sprintHealth: 'at-risk',
    completionPrediction: {
      likelihood: 'medium',
      reasoning: 'Based on current velocity and remaining work, the sprint has a moderate chance of completion. 3 tickets are blocked and need immediate attention.',
      confidence: 'medium'
    },
    staleTickets: [
      {
        ticketKey: 'SPRINT-123',
        daysSinceUpdate: 5,
        reason: 'Blocked waiting for API design approval from architecture team',
        recommendation: 'Schedule sync with architecture team to unblock',
        assignee: 'John Doe'
      },
      {
        ticketKey: 'SPRINT-456',
        daysSinceUpdate: 3,
        reason: 'Developer is on PTO, no handoff was done',
        recommendation: 'Reassign to available team member or wait for return',
        assignee: 'Jane Smith'
      }
    ],
    workloadAnalysis: {
      overloaded: [
        {
          person: 'Alice Johnson',
          currentPoints: 21,
          reasoning: 'Has 21 points assigned which exceeds typical capacity of 13 points per sprint'
        }
      ],
      underutilized: [
        {
          person: 'Bob Williams',
          currentPoints: 3,
          reasoning: 'Only 3 points assigned, has capacity to take on more work'
        }
      ]
    },
    insights: 'The sprint is at risk due to 2 blocked tickets and uneven workload distribution. Consider redistributing work from Alice to Bob to improve completion chances.'
  },
  qualityResults: [
    {
      ticketKey: 'SPRINT-789',
      quality: 'low',
      qualityScore: 45,
      issues: [
        {
          type: 'missing-ac',
          severity: 'high',
          description: 'Acceptance criteria are vague and not testable',
          suggestion: 'Add specific, measurable acceptance criteria'
        }
      ],
      scopeCreep: [],
      missingRequirements: [
        {
          item: 'Error handling for API failures',
          sourceDoc: 'tech-design',
          recommendation: 'Add error handling requirements from tech design section 3.2'
        }
      ]
    }
  ],
  actionItems: [
    {
      type: 'process',
      priority: 'high',
      action: 'Schedule daily standups to catch blockers early',
      expectedImpact: 'Reduce blocked ticket duration by 50%',
      responsible: 'Scrum Master',
      timeline: 'Implement next sprint'
    }
  ],
  sprintData: {
    sprint: {
      id: 123,
      name: 'Sprint 42',
      daysRemaining: 5
    },
    metrics: {
      totalPoints: 55,
      completedPoints: 21,
      completionPct: 38.2
    }
  }
}
