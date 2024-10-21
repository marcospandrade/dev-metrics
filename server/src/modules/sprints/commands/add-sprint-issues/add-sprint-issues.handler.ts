import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { AddSprintIssuesCommand } from './add-sprint-issues.command';
import { LoggerService } from '@core/logger/logger.service';
import { SprintsUseCasesService } from '@modules/sprints/use-cases/sprints.use-cases.service';

@CommandHandler(AddSprintIssuesCommand)
export class AddSprintIssuesCommandHandler implements ICommandHandler<AddSprintIssuesCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly sprintUseCases: SprintsUseCasesService,
        private readonly eventBus: EventBus,
    ) { }
    async execute(command: AddSprintIssuesCommand): Promise<any> {
        // TODO: fix me
    }
}
