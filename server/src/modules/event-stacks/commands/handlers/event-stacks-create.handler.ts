import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { firstValueFrom } from 'rxjs';

import { EventStacksCreatedEvent } from '@modules/event-stacks/events/event-stacks-created.event';
import { EventStacksService } from '@modules/event-stacks/event-stacks.service';
import { ValidateSchema } from '@core/decorators/validate-schema';
import { CustomClientNats } from '@core/nats/nats-client.proxy';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';

import { EventStacksCreateCommand } from '../event-stacks-create.command';

@CommandHandler(EventStacksCreateCommand)
export class EventStacksCreateHandler implements ICommandHandler<EventStacksCreateCommand> {
    constructor(
        private service: EventStacksService,
        private eventBus: EventBus,
        private logger: LoggerService,
        private clientProxy: CustomClientNats,
    ) {}

    @ValidateSchema(EventStacksCreateCommand)
    async execute(command: EventStacksCreateCommand) {
        const eventStack = await this.service.create(command);

        this.logger.info(`Created event stack ${eventStack.id} with name: ${eventStack.eventName}`);

        const kv = await firstValueFrom(
            this.clientProxy.createKeyValueStore$('event-stack-status-update', {
                history: 1,
            }),
        );

        this.logger.info(`Updating event stack cache with new eventId: ${eventStack.id}`);

        await kv.kvStore
            .put(
                eventStack.id,
                JSON.stringify({
                    status: 'PENDING',
                    eventId: eventStack.id,
                    eventKey: eventStack.eventKey,
                    entityId: eventStack.entityId,
                }),
            )
            .then(() => {
                this.logger.info(`Event stack cache updated with new eventId: ${eventStack.id}`);

                this.eventBus.publish(SchemaValidator.toInstance(eventStack, EventStacksCreatedEvent));
            })
            .catch(e => {
                this.logger.error(`Error updating event stack cache: ${e}`);
            });

        return eventStack;
    }
}
