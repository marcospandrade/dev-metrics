import querystring from 'querystring'

import issuesService from '@/services/issues.service'
import { CustomTable } from '@/components/Table/CustomTable'
import { ProjectPageTabsEnum } from '../constants/tabs'
import { ISSUES_TABLE_DEFINITIONS, ISSUES_TABLE_HEADINGS } from '../constants/table'
interface IssueTableProps {
  selectedProjectId: string
  activeTab: ProjectPageTabsEnum
}

export function IssuesTable({ selectedProjectId, activeTab }: Readonly<IssueTableProps>) {
  async function fetchTicketsFromProject(selectedProjectId: string, page: number, pageSize: number, searchText?: string) {
    const searchObjects = {
      page,
      pageSize,
      searchText: searchText ?? '',
    }
  
    const searchString = querystring.stringify(searchObjects)
    return issuesService.getPaginatedIssues(selectedProjectId, searchString)
  }

  if (!selectedProjectId || activeTab !== ProjectPageTabsEnum.ISSUES) return <></>
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-indigo-100">
      <CustomTable
        tableTitle='List of Issues'
        searchInputPlaceholder='Search for issues or key here...'
        getData={fetchTicketsFromProject}
        headings={ISSUES_TABLE_HEADINGS}
        tableInfoFields={ISSUES_TABLE_DEFINITIONS}
        identifierTableId={selectedProjectId}
      ></CustomTable>
    </div>
  )
}
