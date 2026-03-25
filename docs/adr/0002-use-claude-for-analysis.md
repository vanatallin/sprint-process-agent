# 2. Use Claude API for Sprint Analysis

Date: 2026-03-25

## Status

Accepted

## Context

Sprint Agent needs to analyze sprint data and ticket quality intelligently. Options considered:
- Rule-based analysis (simple but inflexible)
- Claude API (sophisticated reasoning, natural language)
- Local LLM (privacy but resource-intensive)

Requirements:
- Explain WHY tickets are stale, not just flag them
- Cross-reference tickets against planning documents
- Generate human-readable summaries

## Decision

Use Claude API (Anthropic) for all analysis tasks:
- Sprint health analysis
- Ticket quality checking
- Sprint prep review

## Consequences

- **Positive**: High-quality reasoning and explanations
- **Positive**: Natural language understanding for docs
- **Positive**: Rapid iteration on prompts
- **Negative**: Requires API key and has usage costs
- **Negative**: Depends on external service availability
- **Mitigated**: SSM Parameter Store for secure key storage
