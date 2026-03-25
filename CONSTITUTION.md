# Sprint Agent Constitution

This document defines the fundamental principles, rules, and standards that govern the Sprint Agent project. All contributors, code, and features must adhere to these principles.

## Core Philosophy

**Goal: Zero manual sprint health checking** - the system tells you what needs attention, not the other way around.

## Architectural Principles

### 1. REST API First

Everything must be driven by a REST API.

- All functionality exposed through documented REST endpoints
- API contract defined before implementation begins
- Frontend and backend can be developed in parallel
- No direct database calls from UI - always through API
- API versioning for backward compatibility

### 2. UI Required

Everything needs a UI. Visual and appealing interaction helps people understand and trust the information.

- Every feature must have a corresponding UI component
- Data must be presented visually, not just as raw JSON
- Use color coding, icons, and charts to convey status
- Responsive design - works on desktop and tablet
- Loading states and error handling visible to users
- No "API-only" features in production

### 3. AI Explains, Not Just Flags

AI must provide reasoning, not just alerts.

- Never just flag an issue - explain WHY it's an issue
- "Ticket stale for 5 days" is insufficient
- "Ticket stale because blocked waiting on API design review based on latest comment" is required
- Predictions must include confidence levels and reasoning
- Recommendations must be specific and actionable

### 4. Proactive, Not Reactive

Catch issues before they become problems.

- Daily automated analysis, not on-demand only
- Alert on day 1 of a potential issue, not day 5
- Sprint prep review before sprint starts
- Predict risks, don't just report failures

### 5. Multiple Output Channels

Information flows to where the team works.

- **Dashboard**: Primary interface for detailed analysis
- **Slack**: Immediate alerts for team awareness
- **Google Docs**: Historical record for retrospectives
- Each channel serves a different purpose - don't duplicate

## Development Standards

### 6. Contract-Driven Development

API contract defines the system boundary.

- OpenAPI/Swagger specification required
- Contract reviewed and approved before implementation
- Mock data created for parallel development
- Response schemas strictly enforced
- Breaking changes require version bump

### 7. MCP for External Integrations

Use Model Context Protocol for third-party services.

- Jira integration via MCP server
- Google Docs integration via MCP server
- No direct HTTP calls to external APIs
- Authentication handled by MCP layer
- Standardized error handling

### 8. Configuration Over Code

Behavior should be configurable without code changes.

- Report frequency (daily/weekly) configurable
- Thresholds (stale days, workload limits) configurable
- Channel settings (Slack channel, Doc ID) configurable
- Use environment variables or SSM parameters
- Document all configuration options

### 9. Graceful Degradation

System must handle failures gracefully.

- Individual component failure doesn't crash entire analysis
- Clear error messages for each integration point
- Retry logic for transient failures
- Partial results returned when possible
- User informed of what failed and why

## Quality Standards

### 10. Testing Required

All code must be tested.

- Unit tests for all business logic
- Integration tests for API endpoints
- Minimum 70% code coverage
- Tests run in CI pipeline
- No deployment without passing tests

### 11. Documentation Required

Code and features must be documented.

- CLAUDE.md for AI context
- README.md for human setup
- API contract for integrations
- ADRs for architectural decisions
- Inline comments for complex logic only

### 12. Conventional Commits

All commits follow conventional commit format.

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- Enforced by pre-commit hooks
- Enables automated changelog generation

## Data Principles

### 13. Historical Record

Insights must be preserved for learning.

- Weekly reports append, never overwrite
- Trends trackable over time
- Data available for retrospectives
- No ephemeral-only analysis

### 14. Actionable Output

Every analysis must produce actionable items.

- Not just "what's wrong" but "what to do"
- Action items have owners and timelines
- Priority assigned to each recommendation
- Expected impact stated
- Can mark actions as done/dismissed

### 15. Trust Through Transparency

Users must understand and trust the analysis.

- Show reasoning, not just conclusions
- Confidence levels on predictions
- Source references (which doc, which comment)
- No black-box decisions

## Operational Principles

### 16. Automation by Default

Manual triggers are fallback, not primary.

- Daily analysis runs automatically (9 AM)
- Weekly reports generated automatically (Friday 5 PM)
- Manual trigger always available
- Schedule configurable per team

### 17. Human in the Loop

AI assists, humans decide.

- Alerts and recommendations, not autonomous actions
- Humans review before taking action
- No auto-reassigning tickets (yet)
- No auto-closing tickets (yet)
- Future: opt-in autonomous actions

### 18. Security First

Protect credentials and data.

- API keys in SSM Parameter Store, never in code
- No secrets in git history
- Pre-commit hooks detect secrets
- Dependabot for security updates
- Minimal permissions for integrations

## Evolution Principles

### 19. PoC to Production Path

Clear path from proof-of-concept to production.

- PoC validates value and approach
- Feedback loop informs improvements
- Incremental capability addition
- Document learnings and limitations

### 20. Continuous Learning (Future)

System improves over time.

- Track which alerts were acted on
- Learn from user feedback
- Improve recommendations based on outcomes
- Eventually: fine-tuned models

---

## Checklist for New Features

Before implementing any new feature, verify:

- [ ] REST API endpoint defined in contract
- [ ] UI component designed
- [ ] AI provides reasoning, not just flags
- [ ] Configuration options documented
- [ ] Error handling defined
- [ ] Tests planned
- [ ] Documentation planned
- [ ] Follows all constitution principles

## Violations

Code or features that violate these principles should be:

1. Flagged in code review
2. Documented as tech debt if shipped
3. Prioritized for remediation
4. Never normalized as "how we do things"

---

*This constitution is a living document. Propose changes via PR with justification.*
