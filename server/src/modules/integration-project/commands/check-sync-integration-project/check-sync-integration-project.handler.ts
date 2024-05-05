import { ICommandHandler } from '@nestjs/cqrs';

import { CheckSyncIntegrationProjectCommand } from './check-sync-integration-project.command';
import { IntegrationProjectUseCases } from '@modules/integration-project/use-cases/integration-project.use-cases.service';
import { LoggerService } from '@core/logger/logger.service';

export class CheckSyncIntegrationProjectCommandHandler implements ICommandHandler<CheckSyncIntegrationProjectCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly integrationProjectUseCases: IntegrationProjectUseCases,
    ) {}
    async execute(command: CheckSyncIntegrationProjectCommand): Promise<any> {
        this.logger.info(`Syncing project ${command.url}`);

        const checkProjectIsSynced = await this.integrationProjectUseCases.checkProjectIsSynced(command.projectId);

        if (checkProjectIsSynced.synced) {
            this.logger.info({ command }, `Project already synced`);
            return;
        }
    }
}
