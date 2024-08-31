export type Issue = {
    id: string
    createdAt: Date
    updatedAt: Date
    summary: string
    jiraIssueId: string
    jiraIssueKey: string
    description?: string
    projectId: string
    sprintId?: string
}