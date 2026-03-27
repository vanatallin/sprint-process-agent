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
├── src/                          # Vue 3 Frontend (TypeScript)
│   ├── views/DashboardView.vue   # Main dashboard with analysis results
│   ├── components/               # UI components for each analysis type
│   ├── composables/              # Vue composition functions (.ts)
│   ├── services/sprintService.ts # API client
│   └── types/index.ts            # TypeScript interfaces
├── backend/                      # Lambda Backend (TypeScript)
│   ├── src/
│   │   ├── index.ts              # Main Lambda handler (orchestration)
│   │   ├── types/index.ts        # Backend-specific types
│   │   ├── analyzers/            # Claude analysis logic (.ts)
│   │   ├── prompts/              # System prompts for Claude (.ts)
│   │   └── utils/ssm.ts          # AWS SSM parameter retrieval
│   └── __tests__/                # Jest tests (.ts)
├── tsconfig.json                 # Base TypeScript config
├── tsconfig.app.json             # Frontend TypeScript config
└── backend/tsconfig.json         # Backend TypeScript config
```

## For Contributors

### Adding a New Analyzer

1. Create analyzer in `backend/src/analyzers/` (TypeScript required)
2. Add system prompt in `backend/src/prompts/index.ts`
3. Register in main handler `backend/src/index.ts`
4. Add types in `backend/src/types/index.ts`
5. Add corresponding UI component in `src/components/`
6. Update API contract in `docs/api-contract.md`
7. Add tests in `backend/__tests__/`

### Code Standards

- **Language**: TypeScript (mandatory for all new code)
- **Frontend**: Vue 3 Composition API with TypeScript, Tailwind CSS
- **Backend**: Node.js 18, ES modules, TypeScript
- **Testing**: Vitest (frontend), Jest with ts-jest (backend)
- **Linting**: ESLint with TypeScript plugin
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, etc.)

### TypeScript Guidelines

1. **No `any` types** - Use proper types or `unknown` with type guards
2. **Strict mode enabled** - All strictness checks are on
3. **Explicit return types** - All functions should have explicit return types
4. **Interface over type** - Prefer interfaces for object shapes
5. **Shared types** - Place shared types in `src/types/` (frontend) or `backend/src/types/`
6. **Import type** - Use `import type` for type-only imports

### Running Locally

```bash
# Frontend
npm install
npm run dev
npm run typecheck  # Verify TypeScript types

# Backend (requires AWS credentials)
cd backend && npm install
npm run build      # Compile TypeScript
npm run dev        # Run with tsx
npm test           # Run tests
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
- **All new code must be written in TypeScript**

## Related Documentation

- `../sprint-process-poc/jira-stories.md` - User stories and requirements
- `../sprint-process-poc/user-journeys.md` - User flow diagrams
- `../sprint-process-poc/next-phase-continuous-learning.md` - Future: SLM + feedback loop
