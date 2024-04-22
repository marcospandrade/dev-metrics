import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';

import { UpdatedOrderEvent } from '../events/updated-order.event';
import { UpdateOrderCommand } from '../commands/update-order/update-order-status.command';
import { SchemaValidator } from '@core/utils';
import { QueueIncomingMessageEvent } from '@modules/queue/events/queue-incoming-message.event';

@Injectable()
export class OrderSaga {
    @Saga()
    publishEventsToQueue($: Observable<any>) {
        return $.pipe(
            ofType(UpdatedOrderEvent),
            // filter((ev) => !!ev.orderId && ev.eventName === 'order-created'),
            map(ev => SchemaValidator.toInstance(ev as any, UpdateOrderCommand)),
        );
    }

    @Saga()
    receivedEventsFromQueue($: Observable<any>) {
        return $.pipe(
            ofType(QueueIncomingMessageEvent),
            map(ev => SchemaValidator.toInstance(ev, UpdateOrderCommand)),
        );
    }
}
