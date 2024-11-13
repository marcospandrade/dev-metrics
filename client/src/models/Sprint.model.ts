import { SprintIssue } from './SprintIssue.model';

export type Sprint = {
  createdAt: Date;
  goals: string;
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  teamId: string;
  updatedAt: string;
  userId: string;
  issuesList?: SprintIssue[];
};
