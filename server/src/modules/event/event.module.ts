import { Module } from '@nestjs/common';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [EventEmitterModule.forRoot(), CqrsModule],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}
