import querystring from 'querystring';
import {
  ISSUES_TABLE_DEFINITIONS,
  ISSUES_TABLE_HEADINGS,
} from '@/app/dashboard/projects/constants/table';
import { CustomTable, SearchOptions } from '@/components/CustomTable/CustomTable';
import { Card, CardBody } from '@/lib/material';
import issuesService from '@/services/issues.service';
import { GenericWithId, PaginatedData } from '@/helpers/typescript.helper';
import { Issue } from '@/models/Issue.model';

interface ThirdStepProps {
  selectedProjectId: string;
  validateIsChecked: (id: string) => boolean;
  onSelectCheckbox: (item: Issue) => void;
  selectedItemsLength: number;
}

export function ThirdStep({
  selectedProjectId,
  validateIsChecked,
  onSelectCheckbox,
  selectedItemsLength,
}: Readonly<ThirdStepProps>) {
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

  return (
    <Card className="flex flex-1">
      <CardBody>
        <CustomTable
          tableTitle="List of Issues"
          searchInputPlaceholder="Search for issues or key here..."
          getData={fetchTicketsFromProject}
          headings={ISSUES_TABLE_HEADINGS}
          tableInfoFields={ISSUES_TABLE_DEFINITIONS}
          identifierTableId={selectedProjectId}
          useCheckbox
          validateIsChecked={validateIsChecked}
          onSelectCheckbox={onSelectCheckbox}
          selectedItemsLength={selectedItemsLength}
        />
      </CardBody>
    </Card>
  );
}
