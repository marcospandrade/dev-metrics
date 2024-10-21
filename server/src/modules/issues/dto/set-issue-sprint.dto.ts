import { IsUUID } from 'class-validator';

export class SetIssueSprintDto {
  @IsUUID()
  id: string;

  @IsUUID()
  sprintId: string;
}
