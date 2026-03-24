# Sprint Agent

AI-powered sprint monitoring and ticket quality checking agent.

## Overview

Sprint Agent analyzes your Jira sprints using Claude AI to:
- Identify stale tickets and explain WHY they're stale
- Predict sprint completion likelihood
- Detect workload imbalances
- Check ticket quality against planning documents
- Generate actionable items for sprint improvement

## Project Structure

```
sprint-agent/
├── src/                          # Vue 3 Frontend
│   ├── views/                    # Page components
│   ├── components/               # Reusable UI components
│   ├── composables/              # Vue composition functions
│   ├── services/                 # API service layer
│   └── assets/                   # CSS and static assets
├── backend/                      # Lambda Backend
│   └── src/
│       ├── analyzers/            # Claude analysis logic
│       ├── clients/              # External service clients
│       ├── prompts/              # Claude system prompts
│       └── utils/                # Utilities
├── docs/                         # Documentation
│   ├── api-contract.md           # REST API specification
│   └── mock-data.json            # Sample data for development
└── scripts/                      # Build and deployment scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS CLI configured (for deployment)
- MCP servers configured for Jira and Google Docs

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Run tests
npm test
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

For backend (AWS SSM Parameters):
- `/sprint-poc/dev/claude-api-key` - Anthropic API key

## Stories Reference

| Story | Description | Status |
|-------|-------------|--------|
| 1 | Dashboard UI & REST API Contract | 🔲 |
| 2 | Sprint Data Fetcher (via MCP) | 🔲 |
| 3 | Google Docs Integration (via MCP) | 🔲 |
| 4 | Claude Sprint Health Analyzer | 🔲 |
| 5 | Claude Ticket Quality Checker | 🔲 |
| 6 | ~~Slack Alert Integration~~ | ⏸️ (deferred) |
| 7 | Backend Integration & Main Handler | 🔲 |
| 8 | End-to-End Testing & Documentation | 🔲 |

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vue 3 UI   │────▶│ API Gateway  │────▶│   Lambda     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                     ┌───────────────────────────┼───────────────────────────┐
                     │                           │                           │
                     ▼                           ▼                           ▼
              ┌──────────────┐           ┌──────────────┐
              │  Jira MCP    │           │ Claude API   │
              └──────────────┘           └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Google Docs  │
              │    MCP       │
              └──────────────┘
```

## Development Workflow

1. **Story 1**: Define API contract and build UI with mock data
2. **Stories 2-3**: Configure MCP servers for data fetching (parallel)
3. **Stories 4-5**: Develop Claude analyzers with prompt engineering (parallel with Story 1)
4. **Story 7**: Integrate all components
5. **Story 8**: End-to-end testing

## License

Internal Red Hat project
