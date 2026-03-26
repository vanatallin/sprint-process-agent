/**
 * Sprint Agent - Main Lambda Handler
 *
 * Story 7 - Backend Integration
 * Owner: [Assign engineer working on Story 7]
 *
 * Orchestrates the sprint analysis workflow:
 * 1. Fetch sprint data (via MCP) - Story 2
 * 2. Fetch Google Docs (via MCP) - Story 9
 * 3. Analyze sprint health (Claude) - Story 4
 * 4. Check ticket quality (Claude) - Story 5
 * 5. Generate action items (Claude) - Story 7
 * 6. Post to Slack - Story 11
 * 7. Return results
 */

// Analyzers
const {
  analyzeSprintHealth,
  checkAllTicketsQuality,
  generateActionItems
} = require('./analyzers');

// Integrations
const { jira, googleDocs, storage } = require('./integrations');

/**
 * Main Lambda handler
 */
exports.handler = async (_event) => {
  console.log('Starting sprint analysis...');

  try {
    // 1. Fetch sprint data via MCP (Story 2)
    console.log('Fetching sprint data via MCP...');
    const sprintData = await jira.fetchSprintData();

    // 2. Fetch Google Docs via MCP (Story 9)
    console.log('Fetching documents via MCP...');
    const [refinementDoc, techDesignDoc] = await Promise.all([
      googleDocs.fetchRefinementDoc().catch(() => ''),
      googleDocs.fetchTechDesignDoc().catch(() => '')
    ]);

    // 3. Analyze sprint health with Claude (Story 4)
    console.log('Analyzing sprint health...');
    const sprintAnalysis = await analyzeSprintHealth(sprintData);
    console.log(`Sprint health: ${sprintAnalysis.sprintHealth}`);

    // 4. Check ticket quality for all tickets (Story 5)
    console.log('Checking ticket quality...');
    const qualityResults = await checkAllTicketsQuality(
      sprintData.tickets,
      refinementDoc,
      techDesignDoc
    );

    // 5. Generate action items (Story 7)
    console.log('Generating action items...');
    const actionItems = await generateActionItems(sprintAnalysis, qualityResults);

    // 6. Save results to S3/MinIO
    console.log('Saving analysis results to storage...');
    const analysisResults = {
      sprintAnalysis,
      qualityResults,
      actionItems,
      sprintData: {
        sprint: sprintData.sprint,
        metrics: sprintData.metrics,
        ticketCount: sprintData.tickets.length
      }
    };

    let storageResult = null;
    try {
      storageResult = await storage.saveDailyAnalysis(analysisResults);
      console.log(`Analysis saved to: ${storageResult.location}`);
    } catch (storageError) {
      // Log but don't fail - storage is not critical for the response
      console.error('Failed to save to storage:', storageError.message);
    }

    // 7. TODO: Post to Slack (Story 11)
    // await slack.postSprintHealthReport(sprintAnalysis, channel);

    // 8. Return results
    console.log('Analysis complete');
    return buildSuccessResponse({
      ...analysisResults,
      storage: storageResult
    });
  } catch (error) {
    console.error('Error:', error);
    return buildErrorResponse(error);
  }
};

/**
 * Build success response with CORS headers
 */
function buildSuccessResponse(data) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    },
    body: JSON.stringify({
      success: true,
      ...data
    })
  };
}

/**
 * Build error response with CORS headers
 */
function buildErrorResponse(error) {
  return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
    },
    body: JSON.stringify({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  };
}
