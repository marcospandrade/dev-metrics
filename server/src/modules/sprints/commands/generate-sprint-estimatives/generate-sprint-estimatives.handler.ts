import { QueryBus, CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { GenerateSprintEstimativesCommand } from './generate-sprint-estimatives.command';
import { SprintsUseCasesService } from '@modules/sprints/use-cases/sprints.use-cases.service';
import { Issue } from '@modules/issues/entities/issue.entity';
import { NotFoundException } from '@nestjs/common';
import { SchemaValidator } from '@core/utils';
import { FindAllIssuesQuery } from '@modules/issues/queries/find-all-issues/find-all-issues.query';
import { GenerateEstimativeIssueDto } from '@modules/issues/dto/generate-estimative-issue.dto';
import { StartCalculateIssueEstimativesEvent } from '@modules/issues/events/start-calculate-issue-estimatives';

@CommandHandler(GenerateSprintEstimativesCommand)
export class GenerateSprintEstimativesCommandHandler implements ICommandHandler {
    public constructor(
        private readonly sprintUseCase: SprintsUseCasesService,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
    ) {}
    async execute(payload: GenerateSprintEstimativesCommand) {
        const sprint = await this.sprintUseCase.findById(payload.sprintId);
        const storyPointFieldName = this.extractStoryPointField(sprint.issuesList[0].issue);

        const allIssues = await this.queryBus.execute<FindAllIssuesQuery, Issue[]>(
            SchemaValidator.toInstance(
                {
                    projectId: sprint.issuesList[0].issue.project.id,
                },
                FindAllIssuesQuery,
            ),
        );

        const sprintIssues = new Set<GenerateEstimativeIssueDto>();
        const poolOfIssuesWithStoryPoint = allIssues.map(issue => {
            const storyPointValue = issue.customFields[storyPointFieldName];
            const issueWithStoryPoint = {
                ...issue,
                storyPoint: storyPointValue,
            };

            if (sprint.issuesList.find(issueList => issueList.issue.id === issue.id)) {
                sprintIssues.add(issueWithStoryPoint);
            }
            return issueWithStoryPoint;
        });

        sprintIssues.forEach(sprintIssue => {
            this.eventBus.publish(
                SchemaValidator.toInstance(
                    {
                        issuesPool: poolOfIssuesWithStoryPoint,
                        srcIssue: sprintIssue,
                    },
                    StartCalculateIssueEstimativesEvent,
                ),
            );
        });

        return 'OK';
    }

    extractStoryPointField(issue: Issue) {
        const storyPointField = issue.project.customFields.find(customField => Boolean(customField.isStoryPointField));
        if (!storyPointField) throw new NotFoundException('Story point field not found');
        return storyPointField.name;
    }
}
