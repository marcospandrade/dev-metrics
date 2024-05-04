import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { CreateTeamCommandHandler } from './commands/createTeam/create-team.command-handler';
import { TeamUseCases } from './use-cases/teams.use-cases';
import { TeamController } from './teams.controller';
import { Team } from './entities/team.entity';
import { Participant } from './entities/participant.entity';
import { TeamSaga } from './saga/teams.saga';
import { AddTeamParticipantCommandHandler } from './commands/addTeamParticipants/add-team-participant.command-handler';
import { UpdateTeamCommandHandler } from './commands/updateTeam/update-team.command-handler';

@Module({
    imports: [TypeOrmModule.forFeature([Team, Participant]), CqrsModule],
    controllers: [TeamController],
    providers: [
        TeamUseCases,
        CreateTeamCommandHandler,
        AddTeamParticipantCommandHandler,
        UpdateTeamCommandHandler,
        TeamSaga,
    ],
})
export class TeamsModule {}
