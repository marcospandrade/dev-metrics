import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';

import { QueuePublishEventCommand } from '@modules/queue/commands/queue-publish-event.command';

import { EventStacksUpdateCommand } from '../commands/event-stacks-update.command';
import { EventStacksCreatedEvent } from '../events/event-stacks-created.event';
import { CreateEventStackEvent } from '../events/create-event-stack.event';
import { EventStacksCreateCommand } from '../commands/event-stacks-create.command';
import { SchemaValidator } from '@core/utils';
import { UpdateEventStackEvent } from '../events/update-event-stack.event';

@Injectable()
export class EventStacksSaga {
    @Saga()
    publishEventsToQueue($: Observable<any>) {
        return $.pipe(
            ofType(EventStacksCreatedEvent),
            // filter(ev => !!ev.order && ev.eventName === 'order-created'),
            map(ev =>
                SchemaValidator.toInstance(
                    {
                        eventStackId: ev.id,
                        eventStacksName: ev.eventName,
                        entityId: ev.entityId,
                        metadata: ev.metadata,
                        eventKey: ev.eventKey,
                    },
                    QueuePublishEventCommand,
                ),
            ),
        );
    }

    @Saga()
    createEventStacks($: Observable<any>) {
        return $.pipe(
            ofType(CreateEventStackEvent),
            map(ev => SchemaValidator.toInstance(ev, EventStacksCreateCommand)),
        );
    }

    @Saga()
    updateEventStacks($: Observable<any>) {
        return $.pipe(
            ofType(UpdateEventStackEvent),
            map(ev => SchemaValidator.toInstance(ev, EventStacksUpdateCommand)),
        );
    }
}
