import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTeamCommand } from './update-team-command';
import { LoggerService } from '@core/logger/logger.service';
import { TeamUseCases } from '@modules/teams/use-cases/teams.use-cases';
import { SchemaValidator } from '@core/utils';
import { AddParticipantsToTeamEvent } from '@modules/teams/events/add-participants-to-team.event';

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamCommandHandler implements ICommandHandler {
    public constructor(
        private readonly logger: LoggerService,
        private readonly teamUseCases: TeamUseCases,
        private readonly eventBus: EventBus,
    ) {}

    public async execute(command: UpdateTeamCommand) {
        this.logger.info(command, 'Updating team using UpdateTeamCommand');

        const { teamId, teamName } = command;

        if (command.participants?.length > 0) {
            this.eventBus.publish(
                SchemaValidator.toInstance({ teamId, participants: command.participants }, AddParticipantsToTeamEvent),
            );
        }

        return this.teamUseCases.updateTeamById({ teamId, teamName });
    }
}
