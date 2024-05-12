import { IsArray } from 'class-validator';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { Type } from 'class-transformer';

export class StartSyncIssuesEvent {
    @IsArray({ each: true })
    @Type(() => CreateIssueDto)
    issues: CreateIssueDto[];
}
