import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IssueUseCases } from '@modules/issues/use-cases/issues.use-cases.service';
import { LoggerService } from '@core/logger/logger.service';
import { CalculateIssueEstimatesQuery, EstimateCalculationType } from './calculate-issue-estimates.query';
import regression from 'regression';
import { linearRegression, linearRegressionLine } from 'simple-statistics';
import { FibonacciHelpers } from '@modules/issues/helpers/fibonacci';

export const ACCEPTABLE_SIMILARITY = 0.15;
export const PREDICT_COMPLEXITY = 0.3;

@QueryHandler(CalculateIssueEstimatesQuery)
export class CalculateIssueEstimativesQuerydHandler implements IQueryHandler<CalculateIssueEstimatesQuery> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly issueUseCases: IssueUseCases,
    ) {}

    public async execute(command: CalculateIssueEstimatesQuery): Promise<number> {
        this.logger.info({ command }, 'Starting to calculate estimatives...');
        if (
            command.calculationType === EstimateCalculationType.DESCRIPTION &&
            command.srcIssue.description === 'null'
        ) {
            return 1;
        }

        const similarities = await this.issueUseCases.calculateSimilarity(
            command.srcIssue,
            command.issuesPool,
            command.calculationType,
        );

        const linearRegressionInput: [number, number][] = similarities
            .filter(s => s.similarity > ACCEPTABLE_SIMILARITY)
            .map(s => [s.similarity, s.storyPoint]);
        const linearRegressionResult = linearRegression(linearRegressionInput);
        const linearRegressionLineResult = linearRegressionLine(linearRegressionResult)(PREDICT_COMPLEXITY);
        const exponentialRegressionResult = regression.exponential(linearRegressionInput).predict(PREDICT_COMPLEXITY);

        const averageStoryPoint = Number(linearRegressionLineResult + exponentialRegressionResult[1]) / 2;

        return FibonacciHelpers.closestFibonacci(averageStoryPoint);
    }
}
