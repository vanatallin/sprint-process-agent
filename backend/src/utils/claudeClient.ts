/**
 * Claude API Client
 *
 * Shared client for all Claude analyzers.
 * Handles authentication and response parsing.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getParameter } from './ssm.js';
import type { ClaudeMessageOptions, ClaudeResponse } from '../types/index.js';

// Client promise for lazy initialization
const clientPromise: Promise<Anthropic> = initializeClient();

/**
 * Get API key from environment or AWS SSM
 * For local development, set ANTHROPIC_API_KEY or CLAUDE_API_KEY environment variable
 */
async function getApiKey(): Promise<string> {
  // Check environment variables first (for local development)
  const envKey = process.env.ANTHROPIC_API_KEY ?? process.env.CLAUDE_API_KEY;
  if (envKey !== undefined && envKey !== '') {
    console.log('Using Claude API key from environment variable');
    return envKey;
  }

  // Fall back to AWS SSM (for deployed environments)
  console.log('Fetching Claude API key from AWS SSM...');
  return getParameter('/sprint-poc/dev/claude-api-key');
}

/**
 * Initialize Claude client
 */
async function initializeClient(): Promise<Anthropic> {
  const apiKey = await getApiKey();
  return new Anthropic({ apiKey });
}

/**
 * Get Claude client (singleton)
 */
export async function getClaudeClient(): Promise<Anthropic> {
  return clientPromise;
}

/**
 * Parse Claude response and extract JSON
 */
export function parseClaudeResponse<T>(response: ClaudeResponse): T {
  const text = response.content[0].text;

  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch !== null) {
      return JSON.parse(jsonMatch[1].trim()) as T;
    }

    console.error('Failed to parse Claude response:', text);
    throw new Error('Claude did not return valid JSON');
  }
}

/**
 * Send a message to Claude and get parsed JSON response
 */
export async function sendClaudeMessage<T>({
  systemPrompt,
  userPrompt,
  maxTokens = 2500
}: ClaudeMessageOptions): Promise<T> {
  const client = await getClaudeClient();

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  return parseClaudeResponse<T>(response as ClaudeResponse);
}
