import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NatsModule } from '@core/nats/nats.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { QueueService } from './queue.service';
import { QueuePublishEventHandler } from './commands/handlers/queue-publish-event.handler';

const CommandHandlers = [QueuePublishEventHandler];

@Module({
    imports: [
        EventEmitterModule.forRoot({
            delimiter: '.',
            newListener: true,
            removeListener: true,
            wildcard: true,
        }),
        NatsModule.register({ name: 'dev-metrics-server' }),
        CqrsModule,
    ],
    providers: [QueueService, ...CommandHandlers],
    exports: [QueueService, EventEmitterModule],
})
export class QueueModule {}
