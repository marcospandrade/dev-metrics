import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { CreateSprintCommand } from './create-sprint.command';
import { LoggerService } from '@core/logger/logger.service';
import { SprintsUseCasesService } from '@modules/sprints/use-cases/sprints.use-cases.service';

@CommandHandler(CreateSprintCommand)
export class CreateSprintCommandHandler implements ICommandHandler<CreateSprintCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly sprintUseCases: SprintsUseCasesService,
        private readonly eventBus: EventBus,
    ) { }
    async execute(command: CreateSprintCommand) {
        return await this.sprintUseCases.createSprint(command);
    }
}
