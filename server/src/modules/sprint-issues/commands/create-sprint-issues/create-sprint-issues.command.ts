import { BaseUUID } from '@core/database/entities/base.entity';
import { CreateSprintIssueDto } from '@modules/sprint-issues/dto/create-sprint-issue.dto';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class CreateSprintIssuesCommand {
    @IsArray()
    @Type(() => CreateSprintIssueDto)
    issuesList: CreateSprintIssueDto[];
}

export class CreateSprintIssueWithoutSprintCommand {
    @IsArray()
    @Type(() => BaseUUID)
    @ValidateNested({ each: true })
    issuesList: BaseUUID[];
}
