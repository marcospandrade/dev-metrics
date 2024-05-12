import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { SyncIntegrationProjectCommand } from './sync-integration-project.command';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';

import { GetProjectSyncStatusQuery } from '@modules/integration-server/queries/get-project-sync-status/get-project-sync-status.query';
import { SchemaValidator } from '@core/utils';
import { LoggerService } from '@core/logger/logger.service';

@CommandHandler(SyncIntegrationProjectCommand)
export class SyncIntegrationProjectCommandHandler implements ICommandHandler<SyncIntegrationProjectCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly integrationServerUseCases: IntegrationServerUseCases,
        private readonly queryBus: QueryBus,
    ) {}
    public async execute(command: SyncIntegrationProjectCommand): Promise<any> {
        this.logger.info({ command }, 'Checking project sync status...');

        const checkProjectIsSynced = await this.queryBus.execute(
            SchemaValidator.toInstance(command, GetProjectSyncStatusQuery),
        );

        this.logger.info({ checkProjectIsSynced }, 'Starting syncing project...');

        // return this.integrationServerUseCases.getAllTickets(command.projectId, command.userEmail);
        return new Promise(() => {
            return command;
        });
    }
}
