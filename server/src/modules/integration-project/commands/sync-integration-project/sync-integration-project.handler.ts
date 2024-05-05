import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SyncIntegrationProjectCommand } from './sync-integration-project.command';
import { IntegrationProjectUseCases } from '@modules/integration-project/use-cases/integration-project.use-cases.service';

@CommandHandler(SyncIntegrationProjectCommand)
export class SyncIntegrationProjectCommandHandler implements ICommandHandler<SyncIntegrationProjectCommand> {
    public constructor(private readonly integrationProjectUseCases: IntegrationProjectUseCases) {}
    execute(command: SyncIntegrationProjectCommand): Promise<any> {
        console.log('Test');
        return this.integrationProjectUseCases.getAllTickets(command.projectId, command.userEmail);
    }
}
