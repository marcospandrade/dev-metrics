export type PaginatedResponse<T> = {
    maxResults: number;
    startAt: number;
    total: number;
    values: T[];
};
