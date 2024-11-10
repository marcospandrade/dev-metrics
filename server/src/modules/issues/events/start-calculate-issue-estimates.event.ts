import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GenerateEstimateIssueDto } from '../dto/generate-estimate-issue.dto';

export class StartCalculateIssueEstimatesEvent {
    @IsArray()
    @Type(() => GenerateEstimateIssueDto)
    @ValidateNested({ each: true })
    issuesPool: GenerateEstimateIssueDto[];

    @Type(() => GenerateEstimateIssueDto)
    srcIssue: GenerateEstimateIssueDto;
}
