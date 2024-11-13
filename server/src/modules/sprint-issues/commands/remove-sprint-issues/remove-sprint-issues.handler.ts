import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { RemoveSprintIssuesCommand } from './remove-sprint-issues.command';
import { LoggerService } from '@core/logger/logger.service';
import { SprintIssuesUseCasesService } from '@modules/sprint-issues/use-cases/sprint-issues.use-cases.service';

@CommandHandler(RemoveSprintIssuesCommand)
export class RemoveSprintIssuesCommandHandler implements ICommandHandler<RemoveSprintIssuesCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly sprintIssuesUseCases: SprintIssuesUseCasesService,
        private readonly eventBus: EventBus,
    ) {}
    async execute(command: RemoveSprintIssuesCommand) {
        return this.sprintIssuesUseCases.deleteManyByIssueAndSprintIds(command);
    }
}
