import { IsArray, ValidateNested } from 'class-validator';
import { CreateIssueDto } from '../../dto/create-issue.dto';
import { Type } from 'class-transformer';

export class SyncIssuesCommand {
    @IsArray()
    @Type(() => CreateIssueDto)
    @ValidateNested({ each: true })
    issues: CreateIssueDto[];
}
