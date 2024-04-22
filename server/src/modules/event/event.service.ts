import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { ServerEmitterType, ServerSentEvent } from './event.model';

@Injectable()
export class EventService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
    ) {}

    listen$(): Observable<MessageEvent> {
        return fromEvent(this.eventEmitter, 'server.events').pipe(map(values => values as MessageEvent));
    }

    publish(event: ServerEmitterType, message: ServerSentEvent): void {
        this.eventEmitter.emit(event, { ...message, id: uuid() });
    }

    listenInternal$() {
        return merge(this.commandBus, this.eventBus).pipe(
            map(ev => {
                return JSON.stringify(
                    ev && typeof ev === 'object' && { ...ev, internalEventName: ev.constructor.name },
                );
            }),
        );
    }
}
