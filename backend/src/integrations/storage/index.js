/**
 * Storage Integration (S3 / MinIO)
 *
 * Stores analysis results to S3 (production) or MinIO (local development).
 * MinIO is S3-compatible, so the same code works for both.
 *
 * Storage structure:
 *   sprint-analysis/
 *     ├── daily/
 *     │   └── {YYYY-MM-DD}/
 *     │       └── {timestamp}-analysis.json
 *     └── weekly/
 *         └── {YYYY-WW}/
 *             └── {timestamp}-report.json
 */

const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Configuration from environment
const config = {
  bucket: process.env.S3_BUCKET || 'sprint-agent-data',
  region: process.env.AWS_REGION || 'us-east-1',
  // For local MinIO development
  endpoint: process.env.S3_ENDPOINT || null,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true'
};

/**
 * Create S3 client configured for either AWS S3 or MinIO
 */
function createS3Client() {
  const clientConfig = {
    region: config.region
  };

  // If endpoint is set, use MinIO/local S3
  if (config.endpoint) {
    clientConfig.endpoint = config.endpoint;
    clientConfig.forcePathStyle = true; // Required for MinIO
    clientConfig.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'minioadmin',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin'
    };
  }

  return new S3Client(clientConfig);
}

let s3Client = null;

/**
 * Get or create S3 client (singleton)
 */
function getS3Client() {
  if (!s3Client) {
    s3Client = createS3Client();
  }
  return s3Client;
}

/**
 * Generate storage key for daily analysis
 * @param {Date} [date] - Date for the analysis (defaults to now)
 * @returns {string} S3 key path
 */
function getDailyKey(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timestamp = date.toISOString().replace(/[:.]/g, '-');
  return `daily/${dateStr}/${timestamp}-analysis.json`;
}

/**
 * Generate storage key for weekly report
 * @param {Date} [date] - Date for the report (defaults to now)
 * @returns {string} S3 key path
 */
function getWeeklyKey(date = new Date()) {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  const timestamp = date.toISOString().replace(/[:.]/g, '-');
  return `weekly/${year}-W${week.toString().padStart(2, '0')}/${timestamp}-report.json`;
}

/**
 * Get ISO week number
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Save daily analysis results to S3
 *
 * @param {Object} analysisResults - The full analysis results
 * @param {Object} analysisResults.sprintAnalysis - Sprint health analysis
 * @param {Array} analysisResults.qualityResults - Ticket quality results
 * @param {Array} analysisResults.actionItems - Generated action items
 * @param {Object} analysisResults.sprintData - Sprint metadata
 * @returns {Promise<Object>} Storage result with key and location
 */
async function saveDailyAnalysis(analysisResults) {
  const client = getS3Client();
  const key = getDailyKey();
  const timestamp = new Date().toISOString();

  const data = {
    timestamp,
    type: 'daily-analysis',
    ...analysisResults
  };

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
    Metadata: {
      'analysis-type': 'daily',
      'sprint-name': analysisResults.sprintData?.sprint?.name || 'unknown',
      'sprint-health': analysisResults.sprintAnalysis?.sprintHealth || 'unknown'
    }
  });

  await client.send(command);

  console.log(`Saved daily analysis to s3://${config.bucket}/${key}`);

  return {
    bucket: config.bucket,
    key,
    location: `s3://${config.bucket}/${key}`,
    timestamp
  };
}

/**
 * Save weekly report to S3
 *
 * @param {Object} reportData - Weekly report data
 * @returns {Promise<Object>} Storage result with key and location
 */
async function saveWeeklyReport(reportData) {
  const client = getS3Client();
  const key = getWeeklyKey();
  const timestamp = new Date().toISOString();

  const data = {
    timestamp,
    type: 'weekly-report',
    ...reportData
  };

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json',
    Metadata: {
      'report-type': 'weekly'
    }
  });

  await client.send(command);

  console.log(`Saved weekly report to s3://${config.bucket}/${key}`);

  return {
    bucket: config.bucket,
    key,
    location: `s3://${config.bucket}/${key}`,
    timestamp
  };
}

/**
 * Get analysis by key
 *
 * @param {string} key - S3 object key
 * @returns {Promise<Object>} Analysis data
 */
async function getAnalysis(key) {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key
  });

  const response = await client.send(command);
  const bodyString = await response.Body.transformToString();

  return JSON.parse(bodyString);
}

/**
 * List recent daily analyses
 *
 * @param {number} [days=7] - Number of days to look back
 * @returns {Promise<Array>} List of analysis metadata
 */
async function listRecentAnalyses(days = 7) {
  const client = getS3Client();
  const results = [];

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const command = new ListObjectsV2Command({
    Bucket: config.bucket,
    Prefix: 'daily/',
    MaxKeys: 100
  });

  const response = await client.send(command);

  if (response.Contents) {
    for (const item of response.Contents) {
      // Extract date from key: daily/YYYY-MM-DD/...
      const match = item.Key.match(/daily\/(\d{4}-\d{2}-\d{2})\//);
      if (match) {
        const itemDate = new Date(match[1]);
        if (itemDate >= startDate && itemDate <= endDate) {
          results.push({
            key: item.Key,
            date: match[1],
            lastModified: item.LastModified,
            size: item.Size
          });
        }
      }
    }
  }

  return results.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Check if storage is configured and accessible
 *
 * @returns {Promise<Object>} Health check result
 */
async function healthCheck() {
  try {
    const client = getS3Client();
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      MaxKeys: 1
    });

    await client.send(command);

    return {
      status: 'ok',
      bucket: config.bucket,
      endpoint: config.endpoint || 'AWS S3',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      bucket: config.bucket,
      endpoint: config.endpoint || 'AWS S3'
    };
  }
}

module.exports = {
  saveDailyAnalysis,
  saveWeeklyReport,
  getAnalysis,
  listRecentAnalyses,
  healthCheck,
  // Exposed for testing
  getDailyKey,
  getWeeklyKey
};
