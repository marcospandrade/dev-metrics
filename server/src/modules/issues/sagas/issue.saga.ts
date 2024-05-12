import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { SchemaValidator } from '@core/utils';
import { StartSyncIssuesEvent } from '../events/start-sync-issues.event';
import { SyncIssuesCommand } from '../commands/sync-issues/sync-issues.command';

export class IssueSaga {
    @Saga()
    startSyncingIssues($: Observable<any>) {
        return $.pipe(
            ofType(StartSyncIssuesEvent),
            map(ev => SchemaValidator.toInstance(ev, SyncIssuesCommand)),
        );
    }
}
