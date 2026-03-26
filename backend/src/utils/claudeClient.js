/**
 * Claude API Client
 *
 * Shared client for all Claude analyzers.
 * Handles authentication and response parsing.
 */

const Anthropic = require('@anthropic-ai/sdk');
const { getParameter } = require('./ssm');

let anthropic = null;

/**
 * Get or create Claude client (singleton)
 * @returns {Promise<Anthropic>} Anthropic client instance
 */
async function getClaudeClient() {
  if (anthropic) {
    return anthropic;
  }

  const apiKey = await getParameter('/sprint-poc/dev/claude-api-key');
  anthropic = new Anthropic({ apiKey });
  return anthropic;
}

/**
 * Parse Claude response and extract JSON
 * @param {Object} response - Claude API response
 * @returns {Object} Parsed JSON object
 */
function parseClaudeResponse(response) {
  const text = response.content[0].text;

  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }

    console.error('Failed to parse Claude response:', text);
    throw new Error('Claude did not return valid JSON');
  }
}

/**
 * Send a message to Claude and get parsed JSON response
 * @param {Object} options - Request options
 * @param {string} options.systemPrompt - System prompt
 * @param {string} options.userPrompt - User prompt
 * @param {number} [options.maxTokens=2500] - Max tokens for response
 * @returns {Promise<Object>} Parsed JSON response
 */
async function sendClaudeMessage({ systemPrompt, userPrompt, maxTokens = 2500 }) {
  const client = await getClaudeClient();

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  return parseClaudeResponse(response);
}

module.exports = {
  getClaudeClient,
  parseClaudeResponse,
  sendClaudeMessage
};
