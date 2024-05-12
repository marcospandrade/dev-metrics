import { SchemaValidator } from '@core/utils';
import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { NotifyServerLoginEvent } from '../events/notify-server-login.event';
import { UpsertIntegrationServerCommand } from '../commands/upsert-integration-server/upsert-integration-server.command';
import { UpsertRawProjectsEvent } from '../events/upsert-raw-projects.event';
import { UpsertProjectsCommand } from '../commands/upsert-projects/upsert-projects.command';

export class IntegrationServerSaga {
    @Saga()
    notifyServerNewLogin($: Observable<any>) {
        return $.pipe(
            ofType(NotifyServerLoginEvent),
            map(ev => SchemaValidator.toInstance(ev, UpsertIntegrationServerCommand)),
        );
    }

    @Saga()
    upsertRawProjects($: Observable<any>) {
        return $.pipe(
            ofType(UpsertRawProjectsEvent),
            map(ev =>
                SchemaValidator.toInstance(
                    {
                        serverExternalId: ev.serverExternalId,
                        serverInternalId: ev.serverInternalId,
                        userEmail: ev.userEmail,
                    },
                    UpsertProjectsCommand,
                ),
            ),
        );
    }
}
