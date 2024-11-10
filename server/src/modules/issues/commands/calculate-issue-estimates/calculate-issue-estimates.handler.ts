import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IssueUseCases } from '@modules/issues/use-cases/issues.use-cases.service';
import { UpdateIssueDto } from '@modules/issues/dto/update-issue.dto';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';
import { CalculateIssueEstimatesCommand } from './calculate-issue-estimates.command';
import { PolynomialRegression } from 'ml-regression-polynomial';
import regression from 'regression';
import { linearRegression, linearRegressionLine } from 'simple-statistics';

export const ACCEPTABLE_SIMILARITY = 0.15;
export const PREDICT_COMPLEXITY = 0.25;
@CommandHandler(CalculateIssueEstimatesCommand)
export class CalculateIssueEstimativesCommandHandler implements ICommandHandler<CalculateIssueEstimatesCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly issueUseCases: IssueUseCases,
    ) {}

    public async execute(command: CalculateIssueEstimatesCommand): Promise<any> {
        this.logger.info({ command }, 'Starting to calculate estimatives...');

        const similarities = await this.issueUseCases.calculateSimilarity(command.srcIssue, command.issuesPool);
        const eixoY = similarities.filter(s => s.similarity > ACCEPTABLE_SIMILARITY).map(s => s.storyPoint);
        const eixoX = similarities.filter(s => s.similarity > ACCEPTABLE_SIMILARITY).map(s => s.similarity);
        // const powers = [];
        const polynomialRegression = new PolynomialRegression(eixoX, eixoY, 5, {
            interceptAtZero: true,
        });

        const polynomialRegresionResult = polynomialRegression.predict(PREDICT_COMPLEXITY);
        const linearRegressionInput: [number, number][] = similarities
            .filter(s => s.similarity > ACCEPTABLE_SIMILARITY)
            .map(s => [s.similarity, s.storyPoint]);
        const linearRegressionResult = linearRegression(linearRegressionInput);

        const _linearRegressionResult = linearRegressionLine(linearRegressionResult)(PREDICT_COMPLEXITY);
        const exponentialRegressionResult = regression.exponential(linearRegressionInput).predict(PREDICT_COMPLEXITY);
        // TODO: calculate linear regression

        await this.issueUseCases.updateIssues([
            SchemaValidator.toInstance({ id: command.srcIssue.id, estimatedStoryPoints: 1 }, UpdateIssueDto),
        ]);
    }
}
