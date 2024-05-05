export const BASE_ATLASSIAN_URL = 'https://api.atlassian.com';

export const generateBasicAtlassianUrl = (cloudId: string) => `${BASE_ATLASSIAN_URL}/ex/jira/${cloudId}/rest/api/3`;
