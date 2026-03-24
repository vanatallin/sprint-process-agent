/**
 * AWS SSM Parameter Store utilities
 */

const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const ssmClient = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });

// Cache for parameters
const parameterCache = new Map();

/**
 * Get parameter from SSM Parameter Store
 * Caches values for the duration of the Lambda execution
 *
 * @param {string} name - Parameter name
 * @returns {Promise<string>} Parameter value
 */
async function getParameter(name) {
  if (parameterCache.has(name)) {
    return parameterCache.get(name);
  }

  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });

  const response = await ssmClient.send(command);
  const value = response.Parameter.Value;

  parameterCache.set(name, value);
  return value;
}

/**
 * Clear parameter cache
 * Useful for testing
 */
function clearCache() {
  parameterCache.clear();
}

module.exports = {
  getParameter,
  clearCache
};
