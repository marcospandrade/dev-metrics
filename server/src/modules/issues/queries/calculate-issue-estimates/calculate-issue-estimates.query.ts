import { IsEnum } from 'class-validator';
import { HandleIssueCalculationCommand } from '../../commands/handle-issue-calculation/handle-issue-calculation.command';

export enum EstimateCalculationType {
    SUMMARY = 'summary',
    DESCRIPTION = 'description',
}
export class CalculateIssueEstimatesQuery extends HandleIssueCalculationCommand {
    @IsEnum(EstimateCalculationType)
    calculationType: EstimateCalculationType;
}
