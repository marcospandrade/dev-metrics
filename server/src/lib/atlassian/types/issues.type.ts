import { PaginatedResponse } from './paginated-response.type';

export type PaginatedIssues<T> = Omit<PaginatedResponse<T>, 'values'> & {
    issues: T[];
};

export type QueryIssues = {
    maxResults?: number;
    startAt?: number;
    fields?: string[];
    jql?: string;
};

export type AtlassianIssue = {
    id: string;
    key: string;
    fields: IssueFields;
};

export type IssueFields = {
    summary: string;
    description: any;
};
