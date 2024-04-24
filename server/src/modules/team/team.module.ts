import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

import { CreateTeamCommandHandler } from './commands/createTeam/create-team.command-handler';
import { TeamUseCases } from './use-cases/team.use-cases';
import { TeamController } from './team.controller';
import { Team } from './entities/team.entity';
import { Participant } from './entities/participant.entity';
import { TeamSaga } from './saga/team.saga';
import { AddTeamParticipantCommandHandler } from './commands/addTeamParticipants/add-team-participant.command-handler';

@Module({
    imports: [TypeOrmModule.forFeature([Team, Participant]), CqrsModule],
    controllers: [TeamController],
    providers: [TeamUseCases, CreateTeamCommandHandler, AddTeamParticipantCommandHandler, TeamSaga],
})
export class TeamModule {}
