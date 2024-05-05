import { SchemaValidator } from '@core/utils';
import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { NotifyProjectLoginEvent } from '../events/notify-project-login.event';
import { CheckSyncIntegrationProjectCommand } from '../commands/check-sync-integration-project/check-sync-integration-project.command';
import { StartSyncingProjectEvent } from '../events/start-syncing-project.event';
import { SyncIntegrationProjectCommand } from '../commands/sync-integration-project/sync-integration-project.command';

export class IntegrationProjectSaga {
    @Saga()
    notifyProjectLogin($: Observable<any>) {
        return $.pipe(
            ofType(NotifyProjectLoginEvent),
            map(ev => SchemaValidator.toInstance(ev, CheckSyncIntegrationProjectCommand)),
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
