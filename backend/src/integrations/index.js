/**
 * Integrations Barrel Export
 *
 * Re-exports all integrations from individual modules.
 */

const jira = require('./jira');
const googleDocs = require('./googleDocs');
const slack = require('./slack');

module.exports = {
  jira,
  googleDocs,
  slack
};
