import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventStacksService } from './event-stacks.service';
import { EventStacksCreateHandler } from './commands/handlers/event-stacks-create.handler';
import { EventStacksUpdateHandler } from './commands/handlers/event-stacks-update.handler';
import { EventStacksSaga } from './sagas/event-stacks.saga';
import { EventStacks } from './entities/event-stacks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const CommandHandlers = [EventStacksCreateHandler, EventStacksUpdateHandler];

const Sagas = [EventStacksSaga];

@Module({
    imports: [TypeOrmModule.forFeature([EventStacks]), CqrsModule],
    providers: [EventStacksService, ...CommandHandlers, ...Sagas],
    exports: [EventStacksService],
})
export class EventStacksModule {}
