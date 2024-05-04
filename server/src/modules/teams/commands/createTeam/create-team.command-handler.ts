import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTeamCommand } from './create-team.command';
import { TeamUseCases } from '@modules/teams/use-cases/teams.use-cases';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';
import { AddParticipantsToTeamEvent } from '@modules/teams/events/add-participants-to-team.event';

@CommandHandler(CreateTeamCommand)
export class CreateTeamCommandHandler implements ICommandHandler<CreateTeamCommand> {
    public constructor(
        private readonly teamUseCases: TeamUseCases,
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService,
    ) {}
    async execute(command: CreateTeamCommand) {
        this.logger.info(command, 'Creating team using CreateTeamCommand');

        const { teamName, userId, participants } = command;

        const newTeam = await this.teamUseCases.createTeam({ teamName }, userId);

        this.logger.info(newTeam, 'New team created: ');

        if (participants.length > 0) {
            this.eventBus.publish(
                SchemaValidator.toInstance(
                    { teamId: newTeam.id, participants: command.participants },
                    AddParticipantsToTeamEvent,
                ),
            );
        }

        return newTeam;
    }
}
