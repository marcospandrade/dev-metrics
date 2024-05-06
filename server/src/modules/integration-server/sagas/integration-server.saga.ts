import { SchemaValidator } from '@core/utils';
import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { NotifyServerLoginEvent } from '../events/notify-server-login.event';
// import { CheckSyncIntegrationProjectCommand } from '../commands/check-sync-integration-project/check-sync-integration-project.command';
import { StartSyncingProjectEvent } from '../events/start-syncing-project.event';
import { SyncIntegrationProjectCommand } from '../commands/sync-integration-project/sync-integration-project.command';
import { CreateIntegrationServerCommand } from '../commands/create-integration-server/create-integration-server.command';

export class IntegrationServerSaga {
    @Saga()
    notifyServerNewLogin($: Observable<any>) {
        return $.pipe(
            ofType(NotifyServerLoginEvent),
            map(ev => SchemaValidator.toInstance(ev, CreateIntegrationServerCommand)),
        );
    }

    @Saga()
    startSyncingProject($: Observable<any>) {
        return $.pipe(
            ofType(StartSyncingProjectEvent),
            map(ev => SchemaValidator.toInstance(ev, SyncIntegrationProjectCommand)),
        );
    }
}
