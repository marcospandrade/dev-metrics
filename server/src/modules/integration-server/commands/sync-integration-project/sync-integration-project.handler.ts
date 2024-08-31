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
import { CustomFieldsUseCases } from '@modules/integration-server/use-cases/custom-fields.use-cases.service';

@CommandHandler(SyncIntegrationProjectCommand)
export class SyncIntegrationProjectCommandHandler implements ICommandHandler<SyncIntegrationProjectCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly projectUseCases: ProjectUseCases,
        private readonly customFieldsUseCases: CustomFieldsUseCases,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
    ) {}

    public async execute(command: SyncIntegrationProjectCommand): Promise<any> {
        this.logger.info({ command }, 'Checking project sync status...');
        const { integrationServerId, project, synced } = await this.queryBus.execute<
            GetProjectSyncStatusQuery,
            CheckProjectIsSyncedDTO
        >(SchemaValidator.toInstance(command, GetProjectSyncStatusQuery));

        this.logger.info({ project, synced }, 'Starting syncing project...');

        await this.getTicketForSync(integrationServerId, project, command.userEmail);

        return this.projectUseCases.updateOne(command.projectId, { isSynced: true });
    }

    public async getTicketForSync(
        integrationServerId: string,
        project: Project,
        userEmail: string,
        offset: number = 0,
    ) {
        this.logger.info({ project, userEmail, offset }, 'Getting ticket to create sync events...');
        const customFields = await this.customFieldsUseCases.getCustomFieldIds(integrationServerId);

        const customFieldsMap = this.customFieldsUseCases.createCustomFieldMap(customFields);

        const { startAt, maxResults, total, issues } = await this.integrationServerUseCases.getAllTickets(
            project.integrationServer.jiraId,
            userEmail,
            {
                startAt: offset,
                maxResults: 50,
                jql: `project=${project.key}`,
                fields: ['description', 'summary', 'timetracking', ...customFieldsMap.keys()],
            },
        );

        const newOffset = startAt + maxResults;
        this.logger.info({ issuesGot: issues.length, newOffset }, 'Got Tickeets from Atlassian...');

        this.generateSyncIssuesEvent(issues, project.id, customFieldsMap);

        if (newOffset < total) {
            return this.getTicketForSync(integrationServerId, project, userEmail, newOffset);
        }
    }

    private generateSyncIssuesEvent(issues: AtlassianIssue[], projectId: string, customFieldsMap: Map<string, string>) {
        this.logger.info({ issuesLength: issues.length, projectId }, 'Generating ticket sync events...');
        const syncIssues = issues.map(issue => {
            const customFields = this.identifyCustomFieldsValues(issue.fields, customFieldsMap);

            return {
                summary: issue.fields.summary,
                description: JSON.stringify(issue.fields.description),
                jiraIssueId: issue.id,
                jiraIssueKey: issue.key,
                projectId,
                customFields: customFields,
            };
        });

        this.eventBus.publish(SchemaValidator.toInstance({ issues: syncIssues }, StartSyncIssuesEvent));
    }

    private identifyCustomFieldsValues(fields: Record<string, any>, customFieldsMap: Map<string, string>) {
        return Object.keys(fields).reduce((acc, fieldKey) => {
            if (customFieldsMap.has(fieldKey)) {
                acc[customFieldsMap.get(fieldKey)] = fields[fieldKey];
            }
            return acc;
        }, {});
    }
}
