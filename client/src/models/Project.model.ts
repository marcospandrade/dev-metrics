export type Project = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    atlassianId: string;
    key: string;
    name: string;
    projectTypeKey: string;
    isPrivate: boolean;
    isSynced: boolean;
    integrationServerId?: string;
    integrationUUID?: string;
}