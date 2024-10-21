import { AddSprintIssueDto } from '@modules/sprints/dtos/add-sprint-issue.dto';
import { OmitType } from '@nestjs/mapped-types';

export class AddSprintIssuesCommand extends AddSprintIssueDto { }

export class AddSprintIssuesWithoutSprintCommand extends OmitType(AddSprintIssueDto, ['sprintId']) { }
