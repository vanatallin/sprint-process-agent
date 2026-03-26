# Sprint Agent

AI-powered sprint monitoring and ticket quality checking agent that automatically identifies issues before they derail your sprint.

## Why Sprint Agent?

Sprints fail for preventable reasons:

- **Stale tickets** discovered too late in the sprint
- **Unbalanced workloads** that lead to burnout or bottlenecks
- **Vague acceptance criteria** causing rework and delays
- **Scope creep** that goes unnoticed until it's too late

Sprint Agent automates analysis using Claude AI:
- Runs daily health checks automatically
- Alerts your team via Slack before problems escalate
- Generates weekly status reports to Google Docs
- **Goal: Zero manual sprint health checking**

## Features

- **Sprint Health Analysis** - Identifies stale tickets with reasoning, predicts completion risk, flags workload imbalances
- **Ticket Quality Check** - Validates descriptions/AC against refinement and tech design docs
- **Sprint Prep Review** - Validates sprint readiness before commitment
- **Automated Alerts** - Daily Slack notifications with @mentions for ticket owners
- **Weekly Reports** - Comprehensive Google Docs reports for retrospectives

## Quick Start

**Prerequisites:** Node.js 18+, npm 9+

### 1. Install Dependencies

```bash
git clone https://github.com/vanatallin/sprint-process-agent.git
cd sprint-process-agent

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set:
# VITE_API_URL=http://localhost:3001  (for local backend)
# Or use your deployed API Gateway URL
```

### 3. Run the Application

**Frontend only (uses mock data):**
```bash
npm run dev
# Opens http://localhost:3000
```

**Backend local server:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Run both together:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### AWS SSM Parameters (for deployed backend)

When deploying to AWS Lambda, these parameters must be set in SSM Parameter Store:

- `/sprint-poc/dev/claude-api-key` - Anthropic API key
- `/sprint-poc/dev/jira-board-id` - Jira board ID
- `/sprint-poc/dev/refinement-doc-id` - Refinement Google Doc ID
- `/sprint-poc/dev/tech-design-doc-id` - Tech design Google Doc ID
- `/sprint-poc/dev/slack-webhook-url` - Slack webhook URL

## Usage

**Dashboard:**
- Navigate to dashboard, click "Run Sprint Analysis"
- View stale tickets with explanations
- Review completion risk and workload distribution

**Ticket Quality:**
- Select a ticket, click "Check Quality"
- See missing AC, vague descriptions, scope creep flagged
- Get cross-reference issues with planning docs

**Automated Schedule (via EventBridge):**
- Daily 9 AM: Sprint health + ticket quality analysis
- Weekly Friday 5 PM: Status report to Google Docs

## Development

**Commands:**
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run test:coverage` - Tests with coverage
- `npm run lint` - Check linting
- `npm run lint:fix` - Auto-fix lint issues
- `npm run validate` - Run all checks (lint + format + test)
- `cd backend && npm test` - Backend tests

**Code standards:**
- Vue 3 Composition API, Tailwind CSS
- Node.js 18, ES modules
- Vitest (frontend), Jest (backend)
- Conventional commits required

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

**Quick workflow:**
- Create branch: `git checkout -b feat/your-feature`
- Make changes, run `npm run validate`
- Commit: `git commit -m "feat(analyzer): add new check"`
- Open PR

**Commit types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

## Project Structure

```
sprint-agent/
├── src/                          # Vue 3 Frontend
│   ├── components/               # UI components (cards, charts)
│   ├── views/                    # Page views (DashboardView)
│   ├── composables/              # Vue composition functions
│   ├── services/                 # API client
│   └── types/                    # TypeScript-style JSDoc types
├── backend/src/                  # Lambda Backend
│   ├── analyzers/                # Claude analysis modules
│   │   ├── sprintHealthAnalyzer.js   # Story 4
│   │   ├── ticketQualityAnalyzer.js  # Story 5
│   │   ├── sprintPrepAnalyzer.js     # Story 6
│   │   └── actionItemsAnalyzer.js    # Story 7
│   ├── prompts/                  # System prompts for Claude
│   │   ├── sprintHealth.js
│   │   ├── ticketQuality.js
│   │   ├── sprintPrep.js
│   │   └── actionItems.js
│   ├── integrations/             # External service integrations
│   │   ├── jira/                 # Story 2 - Jira MCP
│   │   ├── googleDocs/           # Story 9/10 - Google Docs MCP
│   │   └── slack/                # Story 11 - Slack alerts
│   └── utils/                    # Shared utilities
│       ├── claudeClient.js       # Claude API client
│       └── ssm.js                # AWS SSM parameters
├── tests/                        # Frontend tests
├── docs/                         # API contract, mock data, ADRs
└── .github/
    ├── workflows/ci.yml          # CI/CD pipeline
    └── CODEOWNERS                # File ownership for PRs
```

**Parallel Development:** Each story has isolated files to minimize merge conflicts. See `.github/CODEOWNERS` for file ownership.

## Architecture

```
Vue Dashboard → API Gateway → Lambda → Claude API
                                ↓
                    Jira MCP ← → Google Docs MCP
```

## License

MIT - See [LICENSE](LICENSE)
