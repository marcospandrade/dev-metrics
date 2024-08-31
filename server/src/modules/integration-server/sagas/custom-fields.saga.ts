import { SchemaValidator } from '@core/utils';
import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { SyncRelevantCustomFieldsEvent } from '../events/sync-relevant-custom-fields.event';
import { RegisterCustomFieldsCommand } from '../commands/register-custom-fields/register-custom-fields.command';

export class CustomFieldsSaga {
    @Saga()
    syncRelevantCustomFieldsEvent($: Observable<any>) {
        return $.pipe(
            ofType(SyncRelevantCustomFieldsEvent),
            map(ev => SchemaValidator.toInstance(ev, RegisterCustomFieldsCommand)),
        );
    }
}
