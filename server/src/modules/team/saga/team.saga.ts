import { SchemaValidator } from '@core/utils';
import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import { AddTeamParticipantCommand } from '../commands/addTeamParticipants/add-team-participant.command';
import { TeamCreatedWithParticipantsEvent } from '../events/team-created-with-participants.event';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class TeamSaga {
    public constructor(private readonly logger: LoggerService) {}

    @Saga()
    addParticipantToSpecificTeam($: Observable<any>) {
        return $.pipe(
            ofType(TeamCreatedWithParticipantsEvent),
            tap(() => this.logger.info('Saga getting AddParticipantEvent and mapping to AddTeamParticipantCommand')),
            map(ev => SchemaValidator.toInstance(ev, AddTeamParticipantCommand)),
        );
    }
}
