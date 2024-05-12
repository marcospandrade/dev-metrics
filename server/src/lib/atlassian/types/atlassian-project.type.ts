export type PaginatedResponse<T> = {
    maxResults: number;
    startAt: number;
    total: number;
    values: T[];
};

export type AtlassianProject = {
    id: string;
    key: string;
    name: string;
    uuid: string;
    projectTypeKey: string;
    isPrivate: boolean;
};
