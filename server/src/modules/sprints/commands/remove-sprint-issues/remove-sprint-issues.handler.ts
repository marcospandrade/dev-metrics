import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { RemoveSprintIssuesCommand } from './remove-sprint-issues.command';
import { LoggerService } from '@core/logger/logger.service';
import { SprintsUseCasesService } from '@modules/sprints/use-cases/sprints.use-cases.service';

@CommandHandler(RemoveSprintIssuesCommand)
export class RemoveSprintIssuesCommandHandler implements ICommandHandler<RemoveSprintIssuesCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly sprintUseCases: SprintsUseCasesService,
        private readonly eventBus: EventBus,
    ) { }
    async execute(command: RemoveSprintIssuesCommand): Promise<any> {
        // TODO: fix me
    }
}
