import { SchemaValidator } from '@core/utils';
import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { NotifyServerLoginEvent } from '../events/notify-server-login.event';
// import { StartSyncingProjectEvent } from '../events/start-syncing-project.event';
// import { SyncIntegrationProjectCommand } from '../commands/sync-integration-project/sync-integration-project.command';
import { UpsertIntegrationServerCommand } from '../commands/upsert-integration-server/upsert-integration-server.command';

export class IntegrationServerSaga {
    @Saga()
    notifyServerNewLogin($: Observable<any>) {
        return $.pipe(
            ofType(NotifyServerLoginEvent),
            map(ev => SchemaValidator.toInstance(ev, UpsertIntegrationServerCommand)),
        );
    }

    // @Saga()
    // startSyncingProject($: Observable<any>) {
    //     return $.pipe(
    //         ofType(StartSyncingProjectEvent),
    //         map(ev => SchemaValidator.toInstance(ev, SyncIntegrationProjectCommand)),
    //     );
    // }
}
