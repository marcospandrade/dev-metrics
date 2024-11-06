import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSprintCommand } from './delete-sprint.command';
import { SprintsUseCasesService } from '@modules/sprints/use-cases/sprints.use-cases.service';

@CommandHandler(DeleteSprintCommand)
export class DeleteSprintCommandHandler implements ICommandHandler<DeleteSprintCommand> {
    constructor(private readonly sprintUseCases: SprintsUseCasesService) {}

    async execute(command: DeleteSprintCommand) {
        return this.sprintUseCases.deleteSprint(command.sprintId);
    }
}
