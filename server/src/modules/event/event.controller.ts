import { Controller, Sse, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { Observable } from 'rxjs';

import { EventService } from './event.service';
import { Header } from '@nestjs/common';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Version(VERSION_NEUTRAL)
    @Sse()
    sse(): Observable<MessageEvent> {
        return this.eventService.listen$();
    }

    @Version(VERSION_NEUTRAL)
    @Sse('internal')
    @Header('Connection', 'keep-alive')
    @Header('Content-Type', 'text/event-stream')
    @Header('Cache-Control', 'no-cache')
    sseInternal(): Observable<string> {
        return this.eventService.listenInternal$();
    }
}
