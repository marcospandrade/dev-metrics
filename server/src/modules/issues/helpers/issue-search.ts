export const ISSUES_SEARCH_FIELDS = ['jiraIssueKey', 'summary'];

export type IssueSearch = {
    jiraIssueKey?: string;
    summary?: string;
};
