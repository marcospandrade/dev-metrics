import { SchemaValidator } from '@core/utils';
import { QueryBus, Saga, ofType } from '@nestjs/cqrs';

import { Observable, map, switchMap } from 'rxjs';

import { CheckHasOnlyOneProjectEvent } from '../events/check-has-only-one-project.event';
import { GetProjectSyncStatusQuery } from '../queries/get-project-sync-status/get-project-sync-status.query';
import { GetProjectSyncStatusQueryHandler } from '../queries/get-project-sync-status/get-project-sync-status.handler';
import { SyncIntegrationProjectCommand } from '../commands/sync-integration-project/sync-integration-project.command';

export class ProjectSaga {
    public constructor(private readonly queryBus: QueryBus) {}

    // @Saga()
    // checkServerHasOnlyOneProject($: Observable<any>) {
    //     $.pipe(
    //         ofType(CheckHasOnlyOneProjectEvent),
    //         // map(ev =>
    //         //     this.queryBus.execute(SchemaValidator.toInstance({ jiraId: ev.cloudId }, GetProjectSyncStatusQuery)),
    //         // ),
    //         // map(ev => SchemaValidator.toInstance({ projectId: ev. }, SyncIntegrationProjectCommand)),
    //     );
    // }
}
