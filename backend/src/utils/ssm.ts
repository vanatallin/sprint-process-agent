/**
 * AWS SSM Parameter Store utilities
 */

import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssmClient = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });

// Cache for parameters
const parameterCache = new Map<string, string>();

/**
 * Get parameter from SSM Parameter Store
 * Caches values for the duration of the Lambda execution
 */
export async function getParameter(name: string): Promise<string> {
  const cachedValue = parameterCache.get(name);
  if (cachedValue !== undefined) {
    return cachedValue;
  }

  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });

  const response = await ssmClient.send(command);
  const value = response.Parameter?.Value;

  if (!value) {
    throw new Error(`Parameter ${name} not found or has no value`);
  }

  parameterCache.set(name, value);
  return value;
}

/**
 * Clear parameter cache
 * Useful for testing
 */
export function clearCache(): void {
  parameterCache.clear();
}
