import { TableFields } from '@/components/CustomTable/CustomTable'
import { Issue } from '@/models/Issue.model'

export const ISSUES_TABLE_HEADINGS: string[] = ['Jira Issue ID', 'Title']
export const ISSUES_TABLE_DEFINITIONS: TableFields<Issue>[] = [
  {
    fieldDefinition: 'jiraIssueKey',
    fieldName: 'Jira Id',
    isBold: true,
  },
  {
    fieldDefinition: 'summary',
    fieldName: 'Title',
  },
]
