import { TableFields } from "@/components/CustomTable/CustomTable"
import { Issue } from "@/models/Issue.model"

export const SPRINTS_TABLE_HEADINGS: string[] = ['Id', 'Title']
export const SPRINTS_TABLE_DEFINITIONS: TableFields<Issue>[] = [
  {
    fieldDefinition: "jiraIssueKey",
    fieldName: 'Jira Id',
    isBold: true,
  },
  {
    fieldDefinition: "summary",
    fieldName: 'Title',
  }
]