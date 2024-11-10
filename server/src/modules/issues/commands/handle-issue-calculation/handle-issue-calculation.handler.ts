import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { HandleIssueCalculationCommand } from './handle-issue-calculation.command';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';
import {
    CalculateIssueEstimatesQuery,
    EstimateCalculationType,
} from '../../queries/calculate-issue-estimates/calculate-issue-estimates.query';
import { IssueUseCases } from '@modules/issues/use-cases/issues.use-cases.service';
import { UpdateIssueDto } from '@modules/issues/dto/update-issue.dto';
import { FibonacciHelpers } from '@modules/issues/helpers/fibonacci';
import { GenerateEstimateIssueDto } from '@modules/issues/dto/generate-estimate-issue.dto';

@CommandHandler(HandleIssueCalculationCommand)
export class HandleIssueCalculationCommandHandler implements ICommandHandler<HandleIssueCalculationCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly queryBus: QueryBus,
        private readonly issuesUseCases: IssueUseCases,
    ) {}

    async execute(command: HandleIssueCalculationCommand) {
        const { srcIssue, issuesPool } = command;
        this.logger.info(`Starting to calculate estimates for issue: ${srcIssue.jiraIssueKey}...`);
        let generatedStoryPointEstimate: number;

        if (srcIssue.description === 'null') {
            generatedStoryPointEstimate = await this.launchCalculateQuery(
                srcIssue,
                issuesPool,
                EstimateCalculationType.SUMMARY,
            );
        } else {
            const [summaryEstimate, descriptionEstimate] = await Promise.all([
                await this.launchCalculateQuery(srcIssue, issuesPool, EstimateCalculationType.SUMMARY),
                await this.launchCalculateQuery(srcIssue, issuesPool, EstimateCalculationType.DESCRIPTION),
            ]);
            generatedStoryPointEstimate = (summaryEstimate + descriptionEstimate) / 2;
        }

        return this.issuesUseCases.updateIssues([
            SchemaValidator.toInstance(
                {
                    id: command.srcIssue.id,
                    estimatedStoryPoints: FibonacciHelpers.closestFibonacci(generatedStoryPointEstimate),
                },
                UpdateIssueDto,
            ),
        ]);
    }

    private launchCalculateQuery(
        srcIssue: GenerateEstimateIssueDto,
        issuesPool: GenerateEstimateIssueDto[],
        calculationType: EstimateCalculationType,
    ) {
        return this.queryBus.execute<CalculateIssueEstimatesQuery, number>(
            SchemaValidator.toInstance(
                {
                    srcIssue,
                    issuesPool,
                    calculationType,
                },
                CalculateIssueEstimatesQuery,
            ),
        );
    }
}
