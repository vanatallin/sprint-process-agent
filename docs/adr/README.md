# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for Sprint Agent.

## What are ADRs?

ADRs document significant architectural decisions with their context and consequences. They help future contributors understand why the system is built the way it is.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-use-architecture-decision-records.md) | Use Architecture Decision Records | Accepted |
| [0002](0002-use-claude-for-analysis.md) | Use Claude API for Sprint Analysis | Accepted |
| [0003](0003-use-mcp-for-integrations.md) | Use MCP for Jira and Google Docs Integration | Accepted |

## Creating New ADRs

1. Copy the template below
2. Number sequentially (0004, 0005, etc.)
3. Fill in all sections
4. Update this README index

### Template

```markdown
# N. Title

Date: YYYY-MM-DD

## Status

Proposed | Accepted | Deprecated | Superseded

## Context

What is the issue that we're seeing that is motivating this decision?

## Decision

What is the change that we're proposing?

## Consequences

What becomes easier or harder as a result of this change?
```
