import { SchemaValidator } from '@core/utils';
import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { CheckSyncProjectEvent } from '../events/check-sync-project.event';
import { SyncIntegrationProjectCommand } from '../commands/sync-integration-project/sync-integration-project.command';

export class ProjectSaga {
    @Saga()
    checkSyncProject($: Observable<any>) {
        return $.pipe(
            ofType(CheckSyncProjectEvent),
            map(ev => SchemaValidator.toInstance(ev, SyncIntegrationProjectCommand)),
        );
    }
}
