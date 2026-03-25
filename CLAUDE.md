# Sprint Agent: AI-Powered Sprint Analysis Tool

Sprint Agent automatically analyzes sprint health, ticket quality, and team workload to surface issues before they derail your sprint. Here's what you need to know:

## Why This Exists

Sprints fail for preventable reasons: stale tickets discovered too late, unbalanced workloads, vague acceptance criteria, and scope creep. Manual sprint health checks are time-consuming and inconsistent. This tool runs daily automated analysis and alerts the team via Slack, with weekly reports saved to Google Docs.

**Goal: Zero manual sprint health checking** - the system tells you what needs attention.

## Core Capabilities

| Feature | What It Does |
|---------|--------------|
| Sprint Health Analysis | Identifies stale tickets with reasoning, predicts completion risk, flags workload imbalances |
| Ticket Quality Check | Validates descriptions, acceptance criteria, cross-references against refinement/tech design docs |
| Sprint Prep Review | Validates sprint readiness before commitment, catches issues early |
| Automated Alerts | Daily Slack notifications with @mentions for ticket owners |
| Weekly Reports | Comprehensive Google Docs reports for retrospectives |

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│   Vue 3 + Vite  │────▶│  API Gateway    │
│   Dashboard     │     │  (REST API)     │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  AWS Lambda     │
                        │  (Node.js 18)   │
                        └────────┬────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼───────┐    ┌───────────▼───────────┐    ┌──────▼──────┐
│  Jira MCP     │    │  Google Docs MCP      │    │  Claude API │
│  (Data Fetch) │    │  (Read/Write Docs)    │    │  (Analysis) │
└───────────────┘    └───────────────────────┘    └─────────────┘
```

## Key File Locations

```
sprint-agent/
├── src/                          # Vue 3 Frontend
│   ├── views/DashboardView.vue   # Main dashboard with analysis results
│   ├── components/               # UI components for each analysis type
│   ├── composables/              # Vue composition functions
│   ├── services/sprintService.js # API client
│   └── types/index.js            # TypeScript-style JSDoc types
├── backend/                      # Lambda Backend
│   ├── src/
│   │   ├── index.js              # Main Lambda handler (orchestration)
│   │   ├── analyzers/            # Claude analysis logic
│   │   │   └── claudeAnalyzer.js # Sprint health + quality prompts
│   │   ├── prompts/              # System prompts for Claude
│   │   │   └── index.js          # SPRINT_ANALYSIS_PROMPT, QUALITY_CHECK_PROMPT
│   │   └── utils/ssm.js          # AWS SSM parameter retrieval
│   └── __tests__/                # Jest tests
├── docs/
│   ├── api-contract.md           # REST API specification
│   └── mock-data.json            # Sample data for UI development
└── CLAUDE.md                     # This file
```

## For Contributors

### Adding a New Analyzer

1. Create analyzer in `backend/src/analyzers/`
2. Add system prompt in `backend/src/prompts/index.js`
3. Register in main handler `backend/src/index.js`
4. Add corresponding UI component in `src/components/`
5. Update API contract in `docs/api-contract.md`
6. Add tests in `backend/__tests__/`

### Code Standards

- **Frontend**: Vue 3 Composition API, Tailwind CSS
- **Backend**: Node.js 18, ES modules
- **Testing**: Vitest (frontend), Jest (backend)
- **Linting**: ESLint with Vue plugin
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, etc.)

### Running Locally

```bash
# Frontend
npm install
npm run dev

# Backend (requires AWS credentials)
cd backend && npm install
npm test
```

## Environment Variables

| Variable | Purpose | Where Stored |
|----------|---------|--------------|
| `VITE_API_URL` | Backend API endpoint | `.env` |
| `/sprint-poc/dev/claude-api-key` | Claude API key | AWS SSM |
| `/sprint-poc/dev/jira-board-id` | Jira board to analyze | AWS SSM |
| `/sprint-poc/dev/refinement-doc-id` | Google Doc ID | AWS SSM |
| `/sprint-poc/dev/tech-design-doc-id` | Google Doc ID | AWS SSM |

## Data Flow

1. **Trigger**: Manual button click OR scheduled EventBridge (9 AM daily)
2. **Fetch**: Jira sprint data + Google Docs via MCP servers
3. **Analyze**: Claude evaluates sprint health, ticket quality, workload
4. **Output**: Results to Dashboard, Slack alerts, Google Docs reports
5. **Action**: Users address flagged issues in Jira

## Important Constraints

- Claude responses must be **valid JSON only** (no markdown wrapper)
- MCP servers handle authentication - no direct API calls to Jira/Google
- Slack @mentions require email-to-user-ID lookup
- Sprint Prep runs on-demand only; Health/Quality run daily
- Weekly reports append to existing Google Doc (don't overwrite)

## Related Documentation

- `../sprint-process-poc/jira-stories.md` - User stories and requirements
- `../sprint-process-poc/user-journeys.md` - User flow diagrams
- `../sprint-process-poc/next-phase-continuous-learning.md` - Future: SLM + feedback loop
