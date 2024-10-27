import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { UpdateSprintCommand } from './update-sprint.command';
import { LoggerService } from '@core/logger/logger.service';
import { SprintsUseCasesService } from '@modules/sprints/use-cases/sprints.use-cases.service';

@CommandHandler(UpdateSprintCommand)
export class UpdateSprintCommandHandler implements ICommandHandler<UpdateSprintCommand> {
    public constructor(
        private readonly logger: LoggerService,
        private readonly sprintUseCases: SprintsUseCasesService,
        private readonly eventBus: EventBus,
    ) { }
    async execute(command: UpdateSprintCommand) {
        return this.sprintUseCases.updateSprint(command.id, command);
    }
}
