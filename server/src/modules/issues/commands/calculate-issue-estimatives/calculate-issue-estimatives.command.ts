import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GenerateEstimativeIssueDto } from '@modules/issues/dto/generate-estimative-issue.dto';

export class CalculateIssueEstimativesCommand {
    @IsArray()
    @Type(() => GenerateEstimativeIssueDto)
    @ValidateNested({ each: true })
    issuesPool: GenerateEstimativeIssueDto[];

    @Type(() => GenerateEstimativeIssueDto)
    srcIssue: GenerateEstimativeIssueDto;
}
