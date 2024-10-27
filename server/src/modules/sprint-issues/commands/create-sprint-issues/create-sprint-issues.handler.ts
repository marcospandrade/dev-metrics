import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { LoggerService } from '@core/logger/logger.service';
import { CreateSprintIssuesCommand } from './create-sprint-issues.command';
import { SprintIssuesUseCasesService } from '@modules/sprint-issues/use-cases/sprint-issues.use-cases.service';

@CommandHandler(CreateSprintIssuesCommand)
export class CreateSprintIssuesCommandHandler implements ICommandHandler<CreateSprintIssuesCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly sprintIssuesUseCases: SprintIssuesUseCasesService,
        private readonly eventBus: EventBus,
    ) { }

    async execute(command: CreateSprintIssuesCommand): Promise<any> {
        return this.sprintIssuesUseCases.createMany(command.issuesList);
    }
}
