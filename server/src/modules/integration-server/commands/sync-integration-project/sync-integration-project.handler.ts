import { CommandHandler, EventBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { SyncIntegrationProjectCommand } from './sync-integration-project.command';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';

import { GetProjectSyncStatusQuery } from '@modules/integration-server/queries/get-project-sync-status/get-project-sync-status.query';
import { SchemaValidator } from '@core/utils';
import { LoggerService } from '@core/logger/logger.service';
import { CheckProjectIsSyncedDTO } from '@modules/integration-server/dto/check-project-is-synced.dto';
import { AtlassianIssue } from '@lib/atlassian/types/issues.type';
import { Project } from '@modules/integration-server/entities/project.entity';
import { StartSyncIssuesEvent } from '@modules/issues/events/start-sync-issues.event';
import { ProjectUseCases } from '@modules/integration-server/use-cases/projects.use-cases.service';

@CommandHandler(SyncIntegrationProjectCommand)
export class SyncIntegrationProjectCommandHandler implements ICommandHandler<SyncIntegrationProjectCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly projectUseCases: ProjectUseCases,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
    ) {}

    public async execute(command: SyncIntegrationProjectCommand): Promise<any> {
        this.logger.info({ command }, 'Checking project sync status...');
        const checkProjectIsSynced = await this.queryBus.execute<GetProjectSyncStatusQuery, CheckProjectIsSyncedDTO>(
            SchemaValidator.toInstance(command, GetProjectSyncStatusQuery),
        );

        this.logger.info({ checkProjectIsSynced }, 'Starting syncing project...');

        await this.getTicketForSync(checkProjectIsSynced.project, command.userEmail);

        return this.projectUseCases.updateOne(command.projectId, { isSynced: true });
    }

    public async getTicketForSync(project: Project, userEmail: string, offset: number = 0) {
        this.logger.info({ project, userEmail, offset }, 'Getting ticket to create sync events...');

        const { startAt, maxResults, total, issues } = await this.integrationServerUseCases.getAllTickets(
            project.integrationServer.jiraId,
            userEmail,
            {
                startAt: offset,
                maxResults: 50,
                jql: `project=${project.key}`,
                fields: ['description', 'summary', 'timetracking'],
            },
        );

        const newOffset = startAt + maxResults;
        this.logger.info({ issuesGot: issues.length, newOffset }, 'Got Tickeets from Atlassian...');

        this.generateSyncIssuesEvent(issues, project.id);

        if (newOffset < total) {
            return this.getTicketForSync(project, userEmail, newOffset);
        }
    }

    private generateSyncIssuesEvent(issues: AtlassianIssue[], projectId: string) {
        this.logger.info({ issuesLength: issues.length, projectId }, 'Generating ticket sync events...');
        const syncIssues = issues.map(issue => ({
            summary: issue.fields.summary,
            description: JSON.stringify(issue.fields.description),
            jiraIssueId: issue.id,
            jiraIssueKey: issue.key,
            projectId,
        }));

        this.eventBus.publish(SchemaValidator.toInstance({ issues: syncIssues }, StartSyncIssuesEvent));
    }
}
