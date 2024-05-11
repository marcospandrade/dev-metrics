import { SchemaValidator } from '@core/utils';
import { QueryBus, Saga, ofType } from '@nestjs/cqrs';

import { Observable, filter, map, switchMap, tap } from 'rxjs';

import { CheckSyncProjectEvent } from '../events/check-sync-project.event';
import { GetProjectSyncStatusQuery } from '../queries/get-project-sync-status/get-project-sync-status.query';
import { SyncIntegrationProjectCommand } from '../commands/sync-integration-project/sync-integration-project.command';
import { CheckProjectIsSyncedDTO } from '../dto/check-project-is-synced.dto';

export class ProjectSaga {
    public constructor(private readonly queryBus: QueryBus) {}

    @Saga()
    checkSyncProject($: Observable<any>) {
        return $.pipe(
            ofType(CheckSyncProjectEvent),
            switchMap(ev =>
                this.queryBus.execute<GetProjectSyncStatusQuery, CheckProjectIsSyncedDTO>(
                    SchemaValidator.toInstance({ jiraId: ev.cloudId }, GetProjectSyncStatusQuery),
                ),
            ),
            tap(console.error),
            filter(ev => ev.synced),
            map(ev => SchemaValidator.toInstance(ev, SyncIntegrationProjectCommand)),
        );
    }
}
