import { SchemaValidator } from '@core/utils';
import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { NotifyProjectLoginEvent } from '../events/notify-project-login.event';
import { CheckSyncIntegrationProjectCommand } from '../commands/check-sync-integration-project/check-sync-integration-project.command';

export class IntegrationProjectSaga {
    @Saga()
    notifyProjectLogin($: Observable<any>) {
        return $.pipe(
            ofType(NotifyProjectLoginEvent),
            map(ev => SchemaValidator.toInstance(ev, CheckSyncIntegrationProjectCommand)),
        );
    }
}
