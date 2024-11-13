import querystring from 'querystring';
import issuesService from '@/services/issues.service';
import { CustomTable, SearchOptions } from '@/components/CustomTable/CustomTable';
import { ProjectPageTabsEnum } from '../../constants/tabs';
import { ISSUES_TABLE_DEFINITIONS, ISSUES_TABLE_HEADINGS } from '../../constants/table';
import { Issue } from '@/models/Issue.model';
import { GenericWithId, PaginatedData } from '@/helpers/typescript.helper';

interface IssueTableProps {
  selectedProjectId: string;
  activeTab: ProjectPageTabsEnum;
}

export function IssuesTable({ selectedProjectId, activeTab }: Readonly<IssueTableProps>) {
  async function fetchTicketsFromProject(
    selectedProjectId?: string,
    searchObject?: SearchOptions,
  ): Promise<PaginatedData<GenericWithId<Issue>> | undefined> {
    if (!selectedProjectId || !searchObject) return;

    const searchObjects = {
      page: searchObject.page,
      pageSize: searchObject.pageSize,
      searchText: searchObject?.searchText ?? '',
    };

    const searchString = querystring.stringify(searchObjects);
    return issuesService.getPaginatedIssues(selectedProjectId, searchString);
  }

  if (!selectedProjectId || activeTab !== ProjectPageTabsEnum.ISSUES) return <></>;
  return (
    <div className="relative overflow-x-auto bg-indigo-100 shadow-md sm:rounded-lg">
      <CustomTable
        tableTitle="List of Issues"
        searchInputPlaceholder="Search for issues or key here..."
        getData={fetchTicketsFromProject}
        headings={ISSUES_TABLE_HEADINGS}
        tableInfoFields={ISSUES_TABLE_DEFINITIONS}
        identifierTableId={selectedProjectId}
      ></CustomTable>
    </div>
  );
}
