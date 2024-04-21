import { MessageEvent } from '@nestjs/common';

export enum EventType {
    UPDATED_ORDER = 'UPDATED_ORDER',
}

export type ServerEmitterType = 'server.events';

export interface ServerSentEvent extends MessageEvent {
    type: EventType;
}
