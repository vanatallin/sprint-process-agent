# Sprint Agent API Contract

## Overview

REST API contract for the Sprint Agent backend. This defines the interface between the Vue dashboard and the Lambda backend.

## Base URL

- **Development:** `http://localhost:3001`
- **Production:** `https://{api-gateway-id}.execute-api.{region}.amazonaws.com/prod`

---

## Endpoints

### POST /analyze-sprint

Triggers a full sprint analysis including health check, ticket quality, and action items generation.

#### Request

```http
POST /analyze-sprint
Content-Type: application/json
```

**Body:** None required (uses configured sprint/board)

#### Response (200 OK)

```json
{
  "success": true,
  "sprintAnalysis": {
    "sprintHealth": "healthy" | "at-risk" | "critical",
    "completionPrediction": {
      "likelihood": "high" | "medium" | "low",
      "reasoning": "string",
      "confidence": "high" | "medium" | "low"
    },
    "staleTickets": [
      {
        "ticketKey": "SPRINT-123",
        "daysSinceUpdate": 5,
        "reason": "string - why ticket is stale",
        "recommendation": "string - what to do",
        "assignee": "John Doe"
      }
    ],
    "workloadAnalysis": {
      "overloaded": [
        {
          "person": "Alice",
          "currentPoints": 21,
          "reasoning": "string"
        }
      ],
      "underutilized": [
        {
          "person": "Bob",
          "currentPoints": 3,
          "reasoning": "string"
        }
      ]
    },
    "insights": "string - overall sprint health insights"
  },
  "qualityResults": [
    {
      "ticketKey": "SPRINT-456",
      "quality": "high" | "medium" | "low",
      "qualityScore": 85,
      "issues": [
        {
          "type": "missing-ac" | "unclear-description" | "scope-creep" | "missing-requirement" | "missing-details",
          "severity": "high" | "medium" | "low",
          "description": "string",
          "suggestion": "string"
        }
      ],
      "scopeCreep": [
        {
          "item": "string",
          "location": "description" | "ac",
          "recommendation": "string"
        }
      ],
      "missingRequirements": [
        {
          "item": "string",
          "sourceDoc": "refinement" | "tech-design",
          "recommendation": "string"
        }
      ],
      "overallAssessment": "string"
    }
  ],
  "actionItems": [
    {
      "type": "process" | "capacity" | "quality" | "technical",
      "priority": "high" | "medium" | "low",
      "action": "string",
      "expectedImpact": "string",
      "responsible": "string",
      "timeline": "string"
    }
  ],
  "sprintData": {
    "sprint": {
      "id": 123,
      "name": "Sprint 42",
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-01-29T00:00:00Z",
      "daysRemaining": 5
    },
    "metrics": {
      "totalPoints": 55,
      "completedPoints": 21,
      "completionPct": 38.2
    },
    "ticketCount": 15
  }
}
```

#### Error Response (500)

```json
{
  "error": "Error message",
  "stack": "Stack trace (development only)"
}
```

---

## CORS Headers

All responses include:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: *
Access-Control-Allow-Methods: POST, OPTIONS
```

---

## Rate Limits

| Component | Limit | Notes |
|-----------|-------|-------|
| API Gateway | 10 req/sec | Can be increased |
| Lambda | 1 concurrent | PoC limitation |
| Claude API | 50 req/min | Shared across calls |

---

## Response Time

Expected response time: **45-90 seconds** for a 20-ticket sprint

Breakdown:
- Jira data fetch: 2-5 seconds
- Google Docs fetch: 1-3 seconds
- Sprint health analysis: 5-10 seconds
- Ticket quality checks: 30-60 seconds (N tickets)
- Slack posting: 1-2 seconds

---

## Error Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 401 | Unauthorized (API key issues) |
| 429 | Rate limited |
| 500 | Internal server error |
| 504 | Timeout (analysis took too long) |
