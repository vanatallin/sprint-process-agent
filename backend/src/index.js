/**
 * Sprint Agent - Main Lambda Handler
 *
 * Orchestrates the sprint analysis workflow:
 * 1. Fetch sprint data (via MCP)
 * 2. Fetch Google Docs (via MCP)
 * 3. Analyze sprint health (Claude)
 * 4. Check ticket quality (Claude)
 * 5. Generate action items (Claude)
 * 6. Return results
 */

const { analyzeSprintHealth, checkTicketQuality, generateActionItems } = require('./analyzers/claudeAnalyzer');

exports.handler = async (event) => {
  console.log('Starting sprint analysis...');

  try {
    // 1. Fetch sprint data via MCP
    // TODO: Implement MCP integration for Jira
    console.log('Fetching sprint data via MCP...');
    const sprintData = await fetchSprintDataViaMCP();

    // 2. Fetch Google Docs via MCP
    // TODO: Implement MCP integration for Google Docs
    console.log('Fetching documents via MCP...');
    const { refinementDoc, techDesignDoc } = await fetchDocsViaMCP();

    // 3. Analyze sprint health with Claude
    console.log('Analyzing sprint health...');
    const sprintAnalysis = await analyzeSprintHealth(sprintData);
    console.log(`Sprint health: ${sprintAnalysis.sprintHealth}`);

    // 4. Check ticket quality for all tickets
    console.log('Checking ticket quality...');
    const qualityResults = [];
    for (const ticket of sprintData.tickets) {
      console.log(`Checking quality for ${ticket.key}...`);
      const quality = await checkTicketQuality(ticket, refinementDoc, techDesignDoc);
      qualityResults.push({
        ticketKey: ticket.key,
        ...quality
      });
    }

    // 5. Generate action items
    console.log('Generating action items...');
    const actionItems = await generateActionItems(sprintAnalysis, qualityResults, sprintData);

    // 6. Return results
    console.log('Analysis complete');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({
        success: true,
        sprintAnalysis,
        qualityResults,
        actionItems,
        sprintData: {
          sprint: sprintData.sprint,
          metrics: sprintData.metrics,
          ticketCount: sprintData.tickets.length
        }
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

/**
 * Fetch sprint data via MCP Jira server
 * TODO: Implement actual MCP integration
 */
async function fetchSprintDataViaMCP() {
  // Placeholder - will be replaced with MCP calls
  throw new Error('MCP Jira integration not yet implemented - see Story 2');
}

/**
 * Fetch documents via MCP Google Docs server
 * TODO: Implement actual MCP integration
 */
async function fetchDocsViaMCP() {
  // Placeholder - will be replaced with MCP calls
  throw new Error('MCP Google Docs integration not yet implemented - see Story 3');
}
