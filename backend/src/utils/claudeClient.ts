/**
 * Claude API Client
 *
 * Shared client for all Claude analyzers.
 * Handles authentication and response parsing.
 */

import Anthropic from '@anthropic-ai/sdk';
import { getParameter } from './ssm.js';
import type { ClaudeMessageOptions, ClaudeResponse } from '../types/index.js';

let anthropic: Anthropic | null = null;

/**
 * Get or create Claude client (singleton)
 */
export async function getClaudeClient(): Promise<Anthropic> {
  if (anthropic) {
    return anthropic;
  }

  const apiKey = await getParameter('/sprint-poc/dev/claude-api-key');
  anthropic = new Anthropic({ apiKey });
  return anthropic;
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
    if (jsonMatch) {
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
