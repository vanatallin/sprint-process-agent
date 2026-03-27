/**
 * Local Development Server
 *
 * Wraps the Lambda handler in an Express server for local development.
 * This is NOT used in production - Lambda handles requests directly.
 *
 * Usage: npm run dev (from backend directory)
 */

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { handler } from './index.js';
import { storage } from './integrations/index.js';
import type { LambdaEvent, HealthStatus } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  const storageHealth = await storage.healthCheck();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    storage: storageHealth
  });
});

// Main analysis endpoint - wraps Lambda handler
app.post('/analyze-sprint', async (req: Request, res: Response) => {
  try {
    console.log('Received analysis request');

    // Create Lambda-like event object
    const event: LambdaEvent = {
      body: JSON.stringify(req.body),
      headers: req.headers as Record<string, string | undefined>,
      httpMethod: 'POST',
      path: '/analyze-sprint'
    };

    // Call the Lambda handler
    const result = await handler(event);

    // Send response
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

// List recent analyses from storage
app.get('/analyses', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const analyses = await storage.listRecentAnalyses(days);
    res.json({ success: true, analyses });
  } catch (error) {
    console.error('Error listing analyses:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get specific analysis by key
app.get('/analyses/:date/:filename', async (req: Request, res: Response) => {
  try {
    const key = `daily/${req.params.date}/${req.params.filename}`;
    const analysis = await storage.getAnalysis(key);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error('Error getting analysis:', error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Mock data endpoint for UI development
app.get('/mock-analysis', (_req: Request, res: Response) => {
  res.json({
    success: true,
    sprintAnalysis: {
      sprintHealth: 'at-risk' as HealthStatus,
      completionPrediction: {
        likelihood: 'medium',
        reasoning: 'Several tickets are stale and workload is unbalanced',
        confidence: 'medium'
      },
      staleTickets: [
        {
          ticketKey: 'SPRINT-123',
          daysSinceUpdate: 5,
          reason: 'Blocked waiting on API design review',
          recommendation: 'Schedule design review meeting',
          assignee: 'john.doe@example.com'
        }
      ],
      workloadAnalysis: {
        overloaded: [
          { person: 'Alice', currentPoints: 45, reasoning: 'Assigned to 6 tickets' }
        ],
        underutilized: [
          { person: 'Bob', currentPoints: 5, reasoning: 'Only 1 small ticket assigned' }
        ]
      },
      insights: 'Consider redistributing work from Alice to Bob to balance the sprint.'
    },
    qualityResults: [
      {
        ticketKey: 'SPRINT-124',
        quality: 'medium',
        qualityScore: 65,
        issues: [
          {
            type: 'missing-ac',
            severity: 'high',
            description: 'No acceptance criteria defined',
            suggestion: 'Add clear, testable acceptance criteria'
          }
        ],
        scopeCreep: [],
        missingRequirements: [],
        overallAssessment: 'Needs improvement'
      }
    ],
    actionItems: [
      {
        type: 'capacity',
        priority: 'high',
        action: 'Reassign 2 tickets from Alice to Bob',
        expectedImpact: 'Balance workload and reduce burnout risk',
        responsible: 'Scrum Master',
        timeline: 'Before next standup'
      }
    ],
    sprintData: {
      sprint: { name: 'Sprint 42', daysRemaining: 5 },
      metrics: { totalPoints: 55, completedPoints: 21, completionPct: 38.2 },
      ticketCount: 12
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Sprint Agent Backend - Local Development Server           ║
╠════════════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}                  ║
║                                                            ║
║  Endpoints:                                                ║
║    GET  /health           - Health check (incl. storage)   ║
║    POST /analyze-sprint   - Run full analysis              ║
║    GET  /mock-analysis    - Get mock data for UI dev       ║
║    GET  /analyses         - List recent analyses           ║
║    GET  /analyses/:date/  - Get specific analysis          ║
║                                                            ║
║  Storage: ${process.env.S3_ENDPOINT || 'AWS S3 (configure S3_ENDPOINT for MinIO)'}
╚════════════════════════════════════════════════════════════╝
  `);
});
