import { Issue } from './Issue.model';

export type SprintIssue = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sprintId: string;
  issueId: string;
  issue: Issue;
};
