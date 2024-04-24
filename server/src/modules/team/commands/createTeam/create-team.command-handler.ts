import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTeamCommand } from './create-team.command';
import { TeamUseCases } from '@modules/team/use-cases/team.use-cases';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';
import { TeamCreatedWithParticipantsEvent } from '@modules/team/events/team-created-with-participants.event';

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

        console.log('COMMAND', participants);

        const newTeam = await this.teamUseCases.createTeam({ teamName }, userId);

        this.logger.info(newTeam, 'New team created: ');

        if (participants.length > 0) {
            console.log('COMMAND inside loop', participants);
            this.eventBus.publish(
                SchemaValidator.toInstance(
                    { teamId: newTeam.id, participants: command.participants },
                    TeamCreatedWithParticipantsEvent,
                ),
            );
        }

        return newTeam;
    }
}
