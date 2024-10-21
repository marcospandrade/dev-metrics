import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SetIssueSprintDto } from '@modules/issues/dto/set-issue-sprint.dto';

export class SetIssueSprintCommand {
    @IsArray()
    @Type(() => SetIssueSprintDto)
    @ValidateNested({ each: true })
    issues: SetIssueSprintDto[];
}
