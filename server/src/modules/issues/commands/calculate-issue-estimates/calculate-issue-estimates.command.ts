import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GenerateEstimateIssueDto } from '@modules/issues/dto/generate-estimate-issue.dto';

export class CalculateIssueEstimatesCommand {
    @IsArray()
    @Type(() => GenerateEstimateIssueDto)
    @ValidateNested({ each: true })
    issuesPool: GenerateEstimateIssueDto[];

    @Type(() => GenerateEstimateIssueDto)
    srcIssue: GenerateEstimateIssueDto;
}
