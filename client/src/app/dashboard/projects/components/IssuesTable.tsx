import issuesService from '@/services/issues.service'
import { toast } from 'react-toastify'
import { ProjectPageTabsEnum } from '../constants/tabs'
import { CustomTable } from '@/components/Table/CustomTable'
import { ISSUES_TABLE_DEFINITIONS, ISSUES_TABLE_HEADINGS } from '../constants/table'
import querystring from 'querystring'
interface IssueTableProps {
  selectedProjectId: string
  activeTab: ProjectPageTabsEnum
}
const TableHeads = ['Id', 'Summary', 'Description', 'Last sprint', 'Story Points', 'Created At']

export function IssuesTable({ selectedProjectId, activeTab }: Readonly<IssueTableProps>) {
  async function fetchTicketsFromProject(selectedProjectId: string, page: number, pageSize: number, searchText?: string) {
    const searchObjects = {
      page,
      pageSize,
      searchText: searchText ?? '',
    }
  
    const searchString = querystring.stringify(searchObjects)
    const data = await issuesService.getPaginatedIssues(selectedProjectId, searchString)
    toast.success('Project fetched successfully')

    return data
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
