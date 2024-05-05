import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { CheckSyncIntegrationProjectCommand } from './check-sync-integration-project.command';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';
import { StartSyncingProjectEvent } from '@modules/integration-server/events/start-syncing-project.event';

@CommandHandler(CheckSyncIntegrationProjectCommand)
export class CheckSyncIntegrationProjectCommandHandler implements ICommandHandler<CheckSyncIntegrationProjectCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly eventBus: EventBus,
    ) {}
    async execute(command: CheckSyncIntegrationProjectCommand): Promise<any> {
        this.logger.info(
            `Running CheckSyncIntegrationProjectCommand to check if the ${command.projectId} need to be synced`,
        );

        const checkProjectIsSynced = await this.integrationServerUseCases.checkProjectIsSynced(command.projectId);

        if (checkProjectIsSynced.synced) {
            this.logger.info({ command }, `Project already synced`);
            return;
        }
        return this.eventBus.publish<StartSyncingProjectEvent>(
            SchemaValidator.toInstance(
                { projectId: command.projectId, userEmail: checkProjectIsSynced.project.user.email },
                StartSyncingProjectEvent,
            ),
        );
    }
}
