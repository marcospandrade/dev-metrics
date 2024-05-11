import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SyncIntegrationProjectCommand } from './sync-integration-project.command';
import { IntegrationServerUseCases } from '@modules/integration-server/use-cases/integration-server.use-cases.service';

@CommandHandler(SyncIntegrationProjectCommand)
export class SyncIntegrationProjectCommandHandler implements ICommandHandler<SyncIntegrationProjectCommand> {
    public constructor(private readonly integrationServerUseCases: IntegrationServerUseCases) {}
    execute(command: SyncIntegrationProjectCommand): Promise<any> {
        console.log({ command }, 'Starting syncing project...');

        // return this.integrationServerUseCases.getAllTickets(command.projectId, command.userEmail);
        return new Promise(() => {
            return command;
        });
    }
}
