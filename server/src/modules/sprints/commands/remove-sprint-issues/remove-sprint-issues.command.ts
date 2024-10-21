import { RemoveSprintIssueDto } from "@modules/sprints/dtos/remove-sprint-issue.dto";
import { OmitType } from "@nestjs/mapped-types";

export class RemoveSprintIssuesCommand extends RemoveSprintIssueDto { }

export class RemoveSprintIssuesWithoutSprintCommand extends OmitType(RemoveSprintIssuesCommand, ['sprintId']) { }
