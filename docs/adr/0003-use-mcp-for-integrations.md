# 3. Use MCP for Jira and Google Docs Integration

Date: 2026-03-25

## Status

Accepted

## Context

Sprint Agent needs to fetch data from Jira and read/write Google Docs. Options:
- Direct HTTP API calls (full control, more code)
- MCP servers (standardized, less code, better security)
- SDK libraries (varies by provider)

## Decision

Use Model Context Protocol (MCP) servers for:
- Jira data fetching (sprint data, tickets)
- Google Docs reading (refinement docs, tech design)
- Google Docs writing (weekly reports)

## Consequences

- **Positive**: Standardized integration pattern
- **Positive**: Authentication handled by MCP servers
- **Positive**: Less code to maintain
- **Positive**: Better security (no direct credential handling)
- **Negative**: Dependency on MCP server availability
- **Negative**: Limited to MCP server capabilities
