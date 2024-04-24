import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddTeamParticipantCommand } from './add-team-participant.command';
import { LoggerService } from '@core/logger/logger.service';
import { TeamUseCases } from '@modules/team/use-cases/team.use-cases';

@CommandHandler(AddTeamParticipantCommand)
export class AddTeamParticipantCommandHandler implements ICommandHandler<AddTeamParticipantCommand> {
    public constructor(
        private readonly teamUseCases: TeamUseCases,
        private readonly logger: LoggerService,
    ) {}

    public async execute(command: AddTeamParticipantCommand) {
        const { identifiers } = await this.teamUseCases.addParticipantToSpecificTeam(command);

        this.logger.info({ participantIds: identifiers }, 'Participants added to specific team:');

        return identifiers;
    }
}
